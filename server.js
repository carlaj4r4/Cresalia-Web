const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Manejar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index-cresalia.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <head>
                            <title>404 - Archivo no encontrado</title>
                            <style>
                                body { 
                                    font-family: Arial, sans-serif; 
                                    text-align: center; 
                                    padding: 50px; 
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                }
                                .container {
                                    background: rgba(255,255,255,0.1);
                                    padding: 30px;
                                    border-radius: 15px;
                                    backdrop-filter: blur(10px);
                                }
                                h1 { font-size: 3rem; margin-bottom: 20px; }
                                p { font-size: 1.2rem; margin-bottom: 30px; }
                                a { 
                                    color: #fff; 
                                    text-decoration: none; 
                                    background: rgba(255,255,255,0.2);
                                    padding: 10px 20px;
                                    border-radius: 5px;
                                    transition: all 0.3s ease;
                                }
                                a:hover { background: rgba(255,255,255,0.3); }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>🚫 404</h1>
                                <p>Archivo no encontrado: ${req.url}</p>
                                <a href="/">Volver al inicio</a>
                            </div>
                        </body>
                    </html>
                `);
            } else {
                // Error del servidor
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`);
            }
        } else {
            // Archivo encontrado
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor HTTP iniciado en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${__dirname}`);
    console.log(`🌐 Abre tu navegador en: http://localhost:${PORT}`);
    console.log(`📱 Para acceder desde otros dispositivos: http://[tu-ip]:${PORT}`);
    console.log(`⏹️  Para detener el servidor: Ctrl+C`);
});

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo servidor...');
    server.close(() => {
        console.log('✅ Servidor detenido');
        process.exit(0);
    });
});




