const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// ─────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────

app.use(express.json());

app.use(cors({
    origin: "*", // 🔒 En producción puedes poner tu URL de Amplify
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ─────────────────────────────────────────────
// BASE DE DATOS
// ─────────────────────────────────────────────

const db = new sqlite3.Database('./BARBERIA.DB', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
    } else {
        db.run('PRAGMA busy_timeout = 10000');
        db.run('PRAGMA journal_mode = WAL');
        console.log("Conectado a BARBERIA.DB");
    }
});

// ─────────────────────────────────────────────
// RUTA RAÍZ (VERIFICACIÓN)
// ─────────────────────────────────────────────

app.get('/', (req, res) => {
    res.json({ mensaje: "Backend Barbería funcionando correctamente 💈" });
});

// ─────────────────────────────────────────────
// BARBEROS
// ─────────────────────────────────────────────

app.get('/api/barberos', (req, res) => {
    db.all('SELECT * FROM barberos', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/barberos', (req, res) => {
    const { nombre, especialidad } = req.body;

    if (!nombre || !especialidad)
        return res.status(400).json({ error: "Datos incompletos" });

    db.run(
        'INSERT INTO barberos (nombre, especialidad) VALUES (?, ?)',
        [nombre, especialidad],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, nombre, especialidad });
        }
    );
});

app.delete('/api/barberos/:id', (req, res) => {
    db.run('DELETE FROM barberos WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Barbero eliminado" });
    });
});

// ─────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────

app.get('/api/servicios', (req, res) => {
    db.all("SELECT * FROM servicios", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/servicios', (req, res) => {
    const { nombre, precio } = req.body;

    if (!nombre || !precio)
        return res.status(400).json({ error: "Datos incompletos" });

    db.run(
        'INSERT INTO servicios (nombre, precio) VALUES (?, ?)',
        [nombre, precio],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, nombre, precio });
        }
    );
});

app.put('/api/servicios/:id', (req, res) => {
    const { nombre, precio } = req.body;

    db.run(
        'UPDATE servicios SET nombre = ?, precio = ? WHERE id = ?',
        [nombre, precio, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Servicio actualizado", cambios: this.changes });
        }
    );
});

app.delete('/api/servicios/:id', (req, res) => {
    db.run('DELETE FROM servicios WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Servicio eliminado" });
    });
});

// ─────────────────────────────────────────────
// CITAS
// ─────────────────────────────────────────────

app.get('/api/citas', (req, res) => {
    const sql = `
        SELECT
            citas.id,
            citas.cliente,
            citas.fecha,
            citas.hora,
            COALESCE(barberos.nombre,  'Barbero eliminado')  AS barbero,
            COALESCE(servicios.nombre, 'Servicio eliminado') AS servicio
        FROM citas
        LEFT JOIN barberos  ON citas.id_barbero  = barberos.id
        LEFT JOIN servicios ON citas.id_servicio = servicios.id
        ORDER BY citas.fecha, citas.hora
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/citas', (req, res) => {
    const { id_barbero, id_servicio, cliente, fecha, hora } = req.body;

    if (!cliente || !fecha || !hora)
        return res.status(400).json({ error: "Datos incompletos" });

    db.run(
        'INSERT INTO citas (cliente, id_barbero, id_servicio, fecha, hora) VALUES (?, ?, ?, ?, ?)',
        [cliente, id_barbero, id_servicio, fecha, hora],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, mensaje: "Cita registrada" });
        }
    );
});

app.delete('/api/citas/:id', (req, res) => {
    db.run('DELETE FROM citas WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Cita cancelada" });
    });
});

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password)
        return res.status(400).json({ error: "Datos incompletos" });

    db.get(
        'SELECT * FROM usuarios WHERE usuario = ? AND password = ?',
        [usuario, password],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

            res.json({
                mensaje: 'Login exitoso',
                usuario: row.usuario
            });
        }
    );
});

// ─────────────────────────────────────────────
// PING (ANTI-COLD START)
// ─────────────────────────────────────────────

app.get('/ping', (req, res) => {
    res.json({ ok: true });
});

// ─────────────────────────────────────────────
// PUERTO DINÁMICO (IMPORTANTE PARA RENDER)
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});