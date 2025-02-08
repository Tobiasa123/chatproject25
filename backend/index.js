const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors')


const app = express();
app.use(express.json());

app.use(cors())

mongoose.connect(process.env.MONGO_URL)

const userRoutes = require('./routes/userRoutes')

app.use(userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`server running at http://${process.env.URL}:${process.env.PORT}`)
})