import { createImprovisationData } from './data.js';
import { createAudioData } from './audio-data.js';

// Configuration
const CDN_CONFIG = {
    // CDN base URL - you can change this to use different CDN providers
    baseUrl: 'https://testingcf.jsdelivr.net/gh',
    // Fallback to local files if CDN fails
    enableFallback: true,
    // Enable debug logging
    debug: true
};

// CDN and path utilities
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

function getAudioBasePath() {
    if (isGitHubPages()) {
        // Extract username and repo name from GitHub Pages URL
        // Format: https://username.github.io/repo-name/
        const pathParts = window.location.pathname.split('/').filter(part => part);
        const repoName = pathParts[0] || 'improv-prompt'; // fallback to default repo name
        const username = window.location.hostname.split('.')[0];
        
        // Use jsDelivr CDN for faster loading in regions with slow GitHub access
        // Format: https://testingcf.jsdelivr.net/gh/username/repo@main/audio/
        const cdnPath = `${CDN_CONFIG.baseUrl}/${username}/${repoName}@main/audio/`;
        if (CDN_CONFIG.debug) {
            console.log('Using CDN for audio files:', cdnPath);
        }
        return cdnPath;
    } else {
        // Local development or other hosting
        if (CDN_CONFIG.debug) {
            console.log('Using local audio files: audio/');
        }
        return 'audio/';
    }
}

function getAudioUrl(filename) {
    return getAudioBasePath() + filename;
}

// Escape values before interpolating them into HTML templates
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Trie node class
        class TrieNode {
            constructor() {
                this.children = new Map();
                this.isEnd = false;
                this.data = null;
            }
        }

        // Trie class
        class Trie {
            constructor() {
                this.root = new TrieNode();
                this.allItems = [];
            }

            insert(path, data) {
                let node = this.root;
                for (const segment of path) {
                    if (!node.children.has(segment)) {
                        node.children.set(segment, new TrieNode());
                    }
                    node = node.children.get(segment);
                }
                node.isEnd = true;
                node.data = data;
                this.allItems.push(data);
            }

            getAllItems() {
                return [...this.allItems];
            }
        }

        // Keeps the screen awake while the tool is on screen. iOS dims and locks the screen after
        // a while even when audio is playing, which blanks the exercise mid-practice.
        //
        // Two hard limits worth knowing:
        //  - the Screen Wake Lock API requires a secure context (https, or localhost for dev)
        //  - it cannot help once the user locks the phone; iOS owns the lock screen, so a locked
        //    device will always go dark after the auto-lock delay
        class WakeLockKeeper {
            constructor() {
                this._sentinel = null;
                this._wanted = false;

                // Browsers drop the lock whenever the page is hidden, so take it again on return.
                document.addEventListener('visibilitychange', () => {
                    if (!document.hidden && this._wanted) this.request();
                });
            }

            get supported() {
                return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
            }

            async request() {
                this._wanted = true;
                if (!this.supported || this._sentinel) return Boolean(this._sentinel);
                try {
                    this._sentinel = await navigator.wakeLock.request('screen');
                    this._sentinel.addEventListener('release', () => {
                        this._sentinel = null;
                    });
                    return true;
                } catch (error) {
                    if (CDN_CONFIG.debug) {
                        console.warn('Screen wake lock unavailable:', error && error.name);
                    }
                    return false;
                }
            }

            async release() {
                this._wanted = false;
                const sentinel = this._sentinel;
                this._sentinel = null;
                if (!sentinel) return;
                try {
                    await sentinel.release();
                } catch (error) {
                    // Already released by the browser.
                }
            }
        }

        // Audio manager class
        class AudioManager {
            constructor() {
                this.audioPlayer = document.getElementById('audioPlayer');
                this.currentIndex = 0;
                this.isPlaying = false;
                this.scaleHints = document.getElementById('scaleHints');
                this.trackDetails = document.getElementById('trackDetails');
                this.trackTitle = document.getElementById('trackTitle');
                this.trackTempo = document.getElementById('trackTempo');

                
                this.playModeSelect = document.getElementById('playMode');
                this.playBtn = document.getElementById('playBtn');
                this.pauseBtn = document.getElementById('pauseBtn');
                this.resumeBtn = document.getElementById('resumeBtn');
                this.stopAudioBtn = document.getElementById('stopAudioBtn');
                this.nextTrackBtn = document.getElementById('nextTrackBtn');
                this.volumeControl = document.getElementById('volumeControl');

                this.audioFiles = createAudioData();

                this.currentIndex = 0;
                this.isPlaying = false;

                // Current exercise, mirrored to the lock screen player
                this.currentIdeaText = '';
                this.ideaPosition = '';
                
                // Load saved volume or use default
                const savedVolume = localStorage.getItem('audioVolume');
                if (savedVolume !== null) {
                    this.audioPlayer.volume = parseFloat(savedVolume);
                    this.volumeControl.value = savedVolume;
                } else {
                    this.audioPlayer.volume = 1.0;
                    this.volumeControl.value = 1.0;
                }
                
                // Random playback related properties
                this.randomIndexArray = []; // Store random index array
                this.randomArrayIndex = 0;  // Current position in random array
                this.generateRandomIndexArray(); // Initialize random array

                // Initialize audio events and list display
                this.initAudioEvents();
                this.initTrackList();
                this.loadTrackFromUrl();
                this.initMediaSession();
            }

            // Lock screen / control centre player. Without this the system only knows about the
            // backing track, so a locked phone shows the track but not the exercise being played.
            initMediaSession() {
                if (!('mediaSession' in navigator)) return;

                const setHandler = (action, handler) => {
                    try {
                        navigator.mediaSession.setActionHandler(action, handler);
                    } catch (error) {
                        // Action unsupported on this browser - harmless.
                    }
                };

                setHandler('play', () => this.resume());
                setHandler('pause', () => this.pause());
                setHandler('nexttrack', () => this.nextTrack());
            }

            updateMediaSession() {
                if (!('mediaSession' in navigator) || typeof window.MediaMetadata === 'undefined') return;

                const track = this.audioFiles[this.currentIndex];
                if (!track) return;

                try {
                    const hasIdea = Boolean(this.currentIdeaText);
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: hasIdea ? this.currentIdeaText : track.name,
                        artist: `${hasIdea ? track.name : (track.title || track.name)} · ${track.tempo}`,
                        album: this.ideaPosition ? `Improv Practice · ${this.ideaPosition}` : 'Improv Practice',
                        artwork: [{ src: './favicon.svg', sizes: 'any', type: 'image/svg+xml' }]
                    });
                } catch (error) {
                    if (CDN_CONFIG.debug) {
                        console.warn('Media Session metadata failed:', error);
                    }
                }
            }

            // Called by the practice tool every time the exercise changes.
            setIdeaText(text, position) {
                this.currentIdeaText = text || '';
                this.ideaPosition = position || '';
                this.updateMediaSession();
            }

            setCurrentTrack(index) {
                this.currentIndex = index;
                
                // Update random sequence to include this track at current position
                // so that "Next" will work correctly from here
                const rIndex = this.randomIndexArray.indexOf(index);
                if (rIndex !== -1) {
                    // Swap current random index with the found index
                    [this.randomIndexArray[this.randomArrayIndex], this.randomIndexArray[rIndex]] = 
                    [this.randomIndexArray[rIndex], this.randomIndexArray[this.randomArrayIndex]];
                }
                
                // Update UI to show track details
                const track = this.audioFiles[this.currentIndex];
                this.updateTrackDetails(track);
                this.updateScaleHints(track);
                this.updateTrackListUI();
                this.updateMediaSession();
            }

            loadTrackFromUrl() {
                const urlParams = new URLSearchParams(window.location.search);
                const trackFile = urlParams.get('track');
                if (trackFile) {
                    const index = this.audioFiles.findIndex(f => f.file === trackFile);
                    if (index !== -1) {
                        this.setCurrentTrack(index);
                    }
                }
            }

            updateUrl() {
                const track = this.audioFiles[this.currentIndex];
                const url = new URL(window.location);
                url.searchParams.set('track', track.file);
                window.history.pushState({}, '', url);
            }



            // Generate random index array
            generateRandomIndexArray() {
                this.randomIndexArray = Array.from({ length: this.audioFiles.length }, (_, i) => i);
                this.shuffleArray(this.randomIndexArray);
                this.randomArrayIndex = 0;
            }

            // Get current index in random playback mode
            getCurrentRandomIndex() {
                if (this.randomIndexArray.length === 0) {
                    this.generateRandomIndexArray();
                }
                return this.randomIndexArray[this.randomArrayIndex];
            }

            // Move to next index in random playback mode
            moveToNextRandomIndex() {
                this.randomArrayIndex = (this.randomArrayIndex + 1) % this.randomIndexArray.length;
                return this.getCurrentRandomIndex();
            }

            shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            initAudioEvents() {
                this.playBtn.addEventListener('click', () => this.play());
                this.pauseBtn.addEventListener('click', () => this.pause());
                this.resumeBtn.addEventListener('click', () => this.resume());
                this.stopAudioBtn.addEventListener('click', () => this.stop());
                this.nextTrackBtn.addEventListener('click', () => this.nextTrack());
                this.volumeControl.addEventListener('input', (e) => {
                    const volume = e.target.value;
                    this.audioPlayer.volume = volume;
                    localStorage.setItem('audioVolume', volume);
                });

                this.audioPlayer.addEventListener('ended', () => this.handleTrackEnd());
                this.audioPlayer.addEventListener('error', () => this.handleError());
            }

            play() {
                const playMode = this.playModeSelect.value;
                if (playMode === 'random') {
                    this.currentIndex = this.getCurrentRandomIndex();
                } else if (playMode === 'sequential') {
                    // Keep current index, sequential playback
                }
                // repeat mode also keeps current index
                this.playCurrentTrack();
            }

            initTrackList() {
                const trackList = document.getElementById('trackList');
                trackList.innerHTML = '';

                this.audioFiles.forEach((track, index) => {
                    const trackItem = document.createElement('div');
                    trackItem.className = 'track-item';
                    trackItem.dataset.index = index;
                    
                    trackItem.innerHTML = `
                        <div class="track-name">${track.name}</div>
                        <div class="track-meta">${track.tempo} | ${track.title}</div>
                    `;
                    
                    trackItem.addEventListener('click', () => {
                        this.setCurrentTrack(index);
                        this.playCurrentTrack();
                    });
                    
                    trackList.appendChild(trackItem);
                });
            }

            updateTrackListUI() {
                const trackItems = document.querySelectorAll('.track-item');
                trackItems.forEach((item, index) => {
                    item.classList.toggle('active', index === this.currentIndex && this.isPlaying);
                });
            }

            playCurrentTrack() {
                const track = this.audioFiles[this.currentIndex];
                const primaryUrl = getAudioUrl(track.file);
                this.audioPlayer.src = primaryUrl;
                
                this.updateUrl();
                this.updateMediaSession();
                
                this.audioPlayer.play().then(() => {
                    this.isPlaying = true;
                    this.updateUI();
                    this.updateScaleHints(track);
                }).catch(error => {
                    if (CDN_CONFIG.debug) {
                        console.error('Playback failed with primary URL:', primaryUrl, error);
                    }
                    
                    // If we're using CDN and it fails, try fallback to local files
                    if (CDN_CONFIG.enableFallback && isGitHubPages() && primaryUrl.includes('jsdelivr.net')) {
                        if (CDN_CONFIG.debug) {
                            console.log('Attempting fallback to local audio files...');
                        }
                        this.audioPlayer.src = `audio/${track.file}`;
                        this.audioPlayer.play().then(() => {
                            this.isPlaying = true;
                            this.updateUI();
                            this.updateScaleHints(track);
                        }).catch(fallbackError => {
                            console.error('Fallback playback also failed:', fallbackError);
                            this.handleError();
                        });
                    } else {
                        this.handleError();
                    }
                });
            }

            pause() {
                this.audioPlayer.pause();
                this.isPlaying = false;
                this.updateUI();
            }

            resume() {
                this.audioPlayer.play().then(() => {
                    this.isPlaying = true;
                    this.updateUI();
                });
            }

            stop() {
                this.audioPlayer.pause();
                this.audioPlayer.currentTime = 0;
                this.isPlaying = false;
                this.updateUI();
                this.trackDetails.style.display = 'none';
                this.scaleHints.style.display = 'none';
            }

            nextTrack() {
                const playMode = this.playModeSelect.value;
                
                if (playMode === 'random') {
                    this.currentIndex = this.moveToNextRandomIndex();
                } else {
                    // sequential and repeat modes both use sequential switching
                    this.currentIndex = (this.currentIndex + 1) % this.audioFiles.length;
                }
                this.playCurrentTrack();
            }

            handleError() {
                this.isPlaying = false;
                this.updateUI();
                this.trackDetails.style.display = 'none';
            }

            updateUI() {
                // Toggle Play/Pause/Resume/Stop visibility
                if (!this.isPlaying && this.audioPlayer.currentTime === 0) {
                    // Initial state
                    this.playBtn.style.display = 'inline-block';
                    this.pauseBtn.style.display = 'none';
                    this.resumeBtn.style.display = 'none';
                    this.stopAudioBtn.style.display = 'none';
                } else if (this.isPlaying) {
                    // Playing state
                    this.playBtn.style.display = 'none';
                    this.pauseBtn.style.display = 'inline-block';
                    this.resumeBtn.style.display = 'none';
                    this.stopAudioBtn.style.display = 'inline-block';
                } else {
                    // Paused state
                    this.playBtn.style.display = 'none';
                    this.pauseBtn.style.display = 'none';
                    this.resumeBtn.style.display = 'inline-block';
                    this.stopAudioBtn.style.display = 'inline-block';
                }

                this.nextTrackBtn.disabled = false; // Always allow next track if we have tracks

                // Update audio list UI
                this.updateTrackListUI();

                if (this.isPlaying) {
                    const track = this.audioFiles[this.currentIndex];
                    this.updateTrackDetails(track);
                }
            }

            updateTrackDetails(track) {
                this.trackDetails.style.display = 'block';
                this.trackTitle.textContent = track.title;
                this.trackTempo.textContent = track.tempo;
                
                // Generate chord table, 4 per row
                const chordNames = track.chordNames.split(' | ');
                const chordFunctions = track.chordFunctions.split(' | ');
                
                // Clear existing content
                const chordTable = document.getElementById('chordTable');
                chordTable.innerHTML = '';
                
                // Create table structure, 4 chords per row
                const chordsPerRow = 4;
                
                for (let i = 0; i < chordNames.length; i += chordsPerRow) {
                    // Chord names row
                    const nameRow = document.createElement('tr');
                    nameRow.className = 'chord-names';
                    for (let j = 0; j < chordsPerRow && i + j < chordNames.length; j++) {
                        const td = document.createElement('td');
                        td.textContent = chordNames[i + j];
                        nameRow.appendChild(td);
                    }
                    chordTable.appendChild(nameRow);
                    
                    // Roman numeral analysis row
                    const functionRow = document.createElement('tr');
                    functionRow.className = 'chord-functions';
                    for (let j = 0; j < chordsPerRow && i + j < chordFunctions.length; j++) {
                        const td = document.createElement('td');
                        td.textContent = chordFunctions[i + j];
                        functionRow.appendChild(td);
                    }
                    chordTable.appendChild(functionRow);
                }
            }

            updateScaleHints(track) {
                this.scaleHints.style.display = 'block';
                const primaryHtml = track.scaleHints.primary.map(hint => `${hint}`).join('<br>');
                const alternateHtml = track.scaleHints.alternate.map(hint => `${hint}`).join('<br>');

                this.scaleHints.innerHTML = `
                    <div class="scale-category">
                        <h4>Primary Scale Options</h4>
                        <div class="scale-list">${primaryHtml}</div>
                    </div>
                    <div class="scale-category">
                        <h4>Alternate Scale Options</h4>
                        <div class="scale-list">${alternateHtml}</div>
                    </div>
                `;
            }

            handleTrackEnd() {
                const playMode = this.playModeSelect.value;
                
                if (playMode === 'repeat') {
                    // Repeat one, replay current track
                    this.playCurrentTrack();
                } else if (playMode === 'sequential') {
                    // Sequential play next track
                    this.nextTrack();
                } else if (playMode === 'random') {
                    // Play next according to random array
                    this.currentIndex = this.moveToNextRandomIndex();
                    this.playCurrentTrack();
                }
            }
        }

        // Improvisation practice tool class
        class ImprovisationTool {
            constructor() {
                this.trie = new Trie();
                this.currentIndex = 0;
                this.isPlaying = false;
                this.timer = null;
                this.progressTimer = null;
                this.intervalTime = 30000; // Default 30 seconds (matches HTML input default)
                this.startTime = 0;
                this.allIdeas = []; // Store all practice content
                
                // Initialize UI first, then initialize data
                this.initializeUI();
                this.initializeData();
                
                // Initialize audio manager
                this.audioManager = new AudioManager();

                // Keep the screen on while practising (see WakeLockKeeper for the caveats).
                this.wakeLock = new WakeLockKeeper();
                this.requestWakeLock();

                // Safari is more willing to grant the lock once the user has interacted.
                document.addEventListener('click', () => this.requestWakeLock(true));
            }

            requestWakeLock(reportFailure = false) {
                if (!this.wakeLock) return;
                this.wakeLock.request().then((granted) => {
                    if (!granted && reportFailure) this.showWakeLockHint();
                });
            }

            // Explains why the screen still dims when the API is out of reach (plain http pages)
            // or refuses the request even after a user gesture.
            showWakeLockHint() {
                if (this._wakeLockHintShown) return;
                this._wakeLockHintShown = true;
                const reason = this.wakeLock.supported
                    ? 'the browser refused the request'
                    : 'the page must be served over https';
                const hint = document.createElement('div');
                hint.id = 'wakeLockHint';
                hint.textContent = `Screen wake lock unavailable: ${reason}. ` +
                    'Meanwhile, raise iOS Settings > Display & Brightness > Auto-Lock.';
                hint.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;' +
                    'background:rgba(0,0,0,.85);color:#ffd979;padding:10px 12px;border-radius:8px;' +
                    'font:13px/1.5 -apple-system,system-ui,sans-serif;text-align:center';
                document.body.appendChild(hint);
                setTimeout(() => hint.remove(), 10000);
            }

            initializeData() {
                // Get improvisation practice data
                const improvisationTree = createImprovisationData();

                // Recursively traverse tree structure, support standard node format
                let index = 0;
                const traverseTree = (node, path = [], tooltips = []) => {
                    const currentPath = [...path, node.name];
                    // Inherit tooltips from ancestors so every leaf has an explanation
                    const currentTooltips = node.tooltip ? [...tooltips, node.tooltip] : tooltips;

                    if (node.children.length === 0) {
                        // Leaf node
                        const fullName = currentPath.slice(1).join(' - '); // Skip root node
                        const displayName = currentPath.slice(2).join(' - ') || fullName;
                        const itemData = { 
                            path: currentPath, 
                            index, 
                            fullName,
                            displayName,
                            category: currentPath[1], // First level category like "Arpeggios", "Natural Scales", etc.
                            tooltip: node.tooltip || currentTooltips[currentTooltips.length - 1] || '',
                            tooltipChain: currentTooltips
                        };
                        this.trie.insert(currentPath, itemData);
                        index++;
                    } else {
                        // Intermediate node, continue recursive traversal of child nodes
                        node.children.forEach(child => {
                            traverseTree(child, currentPath, currentTooltips);
                        });
                    }
                };

                traverseTree(improvisationTree);
                this.allIdeas = this.trie.getAllItems();
                this.ideas = [...this.allIdeas];
                this.shuffleArray(this.ideas);
                
                // Generate exercise list for display
                this.generateExerciseList();
                
                // Update display after data initialization is complete
                if (this.currentPrompt && this.ideas.length > 0) {
                    this.updateDisplay();
                }
            }

            shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            initializeUI() {
                this.startBtn = document.getElementById('startBtn');
                this.stopBtn = document.getElementById('stopBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.intervalInput = document.getElementById('interval');
                this.currentPrompt = document.getElementById('currentPrompt');
                this.progressFill = document.getElementById('progressFill');

                // Initialize display mode toggle
                this.displayModeRadios = document.querySelectorAll('input[name="displayMode"]');
                this.audioSection = document.getElementById('audioSection');
                this.exerciseSection = document.getElementById('exerciseSection');
                this.exerciseList = document.getElementById('exerciseList');

                this.startBtn.addEventListener('click', () => this.start());
                this.stopBtn.addEventListener('click', () => this.stop());
                this.nextBtn.addEventListener('click', () => this.next());
                this.intervalInput.addEventListener('change', () => this.updateInterval());

                // Add display mode toggle listeners
                this.displayModeRadios.forEach(radio => {
                    radio.addEventListener('change', () => this.toggleDisplayMode());
                });

                // Initial display
                this.currentPrompt.innerHTML = `
                    <h2>Current Exercise</h2>
                    <div class="prompt-text">Ready to start...</div>
                `;
            }

            updateInterval() {
                this.intervalTime = parseInt(this.intervalInput.value) * 1000;
                if (this.isPlaying) {
                    this.stop();
                    this.start();
                }
            }

            start() {
                this.isPlaying = true;
                this.startBtn.style.display = 'none';
                this.stopBtn.style.display = 'inline-block';
                this.nextBtn.disabled = false;
                this.intervalInput.disabled = true;

                this.updateDisplay();
                this.startTimer();
            }

            stop() {
                this.isPlaying = false;
                this.startBtn.style.display = 'inline-block';
                this.stopBtn.style.display = 'none';
                this.nextBtn.disabled = true;
                this.intervalInput.disabled = false;

                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                if (this.progressTimer) {
                    clearInterval(this.progressTimer);
                    this.progressTimer = null;
                }

                this.progressFill.style.width = '0%';
            }

            next() {
                this.currentIndex = (this.currentIndex + 1) % this.ideas.length;
                this.updateDisplay();
                if (this.isPlaying) {
                    this.startTimer();
                }
            }

            startTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                if (this.progressTimer) {
                    clearInterval(this.progressTimer);
                }

                this.startTime = Date.now();
                this.progressFill.style.width = '0%';

                // Progress bar update
                this.progressTimer = setInterval(() => {
                    const elapsed = Date.now() - this.startTime;
                    const progress = Math.min((elapsed / this.intervalTime) * 100, 100);
                    this.progressFill.style.width = `${progress}%`;
                }, 100);

                // Timer
                this.timer = setTimeout(() => {
                    if (this.isPlaying) {
                        this.next();
                    }
                }, this.intervalTime);
            }

            updateDisplay() {
                const current = this.ideas[this.currentIndex];
                const tooltipHtml = current.tooltipChain.length
                    ? `<div class="prompt-tooltip">${current.tooltipChain.map(escapeHtml).join('<br>')}</div>`
                    : '';

                // Update current prompt
                this.currentPrompt.innerHTML = `
                    <h2>Current Exercise (${this.currentIndex + 1}/${this.ideas.length})</h2>
                    <div class="prompt-text">${escapeHtml(current.fullName)}</div>
                    ${tooltipHtml}
                `;
                this.currentPrompt.classList.add('fade-in');
                setTimeout(() => {
                    this.currentPrompt.classList.remove('fade-in');
                }, 500);

                // Text-to-speech was removed on purpose. On iOS, window.speechSynthesis hands the
                // audio session over to AVSpeechSynthesizer, which interrupts the backing track for
                // about a second every time an idea is spoken (AudioContext goes to 'interrupted').
                // There is no web API to request mixing with it, and for timing-critical practice a
                // dropped beat is worse than not hearing the idea read aloud.

                // Mirror the exercise onto the lock screen / control centre player.
                if (this.audioManager) {
                    this.audioManager.setIdeaText(current.fullName, `${this.currentIndex + 1}/${this.ideas.length}`);
                }
            }

            toggleDisplayMode() {
                const selectedMode = document.querySelector('input[name="displayMode"]:checked').value;
                
                if (selectedMode === 'audio') {
                    this.audioSection.style.display = 'block';
                    this.exerciseSection.style.display = 'none';
                } else {
                    this.audioSection.style.display = 'none';
                    this.exerciseSection.style.display = 'block';
                }
            }

            generateExerciseList() {
                if (!this.exerciseList || !this.allIdeas) return;
                
                // Group exercises by category
                const categories = {};
                this.allIdeas.forEach(idea => {
                    const category = idea.category || 'Other';
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(idea);
                });

                // Generate HTML for exercise list
                let html = '';
                Object.keys(categories).forEach(category => {
                    html += `<div class="exercise-category">`;
                    html += `<h3>${category}</h3>`;
                    html += `<ul class="exercise-items">`;
                    
                    categories[category].forEach(idea => {
                        const tooltipAttr = idea.tooltipChain.length
                            ? ` title="${escapeHtml(idea.tooltipChain.join('\n'))}"`
                            : '';
                        const tooltipClass = idea.tooltip ? ' has-tooltip' : '';
                        html += `<li class="exercise-item${tooltipClass}"${tooltipAttr}>${escapeHtml(idea.displayName)}</li>`;
                    });
                    
                    html += `</ul>`;
                    html += `</div>`;
                });

                this.exerciseList.innerHTML = html;
            }

        }

        // Initialize application
        document.addEventListener('DOMContentLoaded', () => {
            // Show audio source info
            if (CDN_CONFIG.debug) {
                console.log('Initializing Improvisation Tool...');
                console.log('GitHub Pages detected:', isGitHubPages());
                console.log('Audio base path:', getAudioBasePath());
            }
            
            new ImprovisationTool();
        });
