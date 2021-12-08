const express = require('express');
const app = express();
const path = require('path');

app.use( '/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/index.html'))
});


app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));