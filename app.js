const bodyParser = require('body-parser');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();

// app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api', userRoutes);

app.listen(8080);