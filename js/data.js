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
    ]);

    return improvisationTree;
}
