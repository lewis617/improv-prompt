// Improvisation exercise data module
export function createImprovisationData() {
    // Helper function to create tree nodes
    const createNode = (name, children = [], tooltip = '') => ({ name, children, tooltip });

    // Using standard tree node structure
    const improvisationTree = createNode("Root", [

        createNode("Accompaniment", [
            createNode("Strumming"),
            createNode("Arpeggio"),
            createNode("Block Chords")
        ]),
        createNode("Pentatonic Scales", [
            createNode("Three-Note Groups Descending", [
                createNode("Zigzag Sequence"),
                createNode("Zigzag at the end"),
            ]),
            createNode("Four-Note Groups Descending", [
                createNode("Sequence"),
                createNode("Zigzag Sequence")
            ]),
            createNode("Six-Note Groups Descending", [
                createNode("Sequence"),
                createNode("Zigzag Sequence")
            ]),
            createNode("Down Two Up One"),
            createNode("Up One Down Two"),
            createNode("Up Three Down Two"),
            createNode("Two Strings", [
                createNode("2-2-1-1-1-1-2-2", [], "Zigzag: d h d h d p d p"),
                createNode("1-1-1-1-2-1", [], "d p d p d u"),
            ]),
            createNode("Bending", [
                createNode("Ascending 2 Dscending 4")
            ])
        ]),
        createNode("Alternate Picking", [
            createNode("Three-Note Groups", [
                createNode("Sequence"),
                createNode("Zigzag Sequence")
            ].concat([
                // createNode("in 16th nodes")
            ])),
            createNode("Four-Note Groups", [
                createNode("Sequence"),
                // createNode("reverse 2nd"),
            ]),
            // createNode("Six-Note Groups", [
            //     createNode("Sequence"),
            // ]),
            // createNode("Five-Note Groups", [
            //     createNode("Sequence"),
            //     createNode("reverse 2nd"),
            // ]),
            createNode("Thirds", [createNode("Sequence")]),
            createNode("Fourths", [createNode("Sequence")]),
            createNode("Fifths", [createNode("Sequence")]),
            // createNode("Sixths", [createNode("Sequence")]),
            // createNode("Sevenths", [createNode("Sequence")]),
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
                createNode("Descending", [], "T-p-p"),
                createNode("Ascending", [], "T-p-h"),
                createNode("Descending & Ascending", [], "T-p-p-h"),
                createNode("Sextuplet", [], "T-p-T-p-p-h"),
                createNode("Triad with Open String", [], "T-p-h-h")
            ], "Tapped notes outlined by pull-offs"),
            createNode("Triad & Diatonic", [
                createNode("Descending", [], "T-p-p-p"),
                createNode("Ascending", [], "T-p-h-h"),
                createNode("Descending & Ascending", [], "T-p-p-p-h-h"),
                createNode("Alternating", [], "T-p-h-h & T-p-p-p")
            ], "Tapped notes outlined by pull-offs and hammer-ons"),
            createNode("Slides", [
                createNode("Two-Pitch Slide with Triad", [], "T-sl-sl-p-p-h"),
                createNode("Sliding between different positions", [], "T-p-p-p-sl-h-h")
            ]),
            createNode("Tapped Bends", [
                createNode("Tap on Bent String", [], "b-T-p-r"),
                createNode("Bend Tapped Note", [], "h-T-b")
            ]),
            createNode("Pentatonic & Diatonic", [
                createNode("2 Strings", [], "T-p-h"),
                createNode("6 Strings", [], "T-p-h")
            ]),
            createNode("Pedal Point Tapping", [
                createNode("Triad & Diatonic", [], "53-52-51 51-52-53 T-p-T-p-T-p"),
                createNode("Movable Nut", [], "123-723-623-723 T-h-h-p-h-h")
            ]),
            createNode("Hammer-on from Nowhere", [
                createNode("Triad", [], "h-h-h-T-p-p"),
                createNode("Tapped Slide Extension", [], "h-h-h-T-sl-sl-p-p"),
                createNode("Multi-String Extension", [], "h-h-h-h-T-p-p-h")
            ], "Major triad shapes"),
            // createNode("Legato Tapping: Ascending 4, Descending 5"),
            createNode("Sweep Tapping: Sweep Up & Tapped Sequence Down", [], "Major triad shapes"),
        ]),
    ]);

    return improvisationTree;
}
