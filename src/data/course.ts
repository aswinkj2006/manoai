export interface Question {
    id: number;
    text: string;
    type?: 'multiple-choice' | 'ai-practice' | 'ai-interactive' | 'etiquette' | 'info';
    targetSign?: string; // used for ai-practice and ai-interactive
    isQuestion?: boolean; // used for ai-practice face rule
    visual: string; // Emoji/text representation for now, could be a URL later
    signWord?: string; // Toggles the AvatarViewer in Lesson component
    youtubeId?: string; // embed a teaching video
    info?: string; // Explanatory paragraph for 'info' type cards
    options?: { id: number; text: string; signWord?: string; isCorrect?: boolean }[];
}

export interface LessonData {
    id: string;
    title: string;
    description: string;
    module: string;
    xp: number;
    questions: Question[];
}

export const COURSE_MODULES = [
    {
        id: 'module-alphabet',
        title: 'The ASL Alphabet',
        description: 'Master all 26 letters of fingerspelling — the foundation of sign language.',
        icon: '🤟',
    },
    {
        id: 'module-numbers',
        title: 'Numbers & Counting',
        description: 'Learn to count and express quantities from 1 to 20.',
        icon: '🔢',
    },
    {
        id: 'module-greetings',
        title: 'Greetings & Courtesy',
        description: 'Say hello, goodbye, please, thank you and more.',
        icon: '👋',
    },
    {
        id: 'module-words',
        title: 'Essential Words',
        description: 'Learn common everyday signs: yes, no, help, name, love and more.',
        icon: '💬',
    },
    {
        id: 'module-culture',
        title: 'Deaf Culture & Etiquette',
        description: 'Understand the norms of respectful interaction in the Deaf community.',
        icon: '🏛️',
    },
];

// ─── Q ID COUNTER HELPER ────────────────────────────────────────────────────
// IDs are globally unique across all lessons.
// A–C: 100–109 | D–F: 110–119 | G–I: 120–129 | J–L: 130–139 | M–P: 140–149
// Q–Z: 150–159 | Num 1–5: 200–209 | Num 6–10: 210–219 | Num 11–20: 220–229
// Greet1: 300–309 | Greet2: 310–319 | Greet3: 320–329
// Words1: 400–409 | Words2: 410–419
// Culture1: 500–509 | Culture2: 510–519
// ────────────────────────────────────────────────────────────────────────────

export const COURSE_DATA: Record<string, LessonData> = {

    // ═══════════════════════════════════════════════
    // MODULE 1: THE ASL ALPHABET
    // ═══════════════════════════════════════════════

    'lesson-a-c': {
        id: 'lesson-a-c',
        module: 'module-alphabet',
        title: 'Letters A, B & C',
        description: 'Start your fingerspelling journey with the first three letters.',
        xp: 100,
        questions: [
            {
                id: 100,
                type: 'info',
                text: 'Welcome to Fingerspelling!',
                visual: '✋',
                info: 'Fingerspelling is spelling words letter-by-letter using hand shapes. It is used in ASL for names, places, and words that don\'t have their own sign. In this lesson you\'ll learn A, B, and C — the first three shapes!'
            },
            {
                id: 101,
                text: "Study the sign for 'A' — make a fist with your thumb resting alongside your index finger, pointing upward.",
                type: 'ai-interactive',
                targetSign: 'A',
                signWord: 'A',
                visual: 'A',
                youtubeId: '0FcwzMq4iWg',
            },
            {
                id: 102,
                text: "Which hand shape is the letter 'A'? Pick the correct sign.",
                visual: '🤜',
                options: [
                    { id: 1, text: 'B', signWord: 'B' },
                    { id: 2, text: 'A', signWord: 'A', isCorrect: true },
                    { id: 3, text: 'V', signWord: 'V' },
                    { id: 4, text: 'Y', signWord: 'Y' },
                ]
            },
            {
                id: 103,
                text: "Now study 'B' — all four fingers together pointing straight up, thumb tucked across your palm.",
                type: 'ai-interactive',
                targetSign: 'B',
                signWord: 'B',
                visual: 'B',
                youtubeId: '0FcwzMq4iWg',
            },
            {
                id: 104,
                text: "For ASL 'B', where does the thumb go?",
                visual: '🖐️',
                options: [
                    { id: 1, text: 'Pointing up alongside the fingers' },
                    { id: 2, text: 'Folded across the palm below the fingers', isCorrect: true },
                    { id: 3, text: 'Touching the tip of the index finger' },
                    { id: 4, text: 'Extended out to the side' },
                ]
            },
            {
                id: 105,
                text: "Study 'C' — curve all your fingers and thumb into a C-shape, like you're gripping a large ball.",
                type: 'ai-interactive',
                targetSign: 'C',
                signWord: 'C',
                visual: 'C',
                youtubeId: '0FcwzMq4iWg',
            },
            {
                id: 106,
                text: "Which of these hand shapes is the letter 'C'? Pick the correct sign.",
                visual: 'C',
                options: [
                    { id: 1, text: 'O', signWord: 'O' },
                    { id: 2, text: 'G', signWord: 'G' },
                    { id: 3, text: 'C', signWord: 'C', isCorrect: true },
                    { id: 4, text: 'U', signWord: 'U' },
                ]
            },
            {
                id: 107,
                text: "Practice Challenge: Show me the sign for 'A'. Ensure your hand is visible to the camera.",
                type: 'ai-practice',
                targetSign: 'A',
                visual: 'AI Tracker Active',
            }
        ]
    },

    'lesson-d-f': {
        id: 'lesson-d-f',
        module: 'module-alphabet',
        title: 'Letters D, E & F',
        description: 'Continue building your alphabet with D, E, and F.',
        xp: 100,
        questions: [
            {
                id: 110,
                type: 'info',
                text: "D, E & F — Precision Signs",
                visual: '🖐️',
                info: "Letters D, E, and F require your fingers to work independently. 'D' uses a pointing index finger. 'E' bends all fingers forward. 'F' uses an OK-like pinch with the remaining fingers extended. Take your time!"
            },
            {
                id: 111,
                text: "Study 'D' — index finger point straight up, while middle, ring, and pinky curl to touch the thumb, forming a loop.",
                type: 'ai-interactive',
                targetSign: 'D',
                signWord: 'D',
                visual: 'D',
            },
            {
                id: 112,
                text: "For the letter 'D', the index finger...",
                signWord: 'D',
                visual: 'D',
                options: [
                    { id: 1, text: 'Curls down to touch the thumb' },
                    { id: 2, text: 'Points straight up while the others curl to meet the thumb', isCorrect: true },
                    { id: 3, text: 'Spreads sideways horizontally' },
                    { id: 4, text: 'Crosses over the middle finger' },
                ]
            },
            {
                id: 113,
                text: "Study 'E' — all four fingers bend forward at the knuckles and curl down; thumb tucks underneath the bent fingertips.",
                type: 'ai-interactive',
                targetSign: 'E',
                signWord: 'E',
                visual: 'E',
            },
            {
                id: 114,
                text: "Which description best matches the letter 'E' in ASL?",
                signWord: 'E',
                visual: 'E',
                options: [
                    { id: 1, text: 'Open hand, palm forward' },
                    { id: 2, text: 'All four fingers bent down with thumb tucked underneath', isCorrect: true },
                    { id: 3, text: 'Two fingers making a peace sign' },
                    { id: 4, text: 'Index and thumb forming a circle' },
                ]
            },
            {
                id: 115,
                text: "Study 'F' — bring your index finger and thumb together to form an 'OK' pinch; keep the other three fingers spread and extended.",
                type: 'ai-interactive',
                targetSign: 'F',
                signWord: 'F',
                visual: 'F',
            },
            {
                id: 116,
                text: "The letter 'F' looks most similar to which common gesture?",
                signWord: 'F',
                visual: 'F',
                options: [
                    { id: 1, text: 'Thumbs up' },
                    { id: 2, text: 'The OK sign (index + thumb pinching) with other 3 fingers open', isCorrect: true },
                    { id: 3, text: 'A pointing finger' },
                    { id: 4, text: 'A fist' },
                ]
            },
            {
                id: 117,
                text: "Practice Challenge: Show me the sign for 'B'.",
                type: 'ai-practice',
                targetSign: 'B',
                visual: 'AI Tracker Active',
            }
        ]
    },

    'lesson-g-i': {
        id: 'lesson-g-i',
        module: 'module-alphabet',
        title: 'Letters G, H & I',
        description: 'Learn G, H, and I — three unique horizontal and vertical shapes.',
        xp: 100,
        questions: [
            {
                id: 120,
                type: 'info',
                text: 'Horizontal Letters',
                visual: '👉',
                info: "G and H are horizontal signs — unlike most letters that point upward, these point sideways. 'G' looks like a gun shape, 'H' is two fingers side by side pointing out, and 'I' uses just the pinky finger!"
            },
            {
                id: 121,
                text: "Study 'G' — form a 'gun' shape: index finger points sideways, thumb points up, other fingers curl in.",
                type: 'ai-interactive',
                targetSign: 'G',
                signWord: 'G',
                visual: 'G',
            },
            {
                id: 122,
                text: "The 'G' handshape points in which direction?",
                signWord: 'G',
                visual: 'G',
                options: [
                    { id: 1, text: 'Upward' },
                    { id: 2, text: 'Sideways (horizontally)', isCorrect: true },
                    { id: 3, text: 'Downward' },
                    { id: 4, text: 'Diagonally' },
                ]
            },
            {
                id: 123,
                text: "Study 'H' — index and middle finger extend side-by-side and point sideways, like two fingers together horizontally.",
                type: 'ai-interactive',
                targetSign: 'H',
                signWord: 'H',
                visual: 'H',
            },
            {
                id: 124,
                text: "How does 'H' differ from 'G'?",
                signWord: 'H',
                visual: 'H',
                options: [
                    { id: 1, text: "'H' also uses the thumb pointing up" },
                    { id: 2, text: "'H' uses two fingers (index + middle) side by side pointing sideways, 'G' uses only one", isCorrect: true },
                    { id: 3, text: "'H' points upward while 'G' points sideways" },
                    { id: 4, text: "They look identical" },
                ]
            },
            {
                id: 125,
                text: "Study 'I' — only the pinky finger extends straight up. All other fingers and the thumb form a fist.",
                type: 'ai-interactive',
                targetSign: 'I',
                signWord: 'I',
                visual: 'I',
            },
            {
                id: 126,
                text: "Which finger is used for the letter 'I'?",
                signWord: 'I',
                visual: 'I',
                options: [
                    { id: 1, text: 'Index finger' },
                    { id: 2, text: 'Middle finger' },
                    { id: 3, text: 'Ring finger' },
                    { id: 4, text: 'Pinky finger', isCorrect: true },
                ]
            },
        ]
    },

    'lesson-j-l': {
        id: 'lesson-j-l',
        module: 'module-alphabet',
        title: 'Letters J, K & L',
        description: 'J is a movement letter — learn how motion creates meaning.',
        xp: 100,
        questions: [
            {
                id: 130,
                type: 'info',
                text: 'Letters with Motion',
                visual: '✍️',
                info: "'J' and 'Z' are the only two alphabet letters that involve movement rather than a static hand shape. For 'J', draw the shape of the letter in the air with your pinky. 'K' and 'L' are static."
            },
            {
                id: 131,
                text: "Study 'J' — start with a pinky-up 'I' handshape, then draw the letter 'J' downward and hook left in the air.",
                signWord: 'J',
                visual: 'J',
                options: [
                    { id: 1, text: "'J' is a static sign like 'I'" },
                    { id: 2, text: "'J' involves drawing the letter shape in the air with your pinky", isCorrect: true },
                    { id: 3, text: "'J' is a two-hand sign" },
                    { id: 4, text: "'J' uses all five fingers extended" },
                ]
            },
            {
                id: 132,
                text: "Study 'K' — index finger and middle finger point upward in a V, while your thumb rests between them. Palm faces out.",
                type: 'ai-interactive',
                targetSign: 'K',
                signWord: 'K',
                visual: 'K',
            },
            {
                id: 133,
                text: "How many fingers point upward in the 'K' handshape?",
                signWord: 'K',
                visual: 'K',
                options: [
                    { id: 1, text: 'One' },
                    { id: 2, text: 'Two', isCorrect: true },
                    { id: 3, text: 'Three' },
                    { id: 4, text: 'Four' },
                ]
            },
            {
                id: 134,
                text: "Study 'L' — extend your index finger straight up and your thumb straight out to the side, forming a 90° L-shape. Other fingers curl in.",
                type: 'ai-interactive',
                targetSign: 'L',
                signWord: 'L',
                visual: 'L',
            },
            {
                id: 135,
                text: "The 'L' handshape is easy to remember because...",
                signWord: 'L',
                visual: 'L',
                options: [
                    { id: 1, text: 'It looks like a peace sign' },
                    { id: 2, text: 'The index finger and thumb form the shape of the letter L', isCorrect: true },
                    { id: 3, text: 'All fingers point sideways' },
                    { id: 4, text: 'The pinky is the only finger extended' },
                ]
            },
        ]
    },

    'lesson-m-p': {
        id: 'lesson-m-p',
        module: 'module-alphabet',
        title: 'Letters M, N, O & P',
        description: 'Master M through P — including the round O and the downward P.',
        xp: 100,
        questions: [
            {
                id: 140,
                type: 'info',
                text: 'Curled Finger Letters',
                visual: '🤙',
                info: "M, N, and S look similar — they all involve a closed fist with the thumb tucked. The difference: 'M' has the thumb tucked under three fingers, 'N' under two, and 'S' is a closed fist with thumb over the front."
            },
            {
                id: 141,
                text: "Study 'M' — tuck your thumb under your index, middle, and ring finger. Pinky folds down. It's a closed fist with the thumb hidden under 3 fingers.",
                signWord: 'M',
                visual: 'M',
                options: [
                    { id: 1, text: 'Thumb tucked under index + middle + ring fingers', isCorrect: true },
                    { id: 2, text: 'Thumb tucked under index + middle fingers only' },
                    { id: 3, text: 'Thumb pointing up alongside fist' },
                    { id: 4, text: 'All fingers spread open' },
                ]
            },
            {
                id: 142,
                text: "Study 'N' — tuck your thumb under your index and middle finger only. It looks like 'M' but with only 2 fingers over the thumb.",
                signWord: 'N',
                visual: 'N',
                options: [
                    { id: 1, text: "'N' has thumb tucked under three fingers" },
                    { id: 2, text: "'N' has thumb tucked under two fingers (index + middle)", isCorrect: true },
                    { id: 3, text: "'N' has no thumb involvement" },
                    { id: 4, text: "'N' and 'M' look identical in ASL" },
                ]
            },
            {
                id: 143,
                text: "Study 'O' — curve all four fingers and your thumb toward each other until the fingertips meet the thumb tip, making a perfect O-circle.",
                type: 'ai-interactive',
                targetSign: 'O',
                signWord: 'O',
                visual: 'O',
            },
            {
                id: 144,
                text: "Which letter requires all fingertips to touch the thumb, forming a circular shape?",
                signWord: 'O',
                visual: 'O',
                options: [
                    { id: 1, text: 'C' },
                    { id: 2, text: 'Q' },
                    { id: 3, text: 'O', isCorrect: true },
                    { id: 4, text: 'G' },
                ]
            },
            {
                id: 145,
                text: "Study 'P' — make a 'K' shape (index + middle + thumb) but tilt it downward so your index finger points toward the floor.",
                signWord: 'P',
                visual: 'P',
                options: [
                    { id: 1, text: "'P' is like 'K' but tilted downward", isCorrect: true },
                    { id: 2, text: "'P' is a flat open palm" },
                    { id: 3, text: "'P' uses only the pinky" },
                    { id: 4, text: "'P' has all fingers curled into a fist" },
                ]
            },
        ]
    },

    'lesson-q-z': {
        id: 'lesson-q-z',
        module: 'module-alphabet',
        title: 'Letters Q, R, S through Z',
        description: 'Complete the alphabet with the final letters.',
        xp: 150,
        questions: [
            {
                id: 150,
                type: 'info',
                text: 'The Final Stretch!',
                visual: '🏁',
                info: "You're almost done with the alphabet! A few highlights: 'R' crosses fingers like 'wishing luck'. 'S' is a fist with thumb over front. 'V' is the peace sign. 'Y' is the shaka/hang loose sign. And like 'J', 'Z' is drawn in the air!"
            },
            {
                id: 151,
                text: "Study 'R' — cross your index and middle fingers together (like crossing fingers for luck), with other fingers curled in.",
                type: 'ai-interactive',
                targetSign: 'R',
                signWord: 'R',
                visual: 'R',
            },
            {
                id: 152,
                text: "'R' looks like you're crossing your fingers for...",
                signWord: 'R',
                visual: 'R',
                options: [
                    { id: 1, text: 'Victory' },
                    { id: 2, text: 'Good luck', isCorrect: true },
                    { id: 3, text: 'Peace' },
                    { id: 4, text: 'Help' },
                ]
            },
            {
                id: 153,
                text: "Study 'S' — make a firm fist with your thumb placed across the front of your fingers (over index and middle finger).",
                type: 'ai-interactive',
                targetSign: 'S',
                signWord: 'S',
                visual: 'S',
            },
            {
                id: 154,
                text: "Study 'V' — extend your index and middle finger upward in a V/peace sign, keeping other fingers and thumb curled.",
                type: 'ai-interactive',
                targetSign: 'V',
                signWord: 'V',
                visual: 'V',
            },
            {
                id: 155,
                text: "'V' is almost the same as...",
                signWord: 'V',
                visual: 'V',
                options: [
                    { id: 1, text: 'The letter U (but spread apart)', isCorrect: true },
                    { id: 2, text: 'The letter W' },
                    { id: 3, text: 'The letter K' },
                    { id: 4, text: 'The letter L' },
                ]
            },
            {
                id: 156,
                text: "Study 'Y' — extend your thumb and pinky finger outward while curling your index, middle, and ring fingers down. This is the 'shaka' or 'hang loose' sign!",
                type: 'ai-interactive',
                targetSign: 'Y',
                signWord: 'Y',
                visual: 'Y',
            },
            {
                id: 157,
                text: "Practice Challenge: Show the sign for 'V' (peace sign).",
                type: 'ai-practice',
                targetSign: 'V',
                visual: 'AI Tracker Active',
            }
        ]
    },

    // ═══════════════════════════════════════════════
    // MODULE 2: NUMBERS & COUNTING
    // ═══════════════════════════════════════════════

    'lesson-num-1-5': {
        id: 'lesson-num-1-5',
        module: 'module-numbers',
        title: 'Numbers 1 — 5',
        description: 'Count from one to five with clear, distinct hand shapes.',
        xp: 100,
        questions: [
            {
                id: 200,
                type: 'info',
                text: 'Counting in ASL',
                visual: '🔢',
                info: "ASL numbers 1-5 may look similar to what you're used to, but there are key differences! Number '3' in ASL uses the thumb, index, AND middle finger — not the three middle fingers. Pay attention to which fingers are used!"
            },
            {
                id: 201,
                text: "Study '1' — simply extend your index finger straight up, all others curled into a fist. (Similar to the letter 'D' but without the thumb loop.)",
                type: 'ai-interactive',
                targetSign: '1',
                signWord: '1',
                visual: '1️⃣',
            },
            {
                id: 202,
                text: "Study '2' — extend your index and middle finger in a V shape. This is also similar to the letter 'V' and 'U'.",
                type: 'ai-interactive',
                targetSign: '2',
                signWord: '2',
                visual: '2️⃣',
            },
            {
                id: 203,
                text: "Study '3' — extend your thumb, index finger, and middle finger. Do NOT use the ring and pinky finger.",
                type: 'ai-interactive',
                targetSign: '3',
                signWord: '3',
                visual: '3️⃣',
            },
            {
                id: 204,
                text: "How do you sign the number 3 in ASL?",
                signWord: '3',
                visual: '3️⃣',
                options: [
                    { id: 1, text: 'Index, middle, and ring finger up' },
                    { id: 2, text: 'Thumb, index, and middle finger up', isCorrect: true },
                    { id: 3, text: 'Pinky, ring, and middle finger up' },
                    { id: 4, text: 'All except pinky' },
                ]
            },
            {
                id: 205,
                text: "Study '4' — extend all four fingers (index, middle, ring, pinky) upward together, with your thumb folded across the palm.",
                type: 'ai-interactive',
                targetSign: '4',
                signWord: '4',
                visual: '4️⃣',
            },
            {
                id: 206,
                text: "Study '5' — spread all five fingers (including thumb) wide open. This is just an open hand!",
                type: 'ai-interactive',
                targetSign: '5',
                signWord: '5',
                visual: '5️⃣',
            },
            {
                id: 207,
                text: "Practice Challenge: Show me the number '5' — spread all fingers wide.",
                type: 'ai-practice',
                targetSign: '5',
                visual: 'AI Tracker Active',
            }
        ]
    },

    'lesson-num-6-10': {
        id: 'lesson-num-6-10',
        module: 'module-numbers',
        title: 'Numbers 6 — 10',
        description: 'Learn 6 through 10, which involve touching configurations.',
        xp: 100,
        questions: [
            {
                id: 210,
                type: 'info',
                text: 'Numbers 6–10',
                visual: '🖖',
                info: "Numbers 6–10 in ASL involve specific fingers touching to distinguish them. For example, '6' has the pinky touch the thumb, '7' has the ring touch the thumb, and so on moving inward. '10' is a thumbs-up with a small shake!"
            },
            {
                id: 211,
                text: "Study '6' — spread all fingers, then touch the tip of your pinky to the tip of your thumb. Other three fingers spread wide.",
                signWord: '6',
                visual: '6️⃣',
                options: [
                    { id: 1, text: 'Ring finger touches thumb' },
                    { id: 2, text: 'Pinky touches thumb while other fingers spread open', isCorrect: true },
                    { id: 3, text: 'All fingers folded in' },
                    { id: 4, text: 'Index and middle touch the thumb' },
                ]
            },
            {
                id: 212,
                text: "Study '7' — spread all fingers, then touch the tip of your ring finger to your thumb. Other fingers stay spread.",
                signWord: '7',
                visual: '7️⃣',
                options: [
                    { id: 1, text: 'Ring finger touches thumb, others spread', isCorrect: true },
                    { id: 2, text: 'Pinky touches thumb' },
                    { id: 3, text: 'All fingers curled' },
                    { id: 4, text: 'Both index and ring touch the thumb' },
                ]
            },
            {
                id: 213,
                text: "Study '8' — touch the tip of your middle finger to your thumb. Index, ring, and pinky fingers spread.",
                signWord: '8',
                visual: '8️⃣',
                options: [
                    { id: 1, text: 'Middle finger touches thumb, others spread', isCorrect: true },
                    { id: 2, text: 'Index finger touches thumb' },
                    { id: 3, text: 'All fingers form a fist' },
                    { id: 4, text: 'Pinky and ring touch the thumb' },
                ]
            },
            {
                id: 214,
                text: "Study '9' — touch the tip of your index finger to your thumb (like an 'O' or 'F' pinch), other fingers curled.",
                signWord: '9',
                visual: '9️⃣',
                options: [
                    { id: 1, text: 'Index finger touches thumb, others loosely extended or curled', isCorrect: true },
                    { id: 2, text: 'All fingers point up' },
                    { id: 3, text: 'Only pinky is extended' },
                    { id: 4, text: 'All fingers form a C curve' },
                ]
            },
            {
                id: 215,
                text: "'10' in ASL — make a 'thumbs up' hand and rotate or shake your wrist slightly from side to side.",
                signWord: '10',
                visual: '🔟',
                options: [
                    { id: 1, text: 'Open all fingers and wiggle them' },
                    { id: 2, text: 'Form a thumbs-up and shake or twist the wrist slightly', isCorrect: true },
                    { id: 3, text: 'Hold up all ten fingers (two hands)' },
                    { id: 4, text: 'Cross index and middle fingers' },
                ]
            },
        ]
    },

    'lesson-num-11-20': {
        id: 'lesson-num-11-20',
        module: 'module-numbers',
        title: 'Numbers 11 — 20',
        description: 'Teen numbers use a combination of number shapes and motion.',
        xp: 120,
        questions: [
            {
                id: 220,
                type: 'info',
                text: 'Teen Numbers in ASL',
                visual: '🔢',
                info: "Teen numbers (11–20) are interesting in ASL! Numbers 11 and 12 flick fingers upward from a fist. 13–19 combine a base number shape with a twist or bend. 20 is a unique 'G' shaped pinch that opens and closes!"
            },
            {
                id: 221,
                text: "For numbers 11 and 12 in ASL, you start with a closed fist and...",
                visual: '1️⃣1️⃣',
                options: [
                    { id: 1, text: 'Flick one finger (11) or two fingers (12) upward from the fist', isCorrect: true },
                    { id: 2, text: 'Show 1 on each hand simultaneously' },
                    { id: 3, text: 'Make the number with one hand and add 10 with the other' },
                    { id: 4, text: 'Tap the palm twice' },
                ]
            },
            {
                id: 222,
                text: "For teen numbers 13–19, the general pattern is to...",
                visual: '🔂',
                options: [
                    { id: 1, text: 'Sign 10 and then the single digit separately' },
                    { id: 2, text: 'Show the single-digit base number (3–9) and add a distinctive twist of the wrist or hand', isCorrect: true },
                    { id: 3, text: 'Use two hands side by side' },
                    { id: 4, text: 'Tap the palm with that number of fingers' },
                ]
            },
            {
                id: 223,
                text: "How do you sign the number 20 in ASL?",
                visual: '2️⃣0️⃣',
                options: [
                    { id: 1, text: 'Open both hands and spread all 10 fingers twice' },
                    { id: 2, text: "Use a 'G' shaped hand (index + thumb pinch) that opens and closes", isCorrect: true },
                    { id: 3, text: 'Sign 2 then 0 sequentially' },
                    { id: 4, text: 'Wiggle all fingers with both hands' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════
    // MODULE 3: GREETINGS & COURTESY
    // ═══════════════════════════════════════════════

    'lesson-greetings-basic': {
        id: 'lesson-greetings-basic',
        module: 'module-greetings',
        title: 'Hello & Goodbye',
        description: 'Master the most essential social signs: greet and part gracefully.',
        xp: 100,
        questions: [
            {
                id: 300,
                type: 'info',
                text: 'First Greetings',
                visual: '👋',
                info: "Greetings are some of the first signs you'll use in real conversations! In ASL, 'Hello' is an open-hand salute that moves away from your forehead. 'Goodbye' is just waving your hand. Simple, but powerful!"
            },
            {
                id: 301,
                text: "Study 'Hello' — place a flat, open hand near your forehead and sweep it outward and away. Like a relaxed salute.",
                type: 'ai-interactive',
                targetSign: 'HELLO',
                signWord: 'Hello',
                visual: '👋',
                youtubeId: '0FcwzMq4iWg',
            },
            {
                id: 302,
                text: "Which motion best describes the ASL sign for 'Hello'?",
                signWord: 'Hello',
                visual: '👋',
                options: [
                    { id: 1, text: 'Fist bumped against chest' },
                    { id: 2, text: 'Flat hand moving outward from the forehead like a salute', isCorrect: true },
                    { id: 3, text: 'Two hands waving above the head' },
                    { id: 4, text: 'Tapping open fingers on chin' },
                ]
            },
            {
                id: 303,
                text: "Study 'Goodbye' — open your hand and wave it from left to right a couple of times, like a casual wave.",
                signWord: 'Goodbye',
                visual: '👋',
                options: [
                    { id: 1, text: 'Salute motion away from forehead' },
                    { id: 2, text: 'Fist moved downward' },
                    { id: 3, text: 'Open hand waving side to side', isCorrect: true },
                    { id: 4, text: 'Both hands swept upward' },
                ]
            },
            {
                id: 304,
                text: "Practice Challenge: Show me 'Hello' — bring your flat hand to your forehead and sweep outward.",
                type: 'ai-practice',
                targetSign: 'HELLO',
                visual: 'AI Tracker Active',
            }
        ]
    },

    'lesson-greetings-courtesy': {
        id: 'lesson-greetings-courtesy',
        module: 'module-greetings',
        title: 'Thank You, Please & Sorry',
        description: 'Learn the essential signs of politeness in ASL.',
        xp: 100,
        questions: [
            {
                id: 310,
                type: 'info',
                text: 'Signs of Politeness',
                visual: '🙏',
                info: "'Thank You', 'Please', and 'Sorry' are signs you'll use constantly. All three originate at or near the chin/chest area. 'Thank You' moves your flat hand out from your chin. 'Please' circles on your chest. 'Sorry' circles a fist on your chest."
            },
            {
                id: 311,
                text: "Study 'Thank You' — place your flat hand (fingers together) against your chin and move it forward and slightly down, like blowing a kiss of gratitude.",
                type: 'ai-interactive',
                targetSign: 'THANKYOU',
                signWord: 'ThankYou',
                visual: '🙌',
            },
            {
                id: 312,
                text: "For 'Thank You', where does the sign start?",
                signWord: 'ThankYou',
                visual: '🙌',
                options: [
                    { id: 1, text: 'At the forehead, moving downward' },
                    { id: 2, text: 'At the chin/mouth, moving forward and slightly down', isCorrect: true },
                    { id: 3, text: 'At the chest, moving upward' },
                    { id: 4, text: 'At the shoulder, moving across the body' },
                ]
            },
            {
                id: 313,
                text: "Study 'Please' — place your flat, open hand on your chest and move it in a circular motion (clockwise).",
                type: 'ai-interactive',
                targetSign: 'PLEASE',
                signWord: 'Please',
                visual: '🙏',
            },
            {
                id: 314,
                text: "'Please' uses which motion on the chest?",
                signWord: 'Please',
                visual: '🙏',
                options: [
                    { id: 1, text: 'A tapping motion' },
                    { id: 2, text: 'A sliding motion downward' },
                    { id: 3, text: 'A circular rubbing motion (flat hand)', isCorrect: true },
                    { id: 4, text: 'A fist rubbing in a circle' },
                ]
            },
            {
                id: 315,
                text: "Study 'Sorry' — make a fist and rub it in a circular motion on your chest. It looks like you're massaging your heart with your knuckles.",
                type: 'ai-interactive',
                targetSign: 'SORRY',
                signWord: 'Sorry',
                visual: '😔',
            },
            {
                id: 316,
                text: "What is the key difference between 'Please' and 'Sorry'?",
                signWord: 'Sorry',
                visual: '😔',
                options: [
                    { id: 1, text: "'Sorry' starts at the chin instead" },
                    { id: 2, text: "'Please' uses a flat hand; 'Sorry' uses a fist — both circle on the chest", isCorrect: true },
                    { id: 3, text: "They look completely identical" },
                    { id: 4, text: "'Sorry' goes on the forehead" },
                ]
            }
        ]
    },

    'lesson-greetings-howareyou': {
        id: 'lesson-greetings-howareyou',
        module: 'module-greetings',
        title: 'How Are You? & Fine',
        description: 'Hold a simple ASL conversation with basic question-answer signs.',
        xp: 100,
        questions: [
            {
                id: 320,
                type: 'info',
                text: 'Your First Conversation',
                visual: '🗣️',
                info: "In ASL, facial expression IS grammar. When asking a question like 'How are you?', you must raise your eyebrows slightly. When making a statement like 'Fine', your face is neutral. This is a grammatical rule, not just body language!"
            },
            {
                id: 321,
                text: "Study 'How' — place both bent hands (like claws) back to back, then rotate them so both palms face up. This is often combined with 'You' to ask 'How are you?'",
                visual: '❓',
                options: [
                    { id: 1, text: 'A rotation of both bent hands', isCorrect: true },
                    { id: 2, text: 'Pointing two index fingers together' },
                    { id: 3, text: 'Waving both hands above the head' },
                    { id: 4, text: 'Tapping the wrist twice' },
                ]
            },
            {
                id: 322,
                text: "'You' in ASL is simply...",
                visual: '👉',
                type: 'ai-interactive',
                targetSign: 'YOU',
                signWord: 'You',
            },
            {
                id: 323,
                text: "When asking 'How are you?' in ASL, your facial expression should...",
                visual: '🤔',
                type: 'etiquette',
                options: [
                    { id: 1, text: 'Be neutral and expressionless' },
                    { id: 2, text: 'Have eyebrows raised slightly (Yes/No question grammar)', isCorrect: true },
                    { id: 3, text: 'Show a furrowed brow (WHY question grammar)' },
                    { id: 4, text: 'Have mouth wide open' },
                ]
            },
            {
                id: 324,
                text: "Study 'FINE' — place your open hand, thumb touching chest, with fingers fanned upward. Tap once against your chest.",
                signWord: 'Fine',
                visual: '👍',
                options: [
                    { id: 1, text: 'Circle your fist on your chest' },
                    { id: 2, text: 'Tap the open hand (thumb side) against the chest once', isCorrect: true },
                    { id: 3, text: 'Pat both hands together' },
                    { id: 4, text: 'Wave the hand away from the face' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════
    // MODULE 4: ESSENTIAL WORDS
    // ═══════════════════════════════════════════════

    'lesson-words-yesno': {
        id: 'lesson-words-yesno',
        module: 'module-words',
        title: 'Yes, No, Want & Don\'t Want',
        description: 'Express agreement, disagreement, and desire in ASL.',
        xp: 100,
        questions: [
            {
                id: 400,
                type: 'info',
                text: 'Core Response Signs',
                visual: '✅',
                info: "'Yes' in ASL is a fist that nods up and down — like a nodding head. 'No' is your index and middle finger snapping down to meet your thumb twice — like a beak closing. These are the most fundamental response signs!"
            },
            {
                id: 401,
                text: "Study 'YES' — make a fist and bob it up and down at the wrist, mimicking a nodding head motion.",
                type: 'ai-interactive',
                targetSign: 'YES',
                signWord: 'Yes',
                visual: '✅',
            },
            {
                id: 402,
                text: "What motion characterizes 'YES' in ASL?",
                signWord: 'Yes',
                visual: '✅',
                options: [
                    { id: 1, text: 'Fist shaking side to side' },
                    { id: 2, text: 'Fist bobbing up and down at the wrist', isCorrect: true },
                    { id: 3, text: 'Open hand tapping on the chest' },
                    { id: 4, text: 'Two thumbs pointing up' },
                ]
            },
            {
                id: 403,
                text: "Study 'NO' — extend your index and middle finger together, then snap them down to meet your thumb twice, quickly. Like a duck beak closing.",
                type: 'ai-interactive',
                targetSign: 'NO',
                signWord: 'No',
                visual: '❌',
            },
            {
                id: 404,
                text: "The sign for 'NO' resembles...",
                signWord: 'No',
                visual: '❌',
                options: [
                    { id: 1, text: 'A fist shaking left to right' },
                    { id: 2, text: 'Index and middle finger snapping to meet thumb (like a beak snapping)', isCorrect: true },
                    { id: 3, text: 'Crossing both hands at the wrists' },
                    { id: 4, text: 'Wagging the index finger side to side' },
                ]
            },
            {
                id: 405,
                text: "Study 'WANT' — hold both curved hands facing upward, fingers slightly bent, and draw them both toward your body.",
                signWord: 'Want',
                visual: '🤲',
                options: [
                    { id: 1, text: 'Both curved hands pulling toward the body', isCorrect: true },
                    { id: 2, text: 'One hand pointing outward' },
                    { id: 3, text: 'Both fists touching at chest' },
                    { id: 4, text: 'Hands pushing forward repeatedly' },
                ]
            },
        ]
    },

    'lesson-words-namehelp': {
        id: 'lesson-words-namehelp',
        module: 'module-words',
        title: 'Name, Help, Love & More',
        description: 'Critical vocabulary for introducing yourself and asking for assistance.',
        xp: 120,
        questions: [
            {
                id: 410,
                type: 'info',
                text: 'Social Essentials',
                visual: '🤝',
                info: "Three of the most important signs you'll use: 'NAME' (tapping H-shaped hands), 'HELP' (a lifted A-hand on a flat palm), and 'LOVE' (crossing your arms over your heart). These open doors to connection!"
            },
            {
                id: 411,
                text: "Study 'NAME' — form an 'H' shape (index + middle extended) with both hands, then tap the top hand's fingers on the bottom hand's fingers twice.",
                type: 'ai-interactive',
                targetSign: 'NAME',
                signWord: 'Name',
                visual: '🪪',
            },
            {
                id: 412,
                text: "The 'NAME' sign uses which letter shapes?",
                signWord: 'Name',
                visual: '🪪',
                options: [
                    { id: 1, text: 'Two A-fists' },
                    { id: 2, text: 'Two H-shaped hands (index + middle) tapping together', isCorrect: true },
                    { id: 3, text: 'Two V-signs tapping together' },
                    { id: 4, text: 'Both open palms overlapping' },
                ]
            },
            {
                id: 413,
                text: "Study 'HELP' — place one fist (making 'A') on the flat palm of your other hand, then lift both hands upward together.",
                type: 'ai-interactive',
                targetSign: 'HELP',
                signWord: 'Help',
                visual: '🆘',
            },
            {
                id: 414,
                text: "What does the 'HELP' sign look like?",
                signWord: 'Help',
                visual: '🆘',
                options: [
                    { id: 1, text: 'One hand waving above the head' },
                    { id: 2, text: 'An A-fist placed on a flat palm, both lifting upward together', isCorrect: true },
                    { id: 3, text: 'Two fists knocking against each other' },
                    { id: 4, text: 'Both hands pointing upward simultaneously' },
                ]
            },
            {
                id: 415,
                text: "Study 'LOVE' — cross both arms over your heart/chest area, like you are hugging yourself.",
                type: 'ai-interactive',
                targetSign: 'LOVE',
                signWord: 'Love',
                visual: '❤️',
            },
            {
                id: 416,
                text: "The 'LOVE' sign involves...",
                signWord: 'Love',
                visual: '❤️',
                options: [
                    { id: 1, text: 'Making a heart shape with both index fingers and thumbs' },
                    { id: 2, text: 'Crossing arms over the heart/chest like a self-hug', isCorrect: true },
                    { id: 3, text: 'Pointing to the heart with one finger repeatedly' },
                    { id: 4, text: 'Tapping both fists on the chest' },
                ]
            },
        ]
    },

    // ═══════════════════════════════════════════════
    // MODULE 5: DEAF CULTURE & ETIQUETTE
    // ═══════════════════════════════════════════════

    'lesson-culture-basics': {
        id: 'lesson-culture-basics',
        module: 'module-culture',
        title: 'Getting Attention & Interaction',
        description: 'Learn how to respectfully get a Deaf person\'s attention.',
        xp: 100,
        questions: [
            {
                id: 500,
                type: 'info',
                text: 'Deaf Community Norms',
                visual: '🤝',
                info: "The Deaf community has its own rich cultural norms. Since calling out a name doesn't work, Deaf people use visual and tactile methods to get attention. Learning these norms shows respect and helps you communicate naturally."
            },
            {
                id: 501,
                text: "How do you get a Deaf person's attention when they are not looking at you and are nearby?",
                type: 'etiquette',
                visual: '🤔',
                options: [
                    { id: 1, text: "Shout their name loudly" },
                    { id: 2, text: "Lightly tap their shoulder once or twice", isCorrect: true },
                    { id: 3, text: "Throw an object to make a sound" },
                    { id: 4, text: "Poke them hard in the back" },
                ]
            },
            {
                id: 502,
                text: "In a crowded room with multiple Deaf people, the best way to get everyone's attention is to...",
                type: 'etiquette',
                visual: '💡',
                options: [
                    { id: 1, text: "Yell loudly" },
                    { id: 2, text: "Flicker the lights on and off briefly", isCorrect: true },
                    { id: 3, text: "Stomp on the floor loudly" },
                    { id: 4, text: "Walk up to each person one by one" },
                ]
            },
            {
                id: 503,
                text: "If you need to walk between two Deaf people who are signing to each other in a corridor, you should...",
                type: 'etiquette',
                visual: '🚶',
                options: [
                    { id: 1, text: "Wait until their entire conversation is over" },
                    { id: 2, text: "Crouch down and crawl under their arm line" },
                    { id: 3, text: "Walk through at a normal, calm pace — briefly ducking or saying 'excuse me' is acceptable", isCorrect: true },
                    { id: 4, text: "Push them apart to make room" },
                ]
            },
            {
                id: 504,
                text: "Why is it important to maintain eye contact during an ASL conversation?",
                type: 'etiquette',
                visual: '👀',
                options: [
                    { id: 1, text: "It is just polite general etiquette" },
                    { id: 2, text: "Eye contact is required for grammatical and conversational signals in ASL — looking away is like covering your ears", isCorrect: true },
                    { id: 3, text: "Deaf people can't communicate without it" },
                    { id: 4, text: "It means you are enthusiastic" },
                ]
            },
        ]
    },

    'lesson-culture-advanced': {
        id: 'lesson-culture-advanced',
        module: 'module-culture',
        title: 'Language, Identity & Respect',
        description: 'Understand Deaf identity and how to be a respectful ally.',
        xp: 120,
        questions: [
            {
                id: 510,
                type: 'info',
                text: 'Deaf Culture & Identity',
                visual: '🏛️',
                info: "Many Deaf people view Deafness not as a disability, but as a cultural and linguistic identity — they are part of the 'Deaf community' (capital D). Understanding this distinction helps you approach conversations with the right mindset and respect."
            },
            {
                id: 511,
                text: "What does capitalizing the 'D' in 'Deaf' (as opposed to 'deaf') typically signify?",
                type: 'etiquette',
                visual: '📖',
                options: [
                    { id: 1, text: 'It means the person has total hearing loss' },
                    { id: 2, text: 'It denotes identity — membership in the Deaf cultural and linguistic community', isCorrect: true },
                    { id: 3, text: 'It is a typo or grammatical error' },
                    { id: 4, text: 'It means the person was born Deaf' },
                ]
            },
            {
                id: 512,
                text: "Which term is generally considered more respectful to use when referring to a person with hearing loss?",
                type: 'etiquette',
                visual: '🗣️',
                options: [
                    { id: 1, text: "Hearing impaired (always preferred)" },
                    { id: 2, text: "Deaf person or hard-of-hearing person (person-first or identity-first based on individual preference)", isCorrect: true },
                    { id: 3, text: "Mute" },
                    { id: 4, text: "Normal-hearing deficient person" },
                ]
            },
            {
                id: 513,
                text: "Is it appropriate to speak and sign at the same time (Simultaneous Communication)?",
                type: 'etiquette',
                visual: '🔄',
                options: [
                    { id: 1, text: "Yes, always — it's the standard way to communicate with Deaf people" },
                    { id: 2, text: "It can cause errors in both signing and speech quality; pure ASL is preferred in Deaf community settings", isCorrect: true },
                    { id: 3, text: "No, it's rude to speak at all around Deaf people" },
                    { id: 4, text: "Only if the Deaf person requests it" },
                ]
            },
            {
                id: 514,
                text: "If you don't understand what a Deaf person signed, the best response is...",
                type: 'etiquette',
                visual: '🤷',
                options: [
                    { id: 1, text: "Laugh and pretend you understood" },
                    { id: 2, text: "Gesture for them to write it down without asking them to sign again first" },
                    { id: 3, text: "Sign 'AGAIN?' or 'REPEAT?' and ask them to sign it once more", isCorrect: true },
                    { id: 4, text: "Walk away and end the conversation" },
                ]
            },
        ]
    },
};

// Define the linear order of lessons for unlocking progression
export const LESSON_ORDER = [
    // Module 1: Alphabet
    'lesson-a-c',
    'lesson-d-f',
    'lesson-g-i',
    'lesson-j-l',
    'lesson-m-p',
    'lesson-q-z',
    // Module 2: Numbers
    'lesson-num-1-5',
    'lesson-num-6-10',
    'lesson-num-11-20',
    // Module 3: Greetings
    'lesson-greetings-basic',
    'lesson-greetings-courtesy',
    'lesson-greetings-howareyou',
    // Module 4: Essential Words
    'lesson-words-yesno',
    'lesson-words-namehelp',
    // Module 5: Culture
    'lesson-culture-basics',
    'lesson-culture-advanced',
];
