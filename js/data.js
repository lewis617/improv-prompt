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

        createNode("Accompaniment", [
            createNode("Strumming"),
            createNode("Arpeggio"),
            createNode("Block Chords")
        ]),
        createNode("Pentatonic Scales", [
            createNode("Three-Note Groups", createSequencePatterns().concat([
                createNode("Zigzag at the end")
            ])),
            createNode("Four-Note Groups", createSequencePatterns()),
            createNode("Six-Note Groups", createSequencePatterns()),
            createNode("Skip One Note", createSequencePatterns()),
            createNode("Skip Two Notes", createSequencePatterns()),
            createNode("Down Two Up One"),
            createNode("Up One Down Two"),
            createNode("Two Strings", [
                // d h d h d p d p
                createNode("2-2-1-1-1-1-2-2"),
                // d p d p d u
                createNode("1-1-1-1-2-1"),
            ]),
            createNode("Bending", [
                createNode("Ascending 2 Dscending 4")
            ])
        ]),
        createNode("Alternate Picking", [
            createNode("Three-Note Groups", createSequencePatterns().concat([
                // createNode("in 16th nodes")
            ])),
            createNode("Four-Note Groups", createSequencePatterns().concat([
                // createNode("reverse 2nd"),
            ])),
            // createNode("Six-Note Groups", [
            //     createNode("Sequence"),
            // ]),
            // createNode("Five-Note Groups", [
            //     createNode("Sequence"),
            //     createNode("reverse 2nd"),
            // ]),
            createNode("Thirds", createSequencePatterns()),
            createNode("Fourths", createSequencePatterns()),
            createNode("Fifths", createSequencePatterns()),
            // createNode("Sixths", createSequencePatterns()),
            // createNode("Sevenths", createSequencePatterns()),
            // createNode("Four String Chord", [
            //     createNode("16th nodes"),
            //     createNode("12th nodes"),
            // ]),
            // createNode("Six String Chord", [
            //     createNode("12th nodes"),
            //     createNode("Skip One Node"),
            // ]),
            // createNode("Two Strings", [
            //     createNode("1-2-2-2-2-2"),
            //     createNode("1-1-2-2-2-1"),
            //     createNode("1-2-1-2-2-2-2-2"),
            //     createNode("1-2-2-2-2-2-1-2"),
            // ]),
            // createNode("One String", [
            //     createNode("Three-Node Groups", createSequencePatterns().concat([
            //         createNode("2 Positions Shifting")
            //     ])),
            //      createNode("Four-Node Groups", [
            //         createNode("Shifting in the middle of a beat"),
            //         createNode("1-2-3-2"),
            //     ]),
            // ]),
        ]),
        createNode("Legato", [
            createNode("Three-Note Groups", [
                createNode("1-2-3"),
                createNode("3-2-1"),
                createNode("1-3-2"),
                createNode("3-1-2"),
                createNode("in 16th notes"),
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
            ]),
            createNode("Slides", [
                createNode("Five-Note Groups"),
                createNode("Sextuplet"),
                createNode("Eight-Note Groups"),
            ]),
            // createNode("Hammer-on from nowhere", [
            //     createNode("d-h-h-p-p-h2"),
            //     createNode("d-h-h-p-p-h2 & u-h-p-p-h-h"),
            //     createNode("Ascending & Descending & Arpeggio"),
            //     createNode("Six Strings"),
            // ]),
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
                createNode("Scale and Arpeggios"),
            ]),
            createNode("Two Strings", [
                createNode("1-1-2-2"),
                createNode("1-1-2"),
                createNode("2-1-1"),
                createNode("2-2-1"),
                createNode("Fourths & Fifths"),
                createNode("Diatonic Scales"),
            ]),
        ]),
        createNode("Tapping", [
            createNode("Triad", [
                // T-p-p
                createNode("Descending"),
                // T-p-h
                createNode("Eruption Style"),
                // T-p-p-h
                createNode("Descending & Ascending"),
                // T-p-T-p-p-h
                createNode("Sextuplet"),
                // T-p-h-h
                createNode("Triad with Open String")
            ]),
            createNode("Triad & Diatonic", [
                // T-p-p-p
                createNode("Descending"),
                // T-p-h-h
                createNode("Eruption Style"),
                // T-p-p-p-h-h
                createNode("Descending & Ascending"),
                // T-p-h-h & T-p-p-p
                createNode("Alternating")
            ]),
            createNode("Tapped Slides", [
                // T-sl-sl-p-p-h
                createNode("Two-Pitch Slide"),
                // T-p-p-p-sl-h-h
                createNode("Sliding between different positions")
            ]),
            createNode("Tapped Bends", [
                // b-T-p-r
                createNode("Tap on Bent String"),
                // h-T-b
                createNode("Bend Tapped Note")
            ]),
            createNode("Pentatonic & Diatonic", [
                // T-p-h
                createNode("3 Tapped Positions - 2 Strings"),
                // T-p-h
                createNode("2 Tapped Positions - 6 Strings")
            ]),
            createNode("Pedal Point Tapping", [
                // 5-3-5-2-5-1 (T-p-T-p-T-p)
                createNode("5-3-5-2-5-1"),
                // 5-1-5-2-5-3 (T-p-T-p-T-p)
                createNode("5-1-5-2-5-3"),
                // T-h-h-p-h-h
                createNode("Movable Nut")
            ]),
            createNode("Hammer-on from Nowhere", [
                // h-h-h-T-p-p
                createNode("Triad"),
                // h-h-h-T-sl-sl-p-p
                createNode("Tapped Slide Extension"),
                // h-h-h-h-T-p-p-h
                createNode("Multi-String Extension")
            ]),
            createNode("Legato Tapping: Ascending 4, Descending 5"),
            createNode("Sweep Tapping: Sweep Up & Tapped Sequence Down"),
        ]),
    ]);

    return improvisationTree;
}
