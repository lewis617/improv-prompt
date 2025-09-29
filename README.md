# Improvisation Practice Tool

A web-based tool specifically designed for music improvisation practice, helping you systematically train various improvisation techniques.

## Features

- 🎵 **Rich Practice Content**: Includes arpeggios, pentatonic scales, natural scales, legato and other improvisation ideas
- ⏰ **Timed Playback**: Customizable interval timing with automatic switching between practice content
- 👀 **Preview Functionality**: Like karaoke lyrics display, you can preview the next upcoming practice content
- 📊 **Progress Display**: Intuitive progress bar and completion status display
- 🌟 **Modern Interface**: Beautiful gradient design with mobile device support
- 🔀 **Random Playback**: Shuffle practice order to avoid forming fixed memory patterns

## Practice Content

### Arpeggio Series
- **Arpeggios**: Three-note groups (sequence, zigzag), Four-note groups (sequence, zigzag), Skip one note (sequence, zigzag)

### Scale Series
- **Pentatonic Scales**: Three-note groups (sequence, zigzag), Four-note groups (sequence, zigzag), Six-note groups (sequence, zigzag), Skip one note (sequence, zigzag), Skip two notes (sequence, zigzag)
- **Diatonic Scales**: Three-note groups (sequence, zigzag), Four-note groups (sequence, zigzag), Thirds (sequence, zigzag), Fourths (sequence, zigzag)

### Technique Series
- **Legato**: Three-note groups (1-2-3, 1-3-2), Four-note groups (1-3-2-3, sequence), Six-note groups (1-3-2-1-2-3, sequence), Thirds (sequence)

## Technical Implementation

- Uses **Trie (prefix tree)** data structure to store and organize improvisation ideas
- Pure frontend implementation, no server required
- Responsive design, supports various devices
- Smooth animation transitions

## Usage

1. Set practice interval time (5-300 seconds)
2. Click "Start Practice" to begin training
3. System will automatically display current practice content and the next upcoming content
4. Can click "Next" to manually switch at any time, or "Stop Practice" to pause

## Deploy to GitHub Pages

1. Fork this project to your GitHub account
2. Enable GitHub Pages in project settings
3. Select main branch as publishing source
4. Visit `https://yourusername.github.io/improv-prompt/` to use

## Local Running

Simply open the `index.html` file directly in your browser.

## Custom Practice Content

To add or modify practice content, please edit the improvisation practice data structure in `js/data.js`.

## Project Structure

```
.
├── index.html          # Main page
├── css/
│   └── style.css      # Style file
├── js/
│   ├── index.js       # Main logic
│   ├── data.js        # Improvisation practice data
│   └── audio-data.js  # Background track data
└── audio/             # Audio files directory
```

## License

MIT License

---

Enjoy your improvisation practice! 🎵