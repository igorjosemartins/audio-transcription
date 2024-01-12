require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./src/routes/routes');

const app = express();
const port = process.env.PORT || 3000;

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
};

app.listen()

app.listen(port, () => {
    connectDataBase().catch((error) => {
        console.log(`Erro ao conectar ao MongoDB: ${error}`);
    })

    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', router);

    console.log(`Servidor ouvindo na porta: ${port}`);
})