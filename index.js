require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json()); 
app.use(cors()); 

//skapar anslutning till databasen med värden från .env
const db = mysql.createConnection(process.env.MYSQL_URL);

//försöker ansluta till databasen och loggar resultat
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

//hämtar alla arbetserfarenhter 
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

//lägg till en ny arbetserfarenhet 
app.post('/api/workexperience', (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    //enkel validering, inga tomma fält tillåts
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

//uppdatera en befintlig arbetserfarenhet
app.put('/api/workexperience/:id', (req, res) => {
    console.log('PUT /api/workexperience anropad');

    const { id } = req.params;
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    //validering, alla fält krävs
    if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        return res.status(400).json({ error: 'alla fält måste fyllas i' });
    }

    const sql = `
        UPDATE workexperience 
        SET companyname = ?, jobtitle = ?, location = ?, startdate = ?, enddate = ?, description = ? 
        WHERE id = ?
    `;
    const values = [companyname, jobtitle, location, startdate, enddate, description, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('fel vid update:', err);
            res.status(500).json({ error: 'kunde inte uppdatera erfarenhet' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'ingen post med angivet ID' });
        } else {
            res.status(200).json({ message: 'erfarenhet uppdaterad' });
        }
    });
});

//ta bort en arbetserfarenhet
app.delete('/api/workexperience/:id', (req, res) => {
    console.log('DELETE /api/workexperience anropad');

    const { id } = req.params;

    const sql = 'DELETE FROM workexperience WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Fel vid borttagning:', err);
            res.status(500).json({ error: 'kunde inte ta bort posten' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'ingen post hittades med angivet ID' });
        } else {
            res.status(200).json({ message: 'erfarenhet borttagen' });
        }
    });
});

//om ingen route matchar returnera 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

//startar servern på port 3000
app.listen(port, () => {
    console.log(`servern kör på http://localhost:${port}`);
});