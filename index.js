const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const filePath = path.join(__dirname, pathname);

    if (req.method === 'GET') {
        // Read a file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('File not found');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(data);
            }
        });
    } else if (req.method === 'POST') {
        // Create a file
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.writeFile(filePath, body, err => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Failed to create file');
                } else {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('File created');
                }
            });
        });
    } else if (req.method === 'DELETE') {
        // Delete a file
        fs.unlink(filePath, err => {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('File not found');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('File deleted');
            }
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Method not allowed');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
