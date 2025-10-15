// Improvisation exercise data module
export function createImprovisationData() {
    // Helper function to create tree nodes
    const createNode = (name, children = []) => ({ name, children });

    // Create directional patterns (ascending/descending)
    const createDirectionalPattern = (name) => createNode(name, [
        createNode("Ascending"),
        createNode("Descending")
    ]);

    // Define common sequence structures
    const createSequencePatterns = () => [
        createDirectionalPattern("Sequence"),
        createDirectionalPattern("Zigzag Sequence")
    ];

    // Using standard tree node structure
    const improvisationTree = createNode("Root", [
        createNode("Arpeggios", [
            createNode("Three-Note Groups", createSequencePatterns()),
            createNode("Four-Note Groups", createSequencePatterns()),
        ]),
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
                createDirectionalPattern("Sequence")
            ]),
            createNode("Six-Note Groups", [
                createNode("1-3-2-1-2-3"),
                createNode("3-1-2-3-2-1"),
                createDirectionalPattern("Sequence")
            ]),
            createNode("Thirds", [
                createDirectionalPattern("Sequence")
            ])
        ]),
        createNode("Sweep Picking", [
            createNode("Five Strings"),
            createNode("Four Strings", [
                createNode("Eight-Note Groups"),
                createNode("Six-Note Groups"),
            ]),
            createNode("Two Strings", [
                createNode("Down-Up-Up-Down"),
                createNode("Down-Up-Up"),
                createNode("Up-Down-Up"),
                createNode("Down-Up-Down"),
            ]),
            createNode("Diatonic Scales"),
            createNode("Diatonic Scales Arpeggio Mixed"),
            createNode("Pentatonic Scales"),
            createNode("Position Change Arpeggios", [
                createNode("Major Thirds"),
                createNode("Minor Thirds"),
                createNode("Alternating Patterns")
            ]),
            createNode("Seventh Chord Arpeggios"),
        ]),
    ]);

    return improvisationTree;
}
