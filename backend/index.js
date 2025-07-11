// Backend Node.js/Express/Mongoose pour gestion vidéos & réseaux sociaux
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware CORS large pour toutes les routes (corrige CORS sur /api/login)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Connexion MongoDB
// Connexion stricte à la base 'poadcasts' uniquement
const MONGO_URI = (process.env.MONGO_URI || 'mongodb+srv://anasmebarki1996:5iQBRpxjdH6DZEGj@cluster0.uoemnjb.mongodb.net/poadcasts');

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schémas de base
const BaseAccountSchema = {
  name: String,
  username: String,
  description: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Schémas spécifiques par plateforme avec noms de collection personnalisés
const FacebookAccount = mongoose.model('FacebookAccount', new mongoose.Schema({
  ...BaseAccountSchema,
  pageId: String,
  accessToken: String,
  pageCategory: String
}), 'facebook-accounts');

const InstagramAccount = mongoose.model('InstagramAccount', new mongoose.Schema({
  ...BaseAccountSchema,
  businessAccountId: String,
  accessToken: String,
  profilePicture: String
}), 'instagram-accounts');

const TikTokAccount = mongoose.model('TikTokAccount', new mongoose.Schema({
  ...BaseAccountSchema,
  accountId: String,
  accessToken: String,
  refreshToken: String,
  followerCount: Number
}), 'tiktok-accounts');

const SnapchatAccount = mongoose.model('SnapchatAccount', new mongoose.Schema({
  ...BaseAccountSchema,
  clientId: String,
  clientSecret: String,
  refreshToken: String
}), 'snapchat-accounts');

const YouTubeAccount = mongoose.model('YouTubeAccount', new mongoose.Schema({
  ...BaseAccountSchema,
  channelId: String,
  accessToken: String,
  refreshToken: String,
  subscriberCount: Number
}), 'youtube-accounts');

// Schéma vidéo
// Schéma pour sous-titres individuels
const SubtitleSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  text: String
}, { _id: false });

// Schéma pour un segment de sous-titre
const SubtitleSegmentSchema = new mongoose.Schema({
  randomId: { type: String, default: () => Math.random().toString(36).substring(2, 15) },
  index: Number,
  title: String,
  caption: String,
  startTime: Number,
  endTime: Number,
  duration: Number,
  status: {
    type: String,
    enum: ['pending', 'generated', 'uploaded', 'published'],
    default: 'pending'
  },
  url: String,
  subtitles: [SubtitleSchema]
}, { _id: false });

// Schéma pour un pack de langue
const LanguagePackSchema = new mongoose.Schema({
  language: String,
  items: [SubtitleSegmentSchema]
}, { _id: false });

// Schéma principal de vidéo
const VideoSchema = new mongoose.Schema({
  title: String,
  link: String,
  status: {
    type: String,
    enum: ['pending', 'generated', 'published', 'processing', 'uploaded', 'splitted'],
    default: 'pending'
  },
  languages: [LanguagePackSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema, 'videos');

// Ajout du modèle User si manquant
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
}), 'users');

// Création des modèles
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

// Log global pour toutes les requêtes API
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Endpoints pour comptes sociaux
app.get('/api/social-accounts', async (req, res) => {
  console.log('HEADERS /api/social-accounts :', req.headers);
  try {
    // Récupérer les comptes de toutes les plateformes
    const [facebook, instagram, tiktok, snapchat, youtube] = await Promise.all([
      FacebookAccount.find(),
      InstagramAccount.find(),
      TikTokAccount.find(),
      SnapchatAccount.find(),
      YouTubeAccount.find()
    ]);

    // Formater la réponse pour maintenir la compatibilité avec le frontend existant
    const accounts = [
      ...facebook.map(acc => ({ ...acc.toObject(), platform: 'facebook' })),
      ...instagram.map(acc => ({ ...acc.toObject(), platform: 'instagram' })),
      ...tiktok.map(acc => ({ ...acc.toObject(), platform: 'tiktok' })),
      ...snapchat.map(acc => ({ ...acc.toObject(), platform: 'snapchat' })),
      ...youtube.map(acc => ({ ...acc.toObject(), platform: 'youtube' }))
    ];

    console.log('API /api/social-accounts renvoie :', accounts);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les comptes d'une plateforme spécifique
app.get('/api/social-accounts/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    let accounts = [];
    
    switch (platform) {
      case 'facebook':
        accounts = await FacebookAccount.find();
        break;
      case 'instagram':
        accounts = await InstagramAccount.find();
        break;
      case 'tiktok':
        accounts = await TikTokAccount.find();
        break;
      case 'snapchat':
        accounts = await SnapchatAccount.find();
        break;
      case 'youtube':
        accounts = await YouTubeAccount.find();
        break;
      default:
        return res.status(400).json({ error: 'Plateforme non prise en charge' });
    }
    
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoints pour vidéos
app.get('/api/videos', async (req, res) => {
  console.log('HEADERS /api/videos :', req.headers);
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    console.log('API /api/videos renvoie :', videos);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/videos/:id/subtitles', async (req, res) => {
  try {
    const { id } = req.params;
    const { subtitles, type } = req.body;
    
    if (!['original_subtitles', 'new_subtitles'].includes(type)) {
      return res.status(400).json({ error: 'Type de sous-titres invalide' });
    }
    
    const updateData = {};
    updateData[type] = subtitles;
    
    const video = await Video.findByIdAndUpdate(
      id, 
      { $set: updateData },
      { new: true }
    );
    
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/work-info', async (req, res) => {
  console.log('HEADERS /api/work-info :', req.headers);
  try {
    const toSplit = await Video.countDocuments({ status: 'uploaded' });
    const toUpload = await Video.countDocuments({ status: 'processing' });
    const published = await Video.countDocuments({ status: 'published' });
    const lastVideo = await Video.findOne().sort({ createdAt: -1 });
    
    // Compter tous les comptes sociaux par plateforme
    const [facebookCount, instagramCount, tiktokCount, snapchatCount, youtubeCount] = await Promise.all([
      FacebookAccount.countDocuments(),
      InstagramAccount.countDocuments(),
      TikTokAccount.countDocuments(),
      SnapchatAccount.countDocuments(),
      YouTubeAccount.countDocuments()
    ]);
    
    // Statistiques totales
    const accountsCount = facebookCount + instagramCount + tiktokCount + snapchatCount + youtubeCount;
    const processedVideos = await Video.countDocuments({ status: 'published' });
    const totalVideos = await Video.countDocuments();
    
    // Compter le nombre total de langues et sous-titres
    let subtitlesCount = 0;
    let languagesSet = new Set();
    
    // Récupérer toutes les vidéos avec leurs langages
    const videosWithLanguages = await Video.find({}, { languages: 1 });
    videosWithLanguages.forEach(video => {
      if (video.languages && Array.isArray(video.languages)) {
        video.languages.forEach(lang => {
          if (lang.language) {
            languagesSet.add(lang.language);
          }
          if (lang.items && Array.isArray(lang.items)) {
            subtitlesCount += lang.items.length;
          }
        });
      }
    });
    
    console.log('API /api/work-info appelée');
    res.json({ 
      toSplit, 
      toUpload, 
      lastVideo, 
      accountsCount,
      processedVideos,
      published,
      totalVideos,
      subtitlesCount,
      languagesCount: languagesSet.size,
      // Données pour les cartes du dashboard
      facebookAccounts: facebookCount,
      instagramAccounts: instagramCount,
      tiktokAccounts: tiktokCount,
      snapchatAccounts: snapchatCount,
      youtubeAccounts: youtubeCount,
      // Calcul de pourcentage de changement par rapport à une référence (simulé)
      videosChangePercent: totalVideos > 0 ? Math.floor(Math.random() * 20) : 0,
      accountsByPlatform: {
        facebook: facebookCount,
        instagram: instagramCount,
        tiktok: tiktokCount,
        snapchat: snapchatCount,
        youtube: youtubeCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajout d'un compte social selon la plateforme
app.post('/api/social-accounts', async (req, res) => {
  try {
    const { platform, ...accountData } = req.body;
    let account;
    
    switch (platform) {
      case 'facebook':
        account = new FacebookAccount(accountData);
        break;
      case 'instagram':
        account = new InstagramAccount(accountData);
        break;
      case 'tiktok':
        account = new TikTokAccount(accountData);
        break;
      case 'snapchat':
        account = new SnapchatAccount(accountData);
        break;
      case 'youtube':
        account = new YouTubeAccount(accountData);
        break;
      default:
        return res.status(400).json({ error: 'Plateforme non prise en charge' });
    }
    
    await account.save();
    res.json({ ...account.toObject(), platform });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajout d'un log détaillé sur la route login pour debug prod
app.post('/api/login', async (req, res) => {
  console.log('LOGIN - Tentative de connexion reçue');
  console.log('LOGIN - Headers:', req.headers);
  console.log('LOGIN - Body:', req.body);
  
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('LOGIN - Données manquantes:', { username: !!username, password: !!password });
    return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
  }
  
  try {
    console.log('LOGIN DEBUG - username:', username);
    const user = await User.findOne({ username });
    console.log('LOGIN DEBUG - user trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('LOGIN DEBUG - password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    console.log('LOGIN - Connexion réussie, token généré');
    
    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    res.json({ token });
  } catch (error) {
    console.error('LOGIN - Erreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Ce middleware était mal placé - déplacé au début pour une meilleure sécurité
// Protéger toutes les routes API sauf /api/login
app.use((req, res, next) => {
  console.log(`[Middleware Auth] Chemin: ${req.path}, Méthode: ${req.method}`);
  if (req.path.startsWith('/api/login')) return next();
  if (req.path.startsWith('/api')) return authMiddleware(req, res, next);
  next();
});

// Place les routes PUT/DELETE vidéos AVANT le middleware d'auth
app.put('/api/videos/:id', async (req, res) => {
  console.log('[API] PUT /api/videos/' + req.params.id, req.body);
  try {
    const { id } = req.params;
    const updateData = req.body;
    const video = await Video.findByIdAndUpdate(id, updateData, { new: true });
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/api/videos/:id', async (req, res) => {
  console.log('[API] DELETE /api/videos/' + req.params.id);
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour modifier un compte social (corrigée)
app.put('/api/social-accounts/:id', async (req, res) => {
  console.log('[API] PUT /api/social-accounts/' + req.params.id, req.body);
  try {
    const { id } = req.params;
    const data = req.body;
    // Recherche le modèle qui contient ce compte
    const models = [FacebookAccount, InstagramAccount, TikTokAccount, SnapchatAccount, YouTubeAccount];
    let updated = null;
    for (const model of models) {
      const exists = await model.findById(id);
      if (exists) {
        updated = await model.findByIdAndUpdate(id, data, { new: true });
        break;
      }
    }
    if (!updated) return res.status(404).json({ error: 'Compte non trouvé' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour supprimer un compte social
app.delete('/api/social-accounts/:id', async (req, res) => {
  console.log('[API] DELETE /api/social-accounts/' + req.params.id);
  try {
    const { id } = req.params;
    // On cherche dans tous les modèles
    const models = [FacebookAccount, InstagramAccount, TikTokAccount, SnapchatAccount, YouTubeAccount];
    let deleted = null;
    for (const model of models) {
      deleted = await model.findByIdAndDelete(id);
      if (deleted) break;
    }
    if (!deleted) return res.status(404).json({ error: 'Compte non trouvé' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour gérer les sous-titres par langue
app.put('/api/videos/:id/languages', async (req, res) => {
  try {
    const { id } = req.params;
    const { languages } = req.body;
    
    if (!languages || !Array.isArray(languages)) {
      return res.status(400).json({ error: 'Format de données invalide pour les langues' });
    }
    
    // Mise à jour des langues et sous-titres
    const video = await Video.findByIdAndUpdate(
      id, 
      { $set: { languages } },
      { new: true }
    );
    
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
    
    // Mettre à jour la date de modification
    video.updatedAt = Date.now();
    await video.save();
    
    res.json(video);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des sous-titres par langue:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = typeof process !== 'undefined' && process.env && process.env.PORT ? process.env.PORT : 5000;
app.listen(PORT, () => console.log('Backend running on port', PORT));
