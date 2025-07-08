const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Program = require('./models/Program');

const app = express();
const PORT = process.env.PORT || 5001;

// === MongoDB Connection ===
mongoose.connect('mongodb+srv://mohan:t7XIvuvaHF7dKd06@compiler.fe4dfib.mongodb.net/compiler?retryWrites=true&w=majority&appName=Compiler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// === Middleware ===
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// === File Upload Setup ===
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadFolder),
  filename: (_, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

const cleanup = (filePath) => fs.unlink(filePath, () => {});

// === Java Execution ===
const runJava = (filePath, input, res) => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath, '.java');
  const javac = spawn('javac', [filePath]);

  javac.stderr.on('data', (data) => {
    cleanup(filePath);
    return res.status(500).json({ error: data.toString() });
  });

  javac.on('exit', (code) => {
    if (code !== 0) return;

    const java = spawn('java', ['-cp', dir, fileName]);
    let output = '', error = '';

    java.stdin.write(input);
    java.stdin.end();

    java.stdout.on('data', (data) => output += data.toString());
    java.stderr.on('data', (data) => error += data.toString());

    java.on('exit', () => {
      cleanup(filePath);
      fs.unlink(path.join(dir, `${fileName}.class`), () => {});
      if (error) return res.status(500).json({ error });
      res.json({ output: output.trim() });
    });
  });
};

// === C Execution ===
const runC = (filePath, input, res) => {
  const exePath = filePath.replace('.c', '.exe');
  const compile = spawn('gcc', [filePath, '-o', exePath]);

  let compileError = '';
  compile.stderr.on('data', (data) => compileError += data.toString());

  compile.on('exit', (code) => {
    if (code !== 0 || compileError) {
      cleanup(filePath);
      return res.status(500).json({ error: compileError });
    }

    const run = spawn(exePath);
    let output = '', error = '';

    run.stdin.write(input);
    run.stdin.end();

    run.stdout.on('data', (data) => output += data.toString());
    run.stderr.on('data', (data) => error += data.toString());

    run.on('exit', () => {
      cleanup(filePath);
      cleanup(exePath);
      if (error) return res.status(500).json({ error });
      res.json({ output: output.trim() });
    });
  });
};

// === C++ Execution ===
const runCpp = (filePath, input, res) => {
  const exePath = filePath.replace('.cpp', '.exe');
  const compile = spawn('g++', [filePath, '-o', exePath]);

  let compileError = '';
  compile.stderr.on('data', (data) => compileError += data.toString());

  compile.on('exit', (code) => {
    if (code !== 0 || compileError) {
      cleanup(filePath);
      return res.status(500).json({ error: compileError });
    }

    const run = spawn(exePath);
    let output = '', error = '';

    run.stdin.write(input);
    run.stdin.end();

    run.stdout.on('data', (data) => output += data.toString());
    run.stderr.on('data', (data) => error += data.toString());

    run.on('exit', () => {
      cleanup(filePath);
      cleanup(exePath);
      if (error) return res.status(500).json({ error });
      res.json({ output: output.trim() });
    });
  });
};

// === Code Execution Routes ===
app.post('/run-java', upload.single('codeFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  runJava(req.file.path, req.body.input || '', res);
});

app.post('/run-c', upload.single('codeFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  runC(req.file.path, req.body.input || '', res);
});

app.post('/run-cpp', upload.single('codeFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  runCpp(req.file.path, req.body.input || '', res);
});

// === User Authentication ===
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// === Admin: Program CRUD ===
app.get('/programs', async (_, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch {
    res.status(500).json({ error: 'Error loading programs' });
  }
});

app.post('/programs', async (req, res) => {
  try {
    const newProgram = new Program(req.body);
    await newProgram.save();
    res.json({ message: 'Program added' });
  } catch {
    res.status(500).json({ error: 'Error adding program' });
  }
});

app.put('/programs/:id', async (req, res) => {
  try {
    await Program.findOneAndUpdate({ id: req.params.id }, req.body);
    res.json({ message: 'Program updated' });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/programs/:id', async (req, res) => {
  try {
    await Program.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// === User Program Completion ===
app.get('/user/:username/completed', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ completedPrograms: user.completedPrograms || [] });
  } catch {
    res.status(500).json({ error: 'Failed to fetch completed programs' });
  }
});

app.post('/user/:username/complete', async (req, res) => {
  const { programId } = req.body;
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.completedPrograms.includes(programId)) {
      user.completedPrograms.push(programId);
      await user.save();
    }

    res.json({ message: 'Program marked as completed' });
  } catch {
    res.status(500).json({ error: 'Failed to update program completion' });
  }
});

// === Start Server ===
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
