const express = require('express');
const router = require('./rotas/rotas');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});