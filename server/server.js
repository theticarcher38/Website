const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8000;
const ip = "127.0.0.1";
const reqLog = "logs/server.log"
var filePath;
var d = Date(Date.now()).toString();


http.createServer(function (request, response) {
    filePath = '.' + request.url;
    if (filePath == './')
        filePath = './pages/home/home.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.ico':
            contentType = 'image/ico';
            break;
        case '.webmanifest':
            contentType = 'application/webmanifest';
            break;
        case '.log':
            contentType = 'text/log';
            break;
    }
    console.log(`[${d}] requesting ${filePath}`);
    fs.appendFile(reqLog, `[${d}] requesting ${filePath}\n`, function (error) {
        if (error) throw error;
    });
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('pages/error/404.html', function (error, content) {
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.end(content, 'utf-8');
                    console.log(`[${d}] The page ${filePath} requested could not be located`)
                    fs.appendFile(reqLog, `[${d}] The page ${filePath} requested could not be located.\n`, function (error) {
                        if (error) throw error;
                    })
                });
            } else {
                response.writeHead(500);
                response.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                fs.appendFile(reqLog, `[${d}] Sorry, check with the site admin for error: ${error.code} ..\n`, function (error) {
                    if (error) throw error;
                })
                response.end();
            }
        } else {
            response.writeHead(200, {
                'Content-Type': contentType
            });
            response.end(content, 'utf-8');
        }
    });

}).listen(port, ip);
console.log(`[${d}] Server running at http://${ip}:${port}`);
fs.appendFile(reqLog, `\n[${d}] Server running at http://${ip}:${port}\n`, function (error) {
    if (error) throw error;
})