const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to tourism');
})

app.listen(port, () => {
    console.log('Server is running on port', port);
})