// Importing necessary modules
import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for importing files correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to handle QR code generation
app.post('/generate', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.send('Please enter a valid URL');
  }

  const qr_svg = qr.image(url, { type: 'png' });
  const outputPath = path.join(__dirname, 'public/qr_img.png');

  qr_svg.pipe(fs.createWriteStream(outputPath)).on('finish', () => {
    res.send(`<p>QR Code generated! Hold down on the image and hit "Save Image" to save it to your phone.</p><img src="/qr_img.png" alt="QR Code"/><br/><a href="/qr_img.png" download="qr_code.png">Download QR Code</a>`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
