const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'skillconnect_db'
});

db.connect(err => {
    if (err) {
        console.error("Database error: " + err.message);
    } else {
        console.log("Backend Connected to MySQL.");
    }
});

// --- 2. AUTHENTICATION ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, data) => {
        if (data && data.length > 0) res.json({ success: true, user: data[0] });
        else res.json({ success: false });
    });
});

// --- 3. PROFILE UPDATE SYSTEM ---
app.put('/update-profile/:userId', (req, res) => {
    const userId = req.params.userId;
    const { department, bio, skills, password } = req.body;
    let sql = "UPDATE users SET department = ?, bio = ?, skills = ? WHERE id = ?";
    let params = [department, bio, skills, userId];

    if (password && password.trim() !== "") {
        sql = "UPDATE users SET department = ?, bio = ?, skills = ?, password = ? WHERE id = ?";
        params = [department, bio, skills, password, userId];
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// --- 4. SESSION MANAGEMENT (With Auto-Cleanup & Priority Sorting) ---
// Fetches sessions: ACTIVE first, then 10 most recent ENDED
app.get('/alumni-sessions/:alumniId', (req, res) => {
    const alumniId = req.params.alumniId;

    // Cleanup: Delete 'ended' sessions older than the 10 most recent
    const cleanupSql = `
        DELETE FROM mentorship_sessions 
        WHERE id IN (
            SELECT id FROM (
                SELECT id FROM mentorship_sessions 
                WHERE alumni_id = ? AND status = 'ended' 
                ORDER BY session_date DESC 
                LIMIT 18446744073709551615 OFFSET 10
            ) as oldest_sessions
        )`;

    const fetchSql = `
        SELECT s.*, u.name as student_name, u.email as student_email 
        FROM mentorship_sessions s 
        JOIN users u ON s.student_id = u.id 
        WHERE s.alumni_id = ? 
        ORDER BY FIELD(s.status, 'active', 'ended'), s.session_date DESC`;

    db.query(cleanupSql, [alumniId], (err) => {
        if (err) console.error("Cleanup error:", err);
        db.query(fetchSql, [alumniId], (err, data) => {
            if (err) return res.status(500).json(err);
            res.json(data || []);
        });
    });
});

app.post('/book-session', (req, res) => {
    const { student_id, alumni_id, session_date, booking_details } = req.body;
    db.query("INSERT INTO mentorship_sessions (student_id, alumni_id, session_date, booking_details, status) VALUES (?, ?, ?, ?, 'active')", 
    [student_id, alumni_id, session_date, booking_details], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.put('/end-session/:sessionId', (req, res) => {
    db.query("UPDATE mentorship_sessions SET status = 'ended' WHERE id = ?", [req.params.sessionId], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// --- 5. CHAT SYSTEM (Sorted by Recent Activity) ---
app.post('/send-message', (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;
    db.query("INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)", 
    [sender_id, receiver_id, message_text], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.get('/get-messages/:userId/:partnerId', (req, res) => {
    db.query("SELECT * FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at ASC", 
    [req.params.userId, req.params.partnerId, req.params.partnerId, req.params.userId], (err, data) => res.json(data || []));
});

app.get('/chat-list/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT DISTINCT u.id, u.name, 
        (SELECT message_text FROM messages WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id) ORDER BY created_at DESC LIMIT 1) as last_msg,
        (SELECT MAX(created_at) FROM messages WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)) as last_activity
        FROM users u 
        JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id) 
        WHERE (m.sender_id = ? OR m.receiver_id = ?) 
        AND u.id != ? 
        ORDER BY last_activity DESC`; 
    db.query(sql, [userId, userId, userId, userId, userId, userId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data || []);
    });
});

// --- 6. ALUMNI LIST (For Students) ---
app.get('/alumni', (req, res) => {
    db.query("SELECT * FROM users WHERE role = 'alumni'", (err, data) => res.json(data || []));
});

// --- 7. FEEDBACK SYSTEM ---
app.post('/submit-feedback', (req, res) => {
    const { student_id, alumni_id, rating, comment } = req.body;
    db.query("INSERT INTO feedback (student_id, alumni_id, rating, comment) VALUES (?, ?, ?, ?)", 
    [student_id, alumni_id, rating, comment], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.get('/get-feedback/:alumniId', (req, res) => {
    db.query("SELECT f.*, u.name as student_name FROM feedback f JOIN users u ON f.student_id = u.id WHERE f.alumni_id = ?", [req.params.alumniId], (err, data) => res.json(data || []));
});

// START SERVER
app.listen(5000, () => {
    console.log("Server running on Port 5000");
});