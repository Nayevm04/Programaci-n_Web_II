const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const routes = require('./routes/routes');

app.use(express.json());
app.use('/api', routes);

mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.log(error);
});

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
});