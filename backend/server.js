const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    let text = req.body.text || "";

    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
      fs.unlinkSync(req.file.path);
    }

    if (!text.trim()) {
      return res.status(400).send("No text provided");
    }

    const pdfPath = path.join(__dirname, "output.pdf");
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(14).text(text, { align: "left" });
    doc.end();

    stream.on("finish", () => {
      res.download(pdfPath, "document.pdf", () => {
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error converting file");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
