// Improvisation exercise data module
export function createImprovisationData() {
    // Helper function to create tree nodes
    const createNode = (name, children = []) => ({ name, children });

    // Create leaf nodes
    const createLeaf = (name) => ({ name, children: [] });

    // Create directional patterns (ascending/descending)
    const createDirectionalPattern = (name) => createNode(name, [
        createLeaf("Ascending"),
        createLeaf("Descending")
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
            createNode("Skip One Note", createSequencePatterns())
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
            createNode("Fourths", createSequencePatterns())
        ]),
        createNode("Legato", [
            createNode("Three-Note Groups", [
                createLeaf("1-2-3"),
                createLeaf("1-3-2")
            ]),
            createNode("Four-Note Groups", [
                createLeaf("1-3-2-3"),
                createLeaf("3-2-3-1"),
                createDirectionalPattern("Sequence")
            ]),
            createNode("Six-Note Groups", [
                createLeaf("1-3-2-1-2-3"),
                createLeaf("3-1-2-3-2-1"),
                createDirectionalPattern("Sequence")
            ]),
            createNode("Thirds", [
                createDirectionalPattern("Sequence")
            ])
        ])
    ]);

    return improvisationTree;
}