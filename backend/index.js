// Backend Node.js/Express/Mongoose pour gestion vidéos & réseaux sociaux
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
if (!process.env.MONGO_URI) {
  throw new Error("La variable d'environnement MONGO_URI doit être définie !");
}
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schémas
const SocialAccountSchema = new mongoose.Schema({
  platform: String,
  name: String,
  username: String,
  description: String,
  language: String,
  appId: String,
  accessToken: String,
});
const VideoSchema = new mongoose.Schema({
  title: String,
  link: String,
  original_subtitles: Array,
  new_subtitles: Array,
  status: String,
  platforms_uploaded: Array,
  createdAt: { type: Date, default: Date.now },
});
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashé
});
const SocialAccount = mongoose.model('SocialAccount', SocialAccountSchema);
const Video = mongoose.model('Video', VideoSchema);
const User = mongoose.model('User', UserSchema);

const JWT_SECRET = typeof process !== 'undefined' && process.env && process.env.JWT_SECRET ? process.env.JWT_SECRET : 'changeme';

// Middleware d'authentification
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token manquant' });
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// Endpoints
app.get('/api/social-accounts', async (req, res) => {
  const accounts = await SocialAccount.find();
  res.json(accounts);
});
app.get('/api/videos', async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});
app.post('/api/videos', async (req, res) => {
  const video = new Video(req.body);
  await video.save();
  res.json(video);
});
app.get('/api/work-info', async (req, res) => {
  const toSplit = await Video.countDocuments({ status: 'splitted' });
  const toUpload = await Video.countDocuments({ status: 'uploaded' });
  const lastVideo = await Video.findOne().sort({ createdAt: -1 });
  let accountsCount = 0;
  let processedVideos = 0;
  try {
    accountsCount = await SocialAccount.countDocuments();
    processedVideos = await Video.countDocuments({ status: 'uploaded' });
  } catch {} // catch vide
  res.json({ toSplit, toUpload, lastVideo, accountsCount, processedVideos });
});
// Ajout d'un compte social
app.post('/api/social-accounts', async (req, res) => {
  const account = new SocialAccount(req.body);
  await account.save();
  res.json(account);
});

// Route de login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Utilisateur inconnu' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Protéger toutes les routes API sauf /api/login
app.use((req, res, next) => {
  if (req.path.startsWith('/api/login')) return next();
  if (req.path.startsWith('/api')) return authMiddleware(req, res, next);
  next();
});

const PORT = typeof process !== 'undefined' && process.env && process.env.PORT ? process.env.PORT : 5000;
app.listen(PORT, () => console.log('Backend running on port', PORT));
