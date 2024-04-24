const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Multer configuration
const upload = multer({ dest: 'uploads/' });

const server = http.createServer((req, res) => {
    if (req.url === '/upload' && req.method === 'POST') {
        // Multer middleware to handle file upload
        upload.single('file')(req, res, err => {
            if (err) {
                console.error('Error uploading file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error uploading file.');
                return;
            }

            // Read the uploaded PDF file
            const filePath = req.file.path;
            const fileContent = fs.readFileSync(filePath);

            // Parse PDF content
            pdfParse(fileContent).then(data => {
                console.log('PDF parsed successfully:');
                console.log(data.text);
                
                // Respond with parsed PDF content
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data.text);
            }).catch(error => {
                console.error('Error parsing PDF:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error parsing PDF.');
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
