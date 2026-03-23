import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';

const PORT = 5000;
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }
}

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users: any[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function startServer() {
  await ensureDataDir();
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const users = await readUsers();
    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const newUser = { id: Date.now(), name, email, password, profile: null, testScore: null, roadmap: null, resume: null, courseProgress: {} };
    users.push(newUser);
    await writeUsers(users);
    res.json({ message: 'Registration successful', user: { id: newUser.id, name, email } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, profile: user.profile, testScore: user.testScore, roadmap: user.roadmap, resume: user.resume, courseProgress: user.courseProgress || {} } });
  });

  // User Profile
  app.post('/api/user/profile', async (req, res) => {
    const { userId, profile } = req.body;
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index].profile = profile;
    await writeUsers(users);
    res.json({ message: 'Profile updated', user: users[index] });
  });

  // Screening Test
  app.post('/api/user/test', async (req, res) => {
    const { userId, score } = req.body;
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index].testScore = score;
    await writeUsers(users);
    res.json({ message: 'Score updated', score });
  });

  // Roadmap
  app.post('/api/user/roadmap', async (req, res) => {
    const { userId, roadmap } = req.body;
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index].roadmap = roadmap;
    await writeUsers(users);
    res.json({ message: 'Roadmap saved', roadmap });
  });

  // Resume
  app.post('/api/user/resume', async (req, res) => {
    const { userId, resume } = req.body;
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index].resume = resume;
    await writeUsers(users);
    res.json({ message: 'Resume saved', resume });
  });

  // Course Progress
  app.post('/api/user/progress', async (req, res) => {
    const { userId, courseId, topicId } = req.body;
    const users = await readUsers();
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    
    if (!users[index].courseProgress) users[index].courseProgress = {};
    if (!users[index].courseProgress[courseId]) users[index].courseProgress[courseId] = [];
    
    if (!users[index].courseProgress[courseId].includes(topicId)) {
      users[index].courseProgress[courseId].push(topicId);
    }
    
    await writeUsers(users);
    res.json({ message: 'Progress updated', progress: users[index].courseProgress });
  });

  // Data Fetching
  app.get('/api/questions', async (req, res) => {
    const data = await fs.readFile(path.join(DATA_DIR, 'questions.json'), 'utf-8');
    res.json(JSON.parse(data));
  });

  app.get('/api/courses', async (req, res) => {
    const data = await fs.readFile(path.join(DATA_DIR, 'courses.json'), 'utf-8');
    res.json(JSON.parse(data));
  });

  app.get('/api/roadmap-templates', async (req, res) => {
    const data = await fs.readFile(path.join(DATA_DIR, 'roadmap_templates.json'), 'utf-8');
    res.json(JSON.parse(data));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
