import { query } from './db.js';

async function testModes() {
    console.log('--- Checking Recordings Multipliers ---');
    try {
        const recs = await query('SELECT id, type FROM recordings ORDER BY id DESC LIMIT 5');
        console.log('Recent Recordings Types:', recs.rows);

        for (const rec of recs.rows) {
            const modeName = rec.type;
            const modeRes = await query('SELECT multiplier FROM transcription_modes WHERE name = $1 OR name ILIKE $1', [modeName]);
            const multiplier = parseFloat(modeRes.rows[0]?.multiplier || '1.0');
            console.log(`- Rec ${rec.id}: type="${modeName}" -> resolves to ${multiplier}x multiplier`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
testModes();
