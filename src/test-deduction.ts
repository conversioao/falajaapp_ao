function oldRounding(sec: number, mult: number): number {
    const baseMins = Math.ceil(sec / 60);
    return Math.ceil(baseMins * mult);
}

function newRounding(sec: number, mult: number): number {
    return Math.ceil((sec / 60) * mult);
}

const testCases = [
    { sec: 19, mult: 1.0, label: '19s, 1.0x' },
    { sec: 19, mult: 1.5, label: '19s, 1.5x' },
    { sec: 70, mult: 1.0, label: '70s, 1.0x' },
    { sec: 70, mult: 1.5, label: '70s, 1.5x' },
    { sec: 119, mult: 1.5, label: '119s, 1.5x' },
    { sec: 121, mult: 1.0, label: '121s, 1.0x' },
];

console.log('--- Credit Deduction Math Verification ---');
console.log('Label | Old (Aggressive) | New (Fair) | Improvement');
console.log('------|------------------|------------|------------');

testCases.forEach(tc => {
    const oldVal = oldRounding(tc.sec, tc.mult);
    const newVal = newRounding(tc.sec, tc.mult);
    const diff = oldVal - newVal;
    console.log(`${tc.label.padEnd(10)} | ${oldVal.toString().padStart(16)} | ${newVal.toString().padStart(10)} | ${diff > 0 ? '+' : ''}${diff} min`);
});

console.log('-------------------------------------------');
