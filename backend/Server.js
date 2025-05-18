const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads folder if not exist
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadFolder),
  filename: (_, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utility to delete a file safely
const cleanup = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error('Cleanup error:', err);
  });
};

// Run Java code: compile and execute
const runJava = (filePath, input, res) => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath, '.java');

  const javac = spawn('javac', [filePath]);

  javac.on('exit', (code) => {
    if (code !== 0) {
      cleanup(filePath);
      return res.status(500).json({ error: 'Java compilation failed' });
    }

    const java = spawn('java', ['-cp', dir, fileName]);
    let output = '';
    let error = '';

    java.stdin.write(input);
    java.stdin.end();

    java.stdout.on('data', (data) => (output += data.toString()));
    java.stderr.on('data', (data) => (error += data.toString()));

    java.on('exit', () => {
      cleanup(filePath);
      fs.unlink(path.join(dir, `${fileName}.class`), () => {});
      if (error) return res.status(500).json({ error });
      res.json({ output: output.trim() });
    });
  });

  javac.stderr.on('data', (data) => {
    cleanup(filePath);
    res.status(500).json({ error: data.toString() });
  });
};

// Run Python code
const runPython = (filePath, input, res) => {
  const python = spawn('python', [filePath]);
  let output = '';
  let error = '';

  python.stdin.write(input);
  python.stdin.end();

  python.stdout.on('data', (data) => (output += data.toString()));
  python.stderr.on('data', (data) => (error += data.toString()));

  python.on('exit', () => {
    cleanup(filePath);
    if (error) return res.status(500).json({ error });
    res.json({ output: output.trim() });
  });
};

// Routes for running Java and Python code
app.post('/run-java', upload.single('codeFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = req.file.path;
  const userInput = req.body.input || '';
  runJava(filePath, userInput, res);
});

app.post('/run-python', upload.single('codeFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = req.file.path;
  const userInput = req.body.input || '';
  runPython(filePath, userInput, res);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
