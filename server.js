const express = require('express');
const app = express();
const path = require('path');

app.use( '/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on ip ${getIPAddress()}, port ${port}`));

function getIPAddress() {
    if (port === 3000) {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
        var iface = interfaces[devName];
    
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
            return alias.address;
        }
        }
    }
    else {
        return "Not supported"
    }
    return '0.0.0.0';
  }