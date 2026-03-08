import fp from 'fingerpose';

// ─── Helper shorthand ───────────────────────────────────────────────────────
const { Finger, FingerCurl, FingerDirection } = fp;
const { Thumb, Index, Middle, Ring, Pinky } = Finger;
const { NoCurl, HalfCurl, FullCurl } = FingerCurl;
const { VerticalUp, DiagonalUpLeft, DiagonalUpRight, HorizontalLeft, HorizontalRight } = FingerDirection;

// ─── LETTER A ─────────────────────────────────────────────────────────────
// Fist; all fingers fully curled. Thumb alongside index, pointing up.
const letterA = new fp.GestureDescription('A');
letterA.addCurl(Thumb, NoCurl, 1.0);
letterA.addDirection(Thumb, VerticalUp, 1.0);
letterA.addDirection(Thumb, DiagonalUpLeft, 0.9);
letterA.addDirection(Thumb, DiagonalUpRight, 0.9);
for (const f of [Index, Middle, Ring, Pinky]) {
    letterA.addCurl(f, FullCurl, 1.0);
    letterA.addCurl(f, HalfCurl, 0.9);
}

// ─── LETTER B ─────────────────────────────────────────────────────────────
// All four fingers straight up, thumb folded in across palm.
const letterB = new fp.GestureDescription('B');
letterB.addCurl(Thumb, HalfCurl, 1.0);
letterB.addCurl(Thumb, FullCurl, 0.9);
for (const f of [Index, Middle, Ring, Pinky]) {
    letterB.addCurl(f, NoCurl, 1.0);
    letterB.addDirection(f, VerticalUp, 1.0);
}

// ─── LETTER C ─────────────────────────────────────────────────────────────
// All fingers and thumb curved into a C-shape (half curl).
// Key: ALL fingers must be curled — distinguishes from Y (only pinky+thumb open).
// Direction: fingers point sideways (HorizontalLeft) for the C orientation.
const letterC = new fp.GestureDescription('C');
// All five curved — none can be fully straight (NoCurl) or fully closed (FullCurl)
for (const f of [Index, Middle, Ring, Pinky]) {
    letterC.addCurl(f, HalfCurl, 1.0);
    letterC.addCurl(f, FullCurl, 0.3);   // low tolerance if slightly over-curled
    // Explicitly penalize NoCurl (prevents Y shape from matching)
    letterC.addCurl(f, NoCurl, 0.0);
}
letterC.addCurl(Thumb, HalfCurl, 1.0);
letterC.addCurl(Thumb, NoCurl, 0.2);    // thumb can be slightly open for C but not fully
// Fingers point sideways in a C — this is the key differentiator from Y/B
for (const f of [Index, Middle]) {
    letterC.addDirection(f, HorizontalLeft, 0.9);
    letterC.addDirection(f, HorizontalRight, 0.9);
    letterC.addDirection(f, DiagonalUpLeft, 0.8);
    letterC.addDirection(f, DiagonalUpRight, 0.8);
}

// ─── LETTER D ─────────────────────────────────────────────────────────────
// Index straight up; middle, ring, pinky curl to meet thumb (forming an oval).
const letterD = new fp.GestureDescription('D');
letterD.addCurl(Index, NoCurl, 1.0);
letterD.addDirection(Index, VerticalUp, 1.0);
for (const f of [Middle, Ring, Pinky]) {
    letterD.addCurl(f, FullCurl, 1.0);
    letterD.addCurl(f, HalfCurl, 0.8);
}
letterD.addCurl(Thumb, HalfCurl, 1.0);

// ─── LETTER E ─────────────────────────────────────────────────────────────
// All four fingers bent (HalfCurl or FullCurl), thumb tucked underneath.
const letterE = new fp.GestureDescription('E');
letterE.addCurl(Thumb, HalfCurl, 1.0);
letterE.addCurl(Thumb, FullCurl, 0.9);
for (const f of [Index, Middle, Ring, Pinky]) {
    letterE.addCurl(f, HalfCurl, 1.0);
    letterE.addCurl(f, FullCurl, 0.9);
}

// ─── LETTER F ─────────────────────────────────────────────────────────────
// Index + thumb pinch (OK shape); middle, ring, pinky extended.
const letterF = new fp.GestureDescription('F');
letterF.addCurl(Index, HalfCurl, 1.0);
letterF.addCurl(Thumb, HalfCurl, 1.0);
for (const f of [Middle, Ring, Pinky]) {
    letterF.addCurl(f, NoCurl, 1.0);
    letterF.addDirection(f, VerticalUp, 1.0);
    letterF.addDirection(f, DiagonalUpLeft, 0.8);
}

// ─── LETTER G ─────────────────────────────────────────────────────────────
// Index points sideways; thumb points up/sideways (gun shape). Others curled.
const letterG = new fp.GestureDescription('G');
letterG.addCurl(Index, NoCurl, 1.0);
letterG.addDirection(Index, HorizontalLeft, 1.0);
letterG.addDirection(Index, HorizontalRight, 1.0);
letterG.addCurl(Thumb, NoCurl, 1.0);
letterG.addDirection(Thumb, VerticalUp, 0.9);
for (const f of [Middle, Ring, Pinky]) {
    letterG.addCurl(f, FullCurl, 1.0);
}

// ─── LETTER I ─────────────────────────────────────────────────────────────
// Only pinky extended straight up; all others (including thumb) curled.
const letterI = new fp.GestureDescription('I');
letterI.addCurl(Pinky, NoCurl, 1.0);
letterI.addDirection(Pinky, VerticalUp, 1.0);
for (const f of [Thumb, Index, Middle, Ring]) {
    letterI.addCurl(f, FullCurl, 1.0);
    letterI.addCurl(f, HalfCurl, 0.8);
}

// ─── LETTER K ─────────────────────────────────────────────────────────────
// Index and middle point up in a V; thumb rests between them (open V with thumb).
const letterK = new fp.GestureDescription('K');
letterK.addCurl(Index, NoCurl, 1.0);
letterK.addCurl(Middle, NoCurl, 1.0);
letterK.addDirection(Index, VerticalUp, 1.0);
letterK.addDirection(Middle, VerticalUp, 1.0);
letterK.addDirection(Middle, DiagonalUpLeft, 0.8);
letterK.addCurl(Thumb, NoCurl, 0.9);
for (const f of [Ring, Pinky]) {
    letterK.addCurl(f, FullCurl, 1.0);
}

// ─── LETTER L ─────────────────────────────────────────────────────────────
// Index straight up + thumb straight out to side. Others curled.
const letterL = new fp.GestureDescription('L');
letterL.addCurl(Index, NoCurl, 1.0);
letterL.addDirection(Index, VerticalUp, 1.0);
letterL.addCurl(Thumb, NoCurl, 1.0);
letterL.addDirection(Thumb, HorizontalLeft, 1.0);
letterL.addDirection(Thumb, DiagonalUpLeft, 0.8);
for (const f of [Middle, Ring, Pinky]) {
    letterL.addCurl(f, FullCurl, 1.0);
}

// ─── LETTER O ─────────────────────────────────────────────────────────────
// All fingers and thumb curve inward to form an O, tips touching thumb tip.
const letterO = new fp.GestureDescription('O');
for (const f of [Thumb, Index, Middle, Ring, Pinky]) {
    letterO.addCurl(f, HalfCurl, 1.0);
    letterO.addCurl(f, FullCurl, 0.7);
}

// ─── LETTER R ─────────────────────────────────────────────────────────────
// Index and middle cross/twist over each other (crossed fingers for luck).
const letterR = new fp.GestureDescription('R');
letterR.addCurl(Index, NoCurl, 1.0);
letterR.addCurl(Middle, NoCurl, 1.0);
letterR.addDirection(Index, VerticalUp, 1.0);
letterR.addDirection(Middle, VerticalUp, 1.0);
letterR.addDirection(Middle, DiagonalUpLeft, 0.9); // middle shifted toward index
for (const f of [Ring, Pinky]) {
    letterR.addCurl(f, FullCurl, 1.0);
}
letterR.addCurl(Thumb, FullCurl, 1.0);

// ─── LETTER S ─────────────────────────────────────────────────────────────
// Fist with thumb placed across the front/side of bent fingers.
const letterS = new fp.GestureDescription('S');
letterS.addCurl(Thumb, HalfCurl, 1.0);
letterS.addCurl(Thumb, NoCurl, 0.8);
letterS.addDirection(Thumb, HorizontalLeft, 0.8);
letterS.addDirection(Thumb, DiagonalUpLeft, 0.9);
for (const f of [Index, Middle, Ring, Pinky]) {
    letterS.addCurl(f, FullCurl, 1.0);
}

// ─── LETTER U ─────────────────────────────────────────────────────────────
// Index and middle extended straight and together. Ring, pinky, thumb curl.
const letterU = new fp.GestureDescription('U');
letterU.addCurl(Index, NoCurl, 1.0);
letterU.addCurl(Middle, NoCurl, 1.0);
letterU.addDirection(Index, VerticalUp, 1.0);
letterU.addDirection(Middle, VerticalUp, 1.0);
for (const f of [Ring, Pinky]) {
    letterU.addCurl(f, FullCurl, 1.0);
}
letterU.addCurl(Thumb, FullCurl, 1.0);

// ─── LETTER V ─────────────────────────────────────────────────────────────
// Index and middle spread (V / peace sign). Other fingers and thumb curl.
const letterV = new fp.GestureDescription('V');
letterV.addCurl(Index, NoCurl, 1.0);
letterV.addCurl(Middle, NoCurl, 1.0);
letterV.addDirection(Index, VerticalUp, 1.0);
letterV.addDirection(Index, DiagonalUpLeft, 0.9);
letterV.addDirection(Middle, VerticalUp, 1.0);
letterV.addDirection(Middle, DiagonalUpRight, 0.9);
for (const f of [Ring, Pinky]) {
    letterV.addCurl(f, FullCurl, 1.0);
}
letterV.addCurl(Thumb, FullCurl, 1.0);

// ─── LETTER W ─────────────────────────────────────────────────────────────
// Index, middle, and ring spread upward (W/three-finger spread). Pinky and thumb curl.
const letterW = new fp.GestureDescription('W');
letterW.addCurl(Index, NoCurl, 1.0);
letterW.addCurl(Middle, NoCurl, 1.0);
letterW.addCurl(Ring, NoCurl, 1.0);
letterW.addDirection(Index, VerticalUp, 1.0);
letterW.addDirection(Middle, VerticalUp, 1.0);
letterW.addDirection(Ring, VerticalUp, 1.0);
letterW.addCurl(Pinky, FullCurl, 1.0);
letterW.addCurl(Thumb, FullCurl, 1.0);

// ─── LETTER Y ─────────────────────────────────────────────────────────────
// Thumb and pinky extended (shaka/hang loose). Index, middle, ring STRICTLY fully curled.
const letterY = new fp.GestureDescription('Y');
letterY.addCurl(Thumb, NoCurl, 1.0);
letterY.addDirection(Thumb, DiagonalUpLeft, 0.7);
letterY.addDirection(Thumb, HorizontalLeft, 0.8);
letterY.addCurl(Pinky, NoCurl, 1.0);
letterY.addDirection(Pinky, VerticalUp, 0.9);
letterY.addDirection(Pinky, DiagonalUpLeft, 0.8);
// Middle three MUST be fully curled — remove HalfCurl tolerance that confused with C
for (const f of [Index, Middle, Ring]) {
    letterY.addCurl(f, FullCurl, 1.0);
    // HalfCurl is NOT accepted for Y — prevents C-shaped hand matching here
}

// ─── COMMON SIGN: HELLO ───────────────────────────────────────────────────
// Open palm — all fingers NoCurl, no specific direction required.
const signHello = new fp.GestureDescription('HELLO');
for (const f of [Thumb, Index, Middle, Ring, Pinky]) {
    signHello.addCurl(f, NoCurl, 1.0);
}

// ─── NUMBER: 1 ────────────────────────────────────────────────────────────
// Only index finger up; all others curled. (Like 'D' but without thumb oval)
const num1 = new fp.GestureDescription('1');
num1.addCurl(Index, NoCurl, 1.0);
num1.addDirection(Index, VerticalUp, 1.0);
for (const f of [Thumb, Middle, Ring, Pinky]) {
    num1.addCurl(f, FullCurl, 1.0);
    num1.addCurl(f, HalfCurl, 0.7);
}

// ─── NUMBER: 2 ────────────────────────────────────────────────────────────
// Index and middle up (like V but more together). Others curled.
const num2 = new fp.GestureDescription('2');
num2.addCurl(Index, NoCurl, 1.0);
num2.addCurl(Middle, NoCurl, 1.0);
num2.addDirection(Index, VerticalUp, 1.0);
num2.addDirection(Middle, VerticalUp, 1.0);
for (const f of [Ring, Pinky, Thumb]) {
    num2.addCurl(f, FullCurl, 1.0);
}

// ─── NUMBER: 5 ────────────────────────────────────────────────────────────
// All fingers spread wide open — open hand.
const num5 = new fp.GestureDescription('5');
for (const f of [Thumb, Index, Middle, Ring, Pinky]) {
    num5.addCurl(f, NoCurl, 1.0);
}
num5.addDirection(Index, VerticalUp, 0.8);
num5.addDirection(Middle, VerticalUp, 0.8);

// ─── Export all gestures ──────────────────────────────────────────────────
export const ASLGestures = [
    letterA, letterB, letterC, letterD, letterE, letterF,
    letterG, letterI, letterK, letterL,
    letterO, letterR, letterS, letterU, letterV, letterW, letterY,
    signHello,
    num1, num2, num5,
];
