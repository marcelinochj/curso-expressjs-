require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
         <h1>Hola Mundo test V7</h1>
         <p>Esto es un prueba ${PORT}</p>
    `);
});



app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Mostrar información del usuario ${userId}`)
});

app.get('/search/', (req, res) => {
    const terms = req.query.termino || 'No especificado';
    const category = req.query.category || 'Todas'
    res.send({Cat: category, CurrentTerms:terms})
});

app.listen(PORT, () => {
    console.log(`servidor: http://localhost:${PORT}`);
});

