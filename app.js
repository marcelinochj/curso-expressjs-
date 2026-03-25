const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
         <h1>Hola Mundo test V7</h1>
         <p>Esto es un prueba ${PORT}</p>
    `);
});

app.listen(PORT, () => {
    console.log(`servidor: http://localhost:${PORT}`);
});

