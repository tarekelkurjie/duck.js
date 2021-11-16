const express = require('express');
const app = express();
const path = require('path');

app.use('/background', express.static('./studio_small_08_4k.hdr'));
app.use('/duck', express.static('./duck_with_sunglasses'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
});

app.listen(5000, () => console.log('Listening on port 5000'));