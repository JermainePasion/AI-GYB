const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 3000;

// To allow React Native to connect
app.use(cors());
app.use(express.json());




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
