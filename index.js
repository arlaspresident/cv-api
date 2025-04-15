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


app.listen(port, () => {
    console.log(`servern kör på http://localhost:${port}`);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
