const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const runJava = (filePath, res) => {
  const fileName = path.basename(filePath, path.extname(filePath));
  const dir = path.dirname(filePath);

  exec(`javac "${filePath}"`, (compileErr, compileStdout, compileStderr) => {
    if (compileErr) {
      console.error('Java compilation error:', compileStderr);
      cleanup(filePath);
      return res.status(500).json({ error: compileStderr });
    }

    exec(`java -cp "${dir}" ${fileName}`, (runErr, runStdout, runStderr) => {
      if (runErr) {
        console.error('Java execution error:', runStderr);
        cleanup(filePath);
        return res.status(500).json({ error: runStderr });
      }
      res.json({ output: runStdout });
      cleanup(filePath);
    });
  });
};

const runPython = (filePath, res) => {
  exec(`python "${filePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Python execution error:', stderr);
      cleanup(filePath);
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
    cleanup(filePath);
  });
};

const cleanup = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    }
  });
};

app.post('/run-java', upload.single('codeFile'), (req, res) => {
  console.log('Java file upload request received:', req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }
  const filePath = req.file.path;
  runJava(filePath, res);
});

app.post('/run-python', upload.single('codeFile'), (req, res) => {
  console.log('Python file upload request received:', req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }
  const filePath = req.file.path;
  runPython(filePath, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
