// 背景音轨数据模块
export function createAudioData() {
    return [
        {
            file: 'BBBT001.mp3',
            name: 'BBBT001 - E Blues',
            title: '12-Bar Blues Shuffle in E',
            trackNumber: 1,
            tempo: '♩ = 108',
            chordNames: 'E7 | - | - | - | A7 | - | E7 | - | B7 | A7 | E7 | B7',
            chordFunctions: 'I | - | - | - | IV | - | I | - | V | IV | I | V',

            scaleHints: {
                primary: [
                    'E minor pentatonic scale',
                    'E blues scale',
                    'E major pentatonic scale (for a brighter, country blues sound)'
                ],
                alternate: [
                    'E Dorian (for a jazzy, soulful sound)',
                    'E Mixolydian (over the I chord)',
                    'A Mixolydian (over the IV chord)',
                    'B Mixolydian (over the V chord)',
                    'A major pentatonic scale (over the IV chord)',
                    'B minor pentatonic scale (over the V chord)',
                    'B major pentatonic scale (over the V chord)'
                ]
            }
        },
        {
            file: 'BBBT010.mp3',
            name: 'BBBT010 - G Funky Blues',
            title: '12-Bar Funky Blues in G',
            trackNumber: 10,
            tempo: '♩ = 92',
            chordNames: 'G9 | - | - | - | C9 | - | G9 | - | D9 | C9 | G9 | -',
            chordFunctions: 'I | - | - | - | IV | - | I | - | V | IV | I | -',
            scaleHints: {
                primary: [
                    'G minor pentatonic scale',
                    'G blues scale',
                    'G major pentatonic scale (for a brighter, country blues sound)',
                    'G composite blues scale'
                ],
                alternate: [
                    'G Dorian (for a jazzy, funky sound)',
                    'G Mixolydian (over the I chord)',
                    'C Mixolydian (over the IV chord)',
                    'D Mixolydian (over the V chord)',
                    'C major pentatonic scale (over the IV chord)',
                    'D minor pentatonic scale (over the V chord)',
                    'D major pentatonic scale (over the V chord)'
                ]
            }
        },
        {
            file: 'BBBT016.mp3',
            name: 'BBBT016 - C Blues Rock',
            title: '12-Bar Blues Rock in C',
            trackNumber: 16,
            tempo: '♩ = 160',
            chordNames: 'C7 | - | - | - | F7 | - | C7 | - | G7 | F7 | C7 | G7',
            chordFunctions: 'I | - | - | - | IV | - | I | - | V | IV | I | V',

            scaleHints: {
                primary: [
                    'C minor pentatonic scale',
                    'C blues scale',
                    'C major pentatonic scale (for a brighter, country blues sound)'
                ],
                alternate: [
                    'C Dorian (for a jazzy, rock sound)',
                    'C Mixolydian (over the I chord)',
                    'F Mixolydian (over the IV chord)',
                    'G Mixolydian (over the V chord)',
                    'F major pentatonic scale (over the IV chord)',
                    'G minor pentatonic scale (over the V chord)',
                    'G major pentatonic scale (over the V chord)'
                ]
            }
        },
        {
            file: 'BBBT032.mp3',
            name: 'BBBT032 - A Minor Blues',
            title: '12-Bar Minor Blues in A Minor: Straight 8th Feel',
            trackNumber: 32,
            tempo: '♩ = 108',
            chordNames: 'Am | - | - | - | Dm | - | Am | - | Fmaj7 | E7 | Am | -',
            chordFunctions: 'i | - | - | - | iv | - | i | - | ♭VI | V | i | -',
            scaleHints: {
                primary: [
                    'A minor pentatonic scale',
                    'A blues scale',
                    'A minor scale (over the ♭VI chord)',
                    'A harmonic minor scale (over the V chord)'
                ],
                alternate: [
                    'A Dorian (over the i chord)',
                    'D minor pentatonic scale (over the iv chord)',
                    'E minor pentatonic scale (over the V chord)'
                ]
            }
        },
        {
            file: 'BBBT099.mp3',
            name: 'BBBT099 - C Two-Chord Rock',
            title: 'Two-Chord Rock in C',
            trackNumber: 99,
            tempo: '♩ = 120',
            chordNames: 'C | F | C | F',
            chordFunctions: 'I | IV | I | IV',
            scaleHints: {
                primary: [
                    'C major scale',
                    'C major pentatonic scale'
                ],
                alternate: [
                    'C minor pentatonic scale (for a bluesy sound)',
                    'C blues scale (for a bluesy sound)',
                    'C Mixolydian (for a funky or jazzier sound)',
                    'F major pentatonic scale (over the IV chord)'
                ]
            }
        },
        {
            file: 'BBBT105.mp3',
            name: 'BBBT105 - E Dorian Jam',
            title: 'Dorian Jam in E Minor',
            trackNumber: 105,
            tempo: '♩ = 108',
            chordNames: 'Em | A | Em | A',
            chordFunctions: 'i | IV | i | IV',
            scaleHints: {
                primary: [
                    'E Dorian'
                ],
                alternate: [
                    'E minor pentatonic scale',
                    'E blues scale',
                    'E melodic minor scale (for an outside sound)'
                ]
            }
        },
        {
            file: 'BBBT106.mp3',
            name: 'BBBT106 - D Dorian Jam',
            title: 'Dorian Jam in D Minor',
            trackNumber: 106,
            tempo: '♩ = 80',
            chordNames: 'Dm | G | Dm | G',
            chordFunctions: 'i | IV | i | IV',
            scaleHints: {
                primary: [
                    'D Dorian'
                ],
                alternate: [
                    'D minor pentatonic scale',
                    'D blues scale',
                    'D melodic minor scale (for an outside sound)'
                ]
            }
        },
        {
            file: 'BBBT121.mp3',
            name: 'BBBT121 - D U2 Groove',
            title: 'U2 Groove in D',
            trackNumber: 121,
            tempo: '♩ = 104',
            chordNames: 'D | A | Bm | G',
            chordFunctions: 'I | V | vi | IV',
            scaleHints: {
                primary: [
                    'D major scale',
                    'D major pentatonic scale'
                ],
                alternate: []
            }
        },
        {
            file: 'BBBT122.mp3',
            name: 'BBBT122 - F Let It Groove',
            title: '"Let It Groove" in F',
            trackNumber: 122,
            tempo: '♩ = 76',
            chordNames: 'F | C | Dm | B♭',
            chordFunctions: 'I | V | vi | IV',
            scaleHints: {
                primary: [
                    'F major scale',
                    'F major pentatonic scale'
                ],
                alternate: []
            }
        },
        {
            file: 'BBBT124.mp3',
            name: 'BBBT124 - E Minor Big Metal Jam',
            title: 'Big Metal Jam in E Minor',
            trackNumber: 124,
            tempo: '♩ = 126',
            chordNames: 'E5 | D5 | C5 | D5',
            chordFunctions: 'i | ♭VII | ♭VI | ♭VII',
            scaleHints: {
                primary: [
                    'E minor scale',
                    'E minor pentatonic scale'
                ],
                alternate: [
                    'E blues scale (for a bluesy sound)'
                ]
            }
        },
        {
            file: 'BBBT125.mp3',
            name: 'BBBT125 - F# Minor Hard Rock',
            title: 'Three-Chord Hard Rock in F# Minor',
            trackNumber: 125,
            tempo: '♩ = 140',
            chordNames: 'F#5 | D5 | E5 | F#5',
            chordFunctions: 'i | ♭VI | ♭VII | i',
            scaleHints: {
                primary: [
                    'F# minor scale',
                    'F# minor pentatonic scale'
                ],
                alternate: [
                    'F# blues scale (for a bluesy sound)'
                ]
            }
        },
        {
            file: 'BBBT126.mp3',
            name: 'BBBT126 - A Minor Metal Gallop',
            title: 'Metal Gallop in A Minor',
            trackNumber: 126,
            tempo: '♩ = 108',
            chordNames: 'A5 | F5 | G5 | A5',
            chordFunctions: 'i | ♭VI | ♭VII | i',
            scaleHints: {
                primary: [
                    'A minor scale',
                    'A minor pentatonic scale'
                ],
                alternate: [
                    'A blues scale (for a bluesy sound)'
                ]
            }
        },
        {
            file: 'BBBT128.mp3',
            name: 'BBBT128 - A Minor Strut',
            title: 'A Minor Strut',
            trackNumber: 128,
            tempo: '♩ = 126',
            chordNames: 'Am | G | F | E',
            chordFunctions: 'i | ♭VII | ♭VI | V',
            scaleHints: {
                primary: [
                    'A minor scale',
                    'A minor pentatonic scale',
                    'A harmonic minor scale (over the V chord)'
                ],
                alternate: [
                    'A blues scale (for a bluesy sound)'
                ]
            }
        },
        {
            file: 'BBBT129.mp3',
            name: 'BBBT129 - C Minor Strut',
            title: 'C Minor Strut',
            trackNumber: 129,
            tempo: '♩ = 120',
            chordNames: 'Cm | B♭ | A♭ | G',
            chordFunctions: 'i | ♭VII | ♭VI | V',
            scaleHints: {
                primary: [
                    'C minor scale',
                    'C minor pentatonic scale',
                    'C harmonic minor scale (over the V chord)'
                ],
                alternate: [
                    'C blues scale (for a bluesy sound)'
                ]
            }
        },
        {
            file: 'BBBT136.mp3',
            name: 'BBBT136 - A Lydian Rock',
            title: 'Lydian Rock in A',
            trackNumber: 136,
            tempo: '♩ = 100',
            chordNames: 'A | B/A | A | B/A',
            chordFunctions: 'I | II | I | II',
            scaleHints: {
                primary: [
                    'A Lydian',
                    'A major pentatonic scale'
                ],
                alternate: [
                    'B major pentatonic scale (to highlight the #4th and 7th tones)'
                ]
            }
        },
        {
            file: 'BBBT137.mp3',
            name: 'BBBT137 - G Lydian Rock',
            title: 'Lydian Rock in G',
            trackNumber: 137,
            tempo: '♩ = 136',
            chordNames: 'G | A/G | G | A/G',
            chordFunctions: 'I | II | I | II',
            scaleHints: {
                primary: [
                    'G Lydian',
                    'G major pentatonic scale'
                ],
                alternate: [
                    'A major pentatonic scale (to highlight the #4th and 7th tones)'
                ]
            }
        },
        {
            file: 'BBBT149.mp3',
            name: 'BBBT149 - B Minor Funky Jam',
            title: 'One-Chord Funky Jam in B minor',
            trackNumber: 149,
            tempo: '♩ = 88',
            chordNames: 'Bm7',
            chordFunctions: 'i',
            scaleHints: {
                primary: [
                    'B Dorian',
                    'B minor pentatonic scale'
                ],
                alternate: [
                    'B blues scale (for a bluesy sound)'
                ]
            }
        }
    ];
}