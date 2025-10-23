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
        const cdnPath = `${CDN_CONFIG.baseUrl}/${username}/${repoName}/audio/`;
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

                this.audioFiles = createAudioData();

                this.currentIndex = 0;
                this.isPlaying = false;
                
                // Random playback related properties
                this.randomIndexArray = []; // Store random index array
                this.randomArrayIndex = 0;  // Current position in random array
                this.generateRandomIndexArray(); // Initialize random array

                // Initialize audio events and list display
                this.initAudioEvents();
                this.initTrackList();
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
                        this.currentIndex = index;
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
                this.playBtn.disabled = this.isPlaying;
                this.pauseBtn.disabled = !this.isPlaying;
                this.resumeBtn.disabled = this.isPlaying;
                this.stopAudioBtn.disabled = !this.isPlaying && this.audioPlayer.currentTime === 0;
                this.nextTrackBtn.disabled = !this.isPlaying && this.audioPlayer.currentTime === 0;

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
                        this.currentIndex = index;
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
            }

            initializeData() {
                // Get improvisation practice data
                const improvisationTree = createImprovisationData();

                // Recursively traverse tree structure, support standard node format
                let index = 0;
                const traverseTree = (node, path = []) => {
                    const currentPath = [...path, node.name];
                    
                    if (node.children.length === 0) {
                        // Leaf node
                        const fullName = currentPath.slice(1).join(' - '); // Skip root node
                        const itemData = { 
                            path: currentPath, 
                            index, 
                            fullName,
                            category: currentPath[1] // First level category like "Arpeggios", "Natural Scales", etc.
                        };
                        this.trie.insert(currentPath, itemData);
                        index++;
                    } else {
                        // Intermediate node, continue recursive traversal of child nodes
                        node.children.forEach(child => {
                            traverseTree(child, currentPath);
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
                this.startBtn.disabled = true;
                this.stopBtn.disabled = false;
                this.nextBtn.disabled = false;
                this.intervalInput.disabled = true;

                this.updateDisplay();
                this.startTimer();
            }

            stop() {
                this.isPlaying = false;
                this.startBtn.disabled = false;
                this.stopBtn.disabled = true;
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

                // Update current prompt
                this.currentPrompt.innerHTML = `
                    <h2>Current Exercise (${this.currentIndex + 1}/${this.ideas.length})</h2>
                    <div class="prompt-text">${current.fullName}</div>
                `;
                this.currentPrompt.classList.add('fade-in');
                setTimeout(() => {
                    this.currentPrompt.classList.remove('fade-in');
                }, 500);

                // Play text-to-speech
                const utterance = new SpeechSynthesisUtterance(current.fullName);
                utterance.lang = 'en-US';
                speechSynthesis.speak(utterance);
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
                        html += `<li class="exercise-item">${idea.fullName}</li>`;
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
