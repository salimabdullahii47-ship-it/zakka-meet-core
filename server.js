const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;


const server = http.createServer((req, res) => {
    // SECURITY HEADER ASSIGNMENTS: Protects users from cross-site injection attacks
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    let requestUrl = req.url.split('?');
    let filePath = '.' + requestUrl[0]; // Strips any version queries smoothly
    
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>Error 404: ZAKKA MEET File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Security Error: ${error.code}\n`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log("=================================================");
    console.log("🚀 SECURE NETWORK PROTCOLS INITIALIZED SUCCESSFULLY");
    console.log(`👉 System Creator: Salim Abdullahi Zakka`);
    console.log(`👉 Running locally: http://localhost:${PORT}`);
    console.log("=================================================");
});
