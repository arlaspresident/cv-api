require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json()); 
app.use(cors()); 

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('databasanslutning failade:', err);
    } else {
        console.log('ansluten till databasen');
    }
});

app.get('/', (req, res) => {
    res.send('välkommen till mitt cv api');
});

app.get('/api/workexperience', (req, res) => {
    console.log('GET /api/workexperience anropad');
    const sql = 'SELECT * FROM workexperience';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('fel vid hämtning:', err);
            res.status(500).json({ error: 'något gick fel vid hämtning av data' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/workexperience', (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    const sql = `
        INSERT INTO workexperience 
        (companyname, jobtitle, location, startdate, enddate, description) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [companyname, jobtitle, location, startdate, enddate, description];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('fel vid insert:', err);
            res.status(500).json({ error: 'kunde ej spara till databasen' });
        } else {
            res.status(201).json({ message: 'erfarenhet tillagd', id: result.insertId });
        }
    });
});


app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`servern kör på http://localhost:${port}`);
});