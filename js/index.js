import { createImprovisationData } from './data.js';
import { createAudioData } from './audio-data.js';

// 字典树节点类
        class TrieNode {
            constructor() {
                this.children = new Map();
                this.isEnd = false;
                this.data = null;
            }
        }

        // 字典树类
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

        // 音频管理类
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
                this.shuffleArray(this.audioFiles);

                // 初始化音频事件和列表显示
                this.initAudioEvents();
                this.initTrackList();
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
                    this.currentIndex = Math.floor(Math.random() * this.audioFiles.length);
                } else if (playMode === 'sequential') {
                    // 保持当前索引，顺序播放
                }
                // repeat 模式也保持当前索引
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
                this.audioPlayer.src = `audio/${track.file}`;
                
                this.audioPlayer.play().then(() => {
                    this.isPlaying = true;
                    this.updateUI();
                    this.updateScaleHints(track);
                }).catch(error => {
                    console.error('播放失败:', error);
                    this.handleError();
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
                    this.currentIndex = Math.floor(Math.random() * this.audioFiles.length);
                } else {
                    // sequential 和 repeat 模式都使用顺序切换
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

                // 更新音频列表UI
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
                
                // 生成和弦表格，每行4个
                const chordNames = track.chordNames.split(' | ');
                const chordFunctions = track.chordFunctions.split(' | ');
                
                // 清空现有内容
                const chordTable = document.getElementById('chordTable');
                chordTable.innerHTML = '';
                
                // 创建表格结构，每行4个和弦
                const chordsPerRow = 4;
                
                for (let i = 0; i < chordNames.length; i += chordsPerRow) {
                    // 和弦名称行
                    const nameRow = document.createElement('tr');
                    nameRow.className = 'chord-names';
                    for (let j = 0; j < chordsPerRow && i + j < chordNames.length; j++) {
                        const td = document.createElement('td');
                        td.textContent = chordNames[i + j];
                        nameRow.appendChild(td);
                    }
                    chordTable.appendChild(nameRow);
                    
                    // 级数分析行
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
                    // 单曲循环，重新播放当前曲目
                    this.playCurrentTrack();
                } else if (playMode === 'sequential') {
                    // 顺序播放下一首
                    this.nextTrack();
                } else if (playMode === 'random') {
                    // 随机选择下一首
                    this.currentIndex = Math.floor(Math.random() * this.audioFiles.length);
                    this.playCurrentTrack();
                }
            }
        }

        // 即兴提示工具类
        class ImprovisationTool {
            constructor() {
                this.trie = new Trie();
                this.currentIndex = 0;
                this.isPlaying = false;
                this.timer = null;
                this.progressTimer = null;
                this.intervalTime = 10000; // 默认10秒
                this.startTime = 0;
                
                this.initializeData();
                this.initializeUI();
                
                // 初始化音频管理器
                this.audioManager = new AudioManager();
            }

            initializeData() {
                // 获取即兴练习数据
                const improvisationTree = createImprovisationData();

                // 递归遍历树结构，支持标准节点格式
                let index = 0;
                const traverseTree = (node, path = []) => {
                    const currentPath = [...path, node.name];
                    
                    if (node.children.length === 0) {
                        // 叶子节点
                        const fullName = currentPath.slice(1).join(' - '); // 跳过根节点
                        this.trie.insert(currentPath, { 
                            path: currentPath, 
                            index, 
                            fullName 
                        });
                        index++;
                    } else {
                        // 中间节点，继续递归遍历子节点
                        node.children.forEach(child => {
                            traverseTree(child, currentPath);
                        });
                    }
                };

                traverseTree(improvisationTree);
                this.ideas = this.trie.getAllItems();
                this.shuffleArray(this.ideas);
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
                this.nextPrompt = document.getElementById('nextPrompt');
                this.progressFill = document.getElementById('progressFill');

                this.startBtn.addEventListener('click', () => this.start());
                this.stopBtn.addEventListener('click', () => this.stop());
                this.nextBtn.addEventListener('click', () => this.next());
                this.intervalInput.addEventListener('change', () => this.updateInterval());

                this.updateDisplay();
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

                // 进度条更新
                this.progressTimer = setInterval(() => {
                    const elapsed = Date.now() - this.startTime;
                    const progress = Math.min((elapsed / this.intervalTime) * 100, 100);
                    this.progressFill.style.width = `${progress}%`;
                }, 100);

                // 定时器
                this.timer = setTimeout(() => {
                    if (this.isPlaying) {
                        this.next();
                    }
                }, this.intervalTime);
            }

            updateDisplay() {
                const current = this.ideas[this.currentIndex];
                const next = this.ideas[(this.currentIndex + 1) % this.ideas.length];

                // 更新当前提示
                this.currentPrompt.innerHTML = `
                    <h2>当前练习 (${this.currentIndex + 1}/${this.ideas.length})</h2>
                    <div class="prompt-text">${current.fullName}</div>
                `;
                this.currentPrompt.classList.add('fade-in');
                setTimeout(() => {
                    this.currentPrompt.classList.remove('fade-in');
                }, 500);

                // 更新下一个提示
                this.nextPrompt.innerHTML = `
                    <h3>即将到来</h3>
                    <div class="prompt-text">${next.fullName}</div>
                `;
            }

        }

        // 初始化应用
        document.addEventListener('DOMContentLoaded', () => {
            new ImprovisationTool();
        });
