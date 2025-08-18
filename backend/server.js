const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();

// Ensure uploads folder is available
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  dest: uploadsDir
});

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const inputPath = req.file.path;
    const outputPath = path.join(uploadsDir, 'output.pdf');
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    let textContent = '';

    if (fileExt === '.docx') {
      const result = await mammoth.extractRawText({ path: inputPath });
      textContent = result.value || '';
    } else if (fileExt === '.txt') {
      textContent = fs.readFileSync(inputPath, 'utf-8');
    } else {
      return res.status(400).send('Unsupported file type. Upload .docx or .txt');
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);
    doc.fontSize(12).text(textContent, { align: 'left' });
    doc.end();

    writeStream.on('finish', () => {
      res.download(outputPath, 'converted.pdf', () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing file');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
