// Improvisation exercise data module
export function createImprovisationData() {
    // Helper function to create tree nodes
    const createNode = (name, children = []) => ({ name, children });

    // Define common sequence structures
    const createSequencePatterns = () => [
        createNode("Sequence"),
        createNode("Zigzag Sequence")
    ];

    // Using standard tree node structure
    const improvisationTree = createNode("Root", [

        createNode("Pentatonic Scales", [
            createNode("Three-Note Groups", createSequencePatterns()),
            createNode("Four-Note Groups", createSequencePatterns()),
            createNode("Six-Note Groups", createSequencePatterns()),
            createNode("Skip One Note", createSequencePatterns()),
            createNode("Skip Two Notes", createSequencePatterns())
        ]),
        createNode("Diatonic Scales", [
            createNode("Three-Note Groups", createSequencePatterns()),
            createNode("Four-Note Groups", createSequencePatterns()),
            createNode("Thirds", createSequencePatterns()),
            createNode("Fourths", createSequencePatterns()),
            createNode("Fifths", createSequencePatterns()),
        ]),
        createNode("Legato", [
            createNode("Three-Note Groups", [
                createNode("1-2-3"),
                createNode("1-3-2")
            ]),
            createNode("Four-Note Groups", [
                createNode("1-3-2-3"),
                createNode("3-2-3-1"),
                createNode("Sequence")
            ]),
            createNode("Six-Note Groups", [
                createNode("1-3-2-1-2-3"),
                createNode("3-1-2-3-2-1"),
                createNode("Sequence")
            ]),
            createNode("Thirds", [
                createNode("Sequence")
            ])
        ]),
        createNode("Sweep Picking", [
            createNode("Five Strings", [
                createNode("Position Shifts", [
                    createNode("Same Triad"),
                    createNode("Diatonic Triads"),
                ]),
                createNode("No Position Shifts")
            ]),
            createNode("Four Strings", [
                createNode("Eight-Note Groups"),
                createNode("Six-Note Groups")
            ]),
            createNode("Three Strings", [
                createNode("Pentatonic Scales"),
                createNode("Seventh Chord Arpeggios"),
            ]),
            createNode("Two Strings", [
                createNode("Down-Up-Up-Down-1-1-2-2"),
                createNode("Down-Up-Up-1-1-2"),
                createNode("Up-Down-Up-2-1-1"),
                createNode("Up-Down-Down-2-2-1"),
                createNode("Diatonic Scales"),
            ]),
        ]),
        createNode("Tapping", [
            createNode("Triad", [
                createNode("Descending (T-p-p)"),
                createNode("Eruption Style (T-p-h)"),
                createNode("Descending & Ascending (T-p-p-h)"),
                createNode("Sextuplet (T-p-T-p-p-h)"),
                createNode("Triad with Open String (T-p-h-h)")
            ]),
            createNode("Triad & Scale", [
                createNode("Descending (T-p-p-p)"),
                createNode("Eruption Style (T-p-h-h)"),
                createNode("Descending & Ascending (T-p-p-p-h-h)"),
                createNode("Alternating (T-p-h-h & T-p-p-p)")
            ]),
            createNode("Tapped Slides", [
                createNode("Two-Pitch Slide (T-sl-sl-p-p-h)"),
                createNode("Sliding between different positions (T-p-p-p-sl-h-h)")
            ]),
            createNode("Tapped Bends", [
                createNode("Tap on Bent String (b-T-p-r)"),
                createNode("Bend Tapped Note (h-T-b)")
            ]),
            createNode("Pentatonic Tapping", [
                createNode("3 Tapped Positions - 2 Strings (T-p-h)"),
                createNode("2 Tapped Positions - 6 Strings (T-p-h)")
            ]),
            createNode("Pedal Point Tapping", [
                createNode("Descending 3rds & 4ths (T-p-T-p)"),
                createNode("Movable Nut (T-h-h-p-h-h)")
            ]),
            createNode("Hammer-on from Nowhere", [
                createNode("Triad (h-h-h-T-p-p)"),
                createNode("Tapped Slide Extension (h-h-h-T-sl-sl-p-p)"),
                createNode("Multi-String Extension (h-h-h-h-T-p-p-h)")
            ])
        ]),
    ]);

    return improvisationTree;
}
