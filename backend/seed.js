// Script d'insertion d'exemples pour MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
}));

// Schéma vidéo
const SubtitleSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  text: String,
  language: String
});

const Video = mongoose.model('Video', new mongoose.Schema({
  title: String,
  link: String,
  originalFilename: String,
  duration: Number,
  original_subtitles: [SubtitleSchema],
  new_subtitles: [SubtitleSchema],
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'splitted', 'published'],
    default: 'uploaded'
  },
  platforms_uploaded: [{
    platform: String,
    accountId: String,
    uploadDate: Date,
    postUrl: String,
    metrics: {
      views: Number,
      likes: Number,
      comments: Number,
      shares: Number
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
}));

async function seed() {
  // Ajout uniquement des users, TikTokAccount et SnapchatAccount
  await TikTokAccount.deleteMany({});
  await SnapchatAccount.deleteMany({});
  await User.deleteMany({});

  // Création d'un compte TikTok
  await TikTokAccount.create({
    name: 'TikTok Officiel',
    username: 'tiktokpodcast',
    description: 'Podcasts courts sur TikTok',
    language: 'fr',
    accountId: 'tiktok12345',
    accessToken: 'FAKE_TOKEN_TIKTOK',
    refreshToken: 'FAKE_REFRESH_TIKTOK',
    followerCount: 5000
  });

  // Création d'un compte Snapchat
  await SnapchatAccount.create({
    name: 'Snapchat Pro',
    username: 'snap_podcast',
    description: 'Podcasts sur Snapchat',
    language: 'fr',
    clientId: 'snapclientid',
    clientSecret: 'snapsecret',
    refreshToken: 'FAKE_REFRESH_SNAPCHAT'
  });

  // Création d'un utilisateur admin
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password: hash });
  console.log('Utilisateur admin créé (admin/admin123)');

  // Création d'utilisateurs supplémentaires
  const users = [
    { username: 'nouvelutilisateur', password: 'motdepasse' },
    { username: 'alice', password: 'alice123' },
    { username: 'bob', password: 'bob123' },
    { username: 'mehdi', password: 'mehdi123' }
  ];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ username: u.username, password: hash });
    console.log(`Utilisateur ${u.username} créé (${u.password})`);
  }

  console.log('Ajout TikTok, Snapchat et users terminé !');
  process.exit();
}

seed();
