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
            createNode("Five Strings", [
                createNode("Major Thirds", [
                    createNode("Position Shifts"),
                    createNode("No Position Shifts")
                ]),
                createNode("Minor Thirds", [
                    createNode("Position Shifts"),
                    createNode("No Position Shifts")
                ]),
                createNode("Alternating Patterns")
            ]),
            createNode("Four Strings", [
                createNode("Eight-Note Groups", [
                    createNode("Major Triads"),
                    createNode("Minor Triads")
                ]),
                createNode("Six-Note Groups", [
                    createNode("Major Triads"),
                    createNode("Minor Triads")
                ]),
            ]),
            createNode("Three Strings", [
                createNode("Pentatonic Scales"),
                createNode("Seventh Chord Arpeggios"),
            ]),
            createNode("Two Strings", [
                createNode("Down-Up-Up-Down-1122"),
                createNode("Down-Up-Up-112"),
                createNode("Up-Down-Up-211"),
                createNode("Up-Down-Down-221"),
                createNode("Diatonic Scales"),
            ]),
        ]),
    ]);

    return improvisationTree;
}
