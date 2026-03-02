
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';
import { hashPassword, comparePassword, generateToken, verifyToken } from './auth.js';
import fetch from 'node-fetch';

dotenv.config();

// Disable SSL verification for local development (needed for n8n.local with self-signed certs)
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('<h1>FalaJá API</h1><p>O servidor backend está a funcionar corretamente. Por favor, aceda à aplicação através do frontend (geralmente na porta 5173 ou via npm run dev).</p>');
});

// Middleware to authenticate JWT
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
};

// Middleware to require admin role
const requireAdmin = async (req: any, res: any, next: any) => {
    try {
        const result = await query('SELECT role FROM users WHERE id = $1', [req.userId]);
        const user = result.rows[0];
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);

        const result = await query(
            'INSERT INTO users (name, email, password_hash, credits, app_mode, role, plan) VALUES ($1, $2, $3, 10, $4, $5, $6) RETURNING id, name, email, plan, credits, used_minutes as "usedMinutes", avatar_url as "avatarUrl", app_mode as "appMode", role',
            [name, email, passwordHash, 'professional', 'user', 'Gratuito']
        );

        const user = result.rows[0];
        const token = generateToken({ id: user.id });

        // --- n8n Integration: Duplicate Workflow ---
        try {
            const n8nApiKey = process.env.N8N_API_KEY;
            const templateWorkflowId = process.env.N8N_TEMPLATE_WORKFLOW_ID;
            const n8nBaseUrl = process.env.N8N_API_BASE_URL;

            if (n8nApiKey && templateWorkflowId && n8nBaseUrl) {
                // Duplicate the workflow
                const duplicateRes = await fetch(`${n8nBaseUrl}/workflows/${templateWorkflowId}/duplicate`, {
                    method: 'POST',
                    headers: {
                        'X-N8N-API-KEY': n8nApiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: `${user.name} - ${user.plan}`
                    })
                });

                if (duplicateRes.ok) {
                    const duplicateData: any = await duplicateRes.json();
                    console.log(`n8n workflow duplicated for user ${user.name}: ${duplicateData.id}`);
                    // Optionally update user with workflow ID
                    await query('UPDATE users SET workflow_id = $1 WHERE id = $2', [duplicateData.id, user.id]);
                } else {
                    console.error('Failed to duplicate n8n workflow:', await duplicateRes.text());
                }
            }
        } catch (n8nError) {
            console.error('n8n integration error during signup:', n8nError);
        }

        res.status(201).json({ user, token });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await comparePassword(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id });

        delete user.password_hash;
        user.usedMinutes = user.used_minutes || 0;
        user.avatarUrl = user.avatar_url;
        user.appMode = user.app_mode || 'professional';
        user.role = user.role || 'user';

        res.json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
        const result = await query('SELECT id, name, email, plan, credits, used_minutes as "usedMinutes", avatar_url as "avatarUrl", role, app_mode as "appMode" FROM users WHERE id = $1', [req.userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- RECORDINGS ROUTES ---

app.get('/api/recordings', authenticateToken, async (req: any, res) => {
    try {
        const result = await query(
            'SELECT id, title, date, duration, duration_sec as "durationSec", status, type, transcription, summary, action_items as "actionItems", audio_url as "audioUrl" FROM recordings WHERE user_id = $1 ORDER BY date DESC',
            [req.userId]
        );
        res.json({ recordings: result.rows });
    } catch (error) {
        console.error('Get recordings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/transcribe', authenticateToken, async (req: any, res) => {
    try {
        const webhookUrl = process.env.N8N_TRANSCRIPTION_WEBHOOK;
        if (!webhookUrl) {
            console.error('Transcription error: N8N_TRANSCRIPTION_WEBHOOK not configured');
            return res.status(500).json({ error: 'Transcription service not configured' });
        }

        console.log(`Forwarding transcription request to: ${webhookUrl}`);

        const mode = req.headers['x-mode'] || 'standard';

        // Forward binary data to n8n
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': req.headers['content-type'] || 'audio/wav',
                'X-User-Id': req.userId.toString(),
                'X-Mode': mode.toString()
            },
            body: req
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`n8n transcription failed (${response.status}): ${errorText}`);
        }

        const data: any = await response.json();
        console.log('n8n response data:', JSON.stringify(data).substring(0, 500));
        // Return the full response from n8n
        res.json(data);
    } catch (error: any) {
        console.error('Transcription proxy error:', error);
        res.status(500).json({
            error: 'Failed to transcribe audio',
            details: error.message,
            target: process.env.N8N_TRANSCRIPTION_WEBHOOK
        });
    }
});

app.post('/api/recordings', authenticateToken, async (req: any, res) => {
    const { title, duration, durationSec, type, transcription, summary, actionItems } = req.body;

    try {
        // Start transaction
        await query('BEGIN');

        // Fetch multiplier for the mode
        const modeRes = await query('SELECT multiplier FROM transcription_modes WHERE name = $1', [type]);
        const multiplier = modeRes.rows[0]?.multiplier || 1.0;

        const recordingResult = await query(
            'INSERT INTO recordings (user_id, title, duration, duration_sec, type, transcription, summary, action_items) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, title, date, duration, duration_sec as "durationSec", status, type, transcription, summary, action_items as "actionItems", audio_url as "audioUrl"',
            [req.userId, title, duration, durationSec, type, transcription, summary, actionItems]
        );

        const baseMinutes = Math.ceil(durationSec / 60);
        const usedMinutesInc = Math.ceil(baseMinutes * multiplier);
        await query('UPDATE users SET used_minutes = used_minutes + $1, credits = GREATEST(0, credits - $1) WHERE id = $2', [usedMinutesInc, req.userId]);

        await query('COMMIT');

        res.status(201).json({ recording: recordingResult.rows[0] });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Create recording error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/recordings/:id', authenticateToken, async (req: any, res) => {
    const { title, transcription, summary, actionItems } = req.body;
    const { id } = req.params;

    try {
        const result = await query(
            `UPDATE recordings 
             SET title = COALESCE($1, title),
                 transcription = COALESCE($2, transcription),
                 summary = COALESCE($3, summary),
                 action_items = COALESCE($4, action_items)
             WHERE id = $5 AND user_id = $6 
             RETURNING id, title, transcription, summary, action_items as "actionItems"`,
            [title, transcription, summary, actionItems, id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recording not found' });
        }

        res.json({ recording: result.rows[0] });
    } catch (error) {
        console.error('Update recording error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/recordings/:id', authenticateToken, async (req: any, res) => {
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM recordings WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recording not found' });
        }

        res.json({ message: 'Recording deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- USER MANAGEMENT ROUTES ---

app.patch('/api/user/profile', authenticateToken, async (req: any, res) => {
    const { name, avatarUrl } = req.body;

    try {
        const result = await query(
            'UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING id, name, email, plan, credits, used_minutes as "usedMinutes", avatar_url as "avatarUrl", app_mode as "appMode", role',
            [name, avatarUrl, req.userId]
        );

        res.json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/user/add-credits', authenticateToken, async (req: any, res) => {
    const { amount } = req.body;

    try {
        const result = await query(
            'UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING id, credits',
            [amount, req.userId]
        );

        res.json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/user/mode', authenticateToken, async (req: any, res) => {
    const { mode } = req.body;

    if (!mode || !['simple', 'professional'].includes(mode)) {
        return res.status(400).json({ error: 'Invalid mode' });
    }

    try {
        const result = await query(
            'UPDATE users SET app_mode = $1 WHERE id = $2 RETURNING id, app_mode as "appMode"',
            [mode, req.userId]
        );

        res.json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/user/upgrade-plan', authenticateToken, async (req: any, res) => {
    const { plan } = req.body; // 'Premium' | 'Business'
    let additionalCredits = plan === 'Premium' ? 300 : 1200;

    try {
        const result = await query(
            'UPDATE users SET plan = $1, credits = credits + $2 WHERE id = $3 RETURNING id, name, email, plan, credits, used_minutes as "usedMinutes", avatar_url as "avatarUrl", app_mode as "appMode", role',
            [plan, additionalCredits, req.userId]
        );

        res.json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- PAYMENTS ROUTES ---

app.post('/api/payments/submit', authenticateToken, async (req: any, res) => {
    const { type, planName, amountKz, transactionId, proofBase64 } = req.body;

    if (!type || !amountKz || !transactionId) {
        return res.status(400).json({ error: 'Missing payment details' });
    }

    try {
        const result = await query(
            'INSERT INTO transactions (user_id, type, plan_name, amount_kz, transaction_id, proof_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [req.userId, type, planName, amountKz, transactionId, proofBase64 || null, 'pending']
        );
        res.status(201).json({ transaction: result.rows[0] });
    } catch (error: any) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'ID de transação já utilizado' });
        }
        console.error('Payment submit error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/payments/my', authenticateToken, async (req: any, res) => {
    try {
        const result = await query(
            'SELECT id, type, plan_name as "planName", amount_kz as "amountKz", transaction_id as "transactionId", status, created_at as "createdAt" FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
            [req.userId]
        );
        res.json({ transactions: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- PLANS ROUTES ---

app.get('/api/plans', async (req, res) => {
    try {
        const result = await query('SELECT * FROM plans ORDER BY price_kz ASC');
        res.json({ plans: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- MODES ROUTES ---

app.get('/api/modes', async (req, res) => {
    try {
        const result = await query('SELECT * FROM transcription_modes ORDER BY name ASC');
        res.json({ modes: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/modes', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await query('SELECT * FROM transcription_modes ORDER BY id ASC');
        res.json({ modes: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/admin/modes', authenticateToken, requireAdmin, async (req, res) => {
    const { name, multiplier, description } = req.body;
    try {
        const result = await query(
            'INSERT INTO transcription_modes (name, multiplier, description) VALUES ($1, $2, $3) RETURNING *',
            [name, multiplier, description]
        );
        res.status(201).json({ mode: result.rows[0] });
    } catch (error: any) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Modo com este nome já existe' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/admin/modes/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, multiplier, description } = req.body;
    try {
        const result = await query(
            'UPDATE transcription_modes SET name = COALESCE($1, name), multiplier = COALESCE($2, multiplier), description = COALESCE($3, description) WHERE id = $4 RETURNING *',
            [name, multiplier, description, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mode not found' });
        res.json({ mode: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/admin/modes/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM transcription_modes WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mode not found' });
        res.json({ message: 'Mode deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
    const { name, price_kz, minutes, features, is_popular } = req.body;
    try {
        const result = await query(
            'INSERT INTO plans (name, price_kz, minutes, features, is_popular) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, price_kz, minutes, features || [], is_popular || false]
        );
        res.status(201).json({ plan: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/admin/plans/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, price_kz, minutes, features, is_popular } = req.body;
    try {
        const result = await query(
            'UPDATE plans SET name = COALESCE($1, name), price_kz = COALESCE($2, price_kz), minutes = COALESCE($3, minutes), features = COALESCE($4, features), is_popular = COALESCE($5, is_popular) WHERE id = $6 RETURNING *',
            [name, price_kz, minutes, features, is_popular, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Plan not found' });
        res.json({ plan: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/admin/plans/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM plans WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Plan not found' });
        res.json({ message: 'Plan deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/payments', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await query(
            `SELECT t.*, u.name as "userName", u.email as "userEmail" 
             FROM transactions t 
             JOIN users u ON t.user_id = u.id 
             ORDER BY t.created_at DESC`
        );
        res.json({ transactions: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/admin/payments/:id/review', authenticateToken, requireAdmin, async (req: any, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        await query('BEGIN');

        const transRes = await query('SELECT * FROM transactions WHERE id = $1', [id]);
        const trans = transRes.rows[0];

        if (!trans) {
            await query('ROLLBACK');
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (trans.status !== 'pending' && trans.status !== null) {
            await query('ROLLBACK');
            return res.status(400).json({ error: 'Transaction already reviewed' });
        }

        if (status === 'approved') {
            await query(
                'UPDATE transactions SET status = $1, proof_url = NULL WHERE id = $2',
                [status, id]
            );

            if (trans.type === 'plan_upgrade') {
                // Fetch credits from plans table
                const planResult = await query('SELECT minutes FROM plans WHERE name = $1', [trans.plan_name]);
                const credits = planResult.rows[0]?.minutes || (trans.plan_name === 'Premium' ? 300 : 1200);
                await query('UPDATE users SET plan = $1, credits = credits + $2 WHERE id = $3', [trans.plan_name, credits, trans.user_id]);
            } else if (trans.type === 'credits') {
                // Assuming standard credit pack for now (60 min)
                await query('UPDATE users SET credits = credits + 60 WHERE id = $1', [trans.user_id]);
            }
        } else {
            await query(
                'UPDATE transactions SET status = $1 WHERE id = $2',
                [status, id]
            );
        }

        await query('COMMIT');
        res.json({ message: `Transaction ${status}` });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete payment
app.delete('/api/admin/payments/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM transactions WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const totalUsers = await query('SELECT COUNT(*) FROM users');
        const activeRecordings = await query('SELECT COUNT(*) FROM recordings WHERE date > NOW() - INTERVAL \'24 hours\'');
        const totalMinutes = await query('SELECT SUM(used_minutes) FROM users');
        const pendingPayments = await query('SELECT COUNT(*) FROM transactions WHERE status = \'pending\'');

        res.json({
            users: parseInt(totalUsers.rows[0].count),
            activeRecordings24h: parseInt(activeRecordings.rows[0].count),
            totalMinutesUsed: parseInt(totalMinutes.rows[0].sum || '0'),
            pendingPayments: parseInt(pendingPayments.rows[0].count)
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await query('SELECT id, name, email, plan, credits, used_minutes as "usedMinutes", role, created_at as "createdAt" FROM users ORDER BY created_at DESC');
        res.json({ users: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/config/db', authenticateToken, requireAdmin, async (req, res) => {
    // For security, we don't return the real password, just placeholders or public info
    res.json({
        config: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            database: process.env.DB_NAME || 'falaja',
            user: process.env.DB_USER || 'postgres'
        }
    });
});

app.post('/api/admin/config/db', authenticateToken, requireAdmin, async (req, res) => {
    const { host, port, database, user, password } = req.body;
    // In a real app, we would update .env or a config table
    // For now, we simulate success
    console.log('Simulating DB Config Update:', { host, port, database, user });
    res.json({ message: 'Configurações de banco de dados atualizadas (Simulado)' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Auth API running on port ${port}`);
    });
}

export default app;
