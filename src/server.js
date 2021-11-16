const { readFileSync, writeFileSync, readFile} = require('fs');

const express = require('express');
const app = express();
const path = require('path');

app.use('/background', express.static('./studio_small_08_4k.hdr'));
app.use('/duck', express.static('./duck_with_sunglasses'));


app.get('/', (req, res) => {
    res.send(readFileSync('./index.html', 'utf-8'))
});

app.listen(5000, () => console.log('Listening on port 5000'));