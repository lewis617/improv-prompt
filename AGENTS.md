# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based improvisation practice tool for musicians, specifically designed to help with systematic improvisation skills training. The application is a static website that provides:

- **Improvisation prompts**: Systematic practice content including arpeggios, pentatonic scales, natural scales, and legato techniques
- **Timed playback**: Customizable interval timing with automatic switching between exercises
- **Preview functionality**: Shows current and upcoming exercises (like karaoke lyrics display)
- **Background audio tracks**: Guitar backing tracks with chord progressions and scale hints
- **Random playback**: Shuffles practice order to avoid fixed memory patterns

## Architecture

### Data Structure
- Uses **Trie (prefix tree)** data structure to organize improvisation content hierarchically
- Tree structure: Root → Category (Arpeggios, Pentatonic Scales, Diatonic Scales, etc.) → Pattern Type → Direction (Ascending/Descending)
- All practice items are flattened into arrays for random selection and display

### Core Components

#### ImprovisationTool Class (`js/index.js:328-511`)
Main application controller that manages:
- Trie-based data organization and traversal
- Timer management for automatic progression
- UI state management and display updates
- Progress tracking and visual indicators

#### AudioManager Class (`js/index.js:38-325`)
Handles background music functionality:
- Multiple playback modes: random, sequential, single repeat
- Track selection and metadata display (chords, tempo, scale hints)
- Robust random playback with pre-shuffled index arrays
- Audio event handling and UI synchronization

#### Data Modules
- `js/data.js`: Hierarchical improvisation exercise data using tree nodes
- `js/audio-data.js`: Guitar backing track metadata with chord progressions and scale recommendations

## File Structure

```
├── index.html          # Main application page
├── css/style.css      # All styles (no build process)
├── js/
│   ├── index.js       # Main application logic (ES6 modules)
│   ├── data.js        # Improvisation practice data tree
│   └── audio-data.js  # Background audio track metadata
├── audio/             # MP3 backing track files (BBBT*.mp3)
└── favicon.svg        # Application icon
```

## Development

### Running the Application
This is a static website using ES6 modules, which requires HTTP protocol:

**Start local server:**
```bash
# Using Python 3 (recommended)
python3 -m http.server 8080

# Using Node.js (if available)
npx serve .
```

**Then visit:** `http://localhost:8080`

**Important:** Cannot open `index.html` directly in browser due to CORS restrictions with ES6 modules. Must use HTTP server.

### Key Technical Details

1. **ES6 Modules**: Uses native ES6 import/export (requires HTTP server due to CORS policy)
2. **No Dependencies**: Pure vanilla JavaScript, HTML, CSS - no package.json or build tools
3. **Responsive Design**: Mobile-friendly with CSS media queries
4. **Audio Integration**: HTML5 audio with metadata display and playback controls

### Modifying Practice Content

To add or modify improvisation exercises:
1. Edit the tree structure in `js/data.js`
2. Use `createNode()` for categories and `createLeaf()` for final exercises
3. Follow the pattern: Category → Technique → Direction

To add background tracks:
1. Add MP3 files to `audio/` directory
2. Add metadata entry to `js/audio-data.js` with:
   - File name, title, tempo
   - Chord progressions (names and functions)
   - Scale hints (primary and alternate options)

### Code Style Notes
- All content now in English (UI text, comments, data)
- Functional programming patterns for data creation
- Class-based architecture for application logic
- Event-driven UI updates with timer management
- Consistent naming: camelCase for variables, PascalCase for classes

## Audio Files

Background tracks are sourced from guitar backing track collections (BBBT series) covering various styles:
- Blues progressions (12-bar, minor blues)
- Rock and metal progressions
- Modal jams (Dorian, Lydian)
- Chord progressions with detailed harmonic analysis

Each track includes chord names, roman numeral analysis, and suggested scales for improvisation practice.