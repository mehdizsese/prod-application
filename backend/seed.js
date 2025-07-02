// Script d'insertion d'exemples pour MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialvideo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SocialAccount = mongoose.model('SocialAccount', new mongoose.Schema({
  platform: String,
  name: String,
  username: String,
  description: String,
  language: String,
  appId: String,
  accessToken: String,
}));
const Video = mongoose.model('Video', new mongoose.Schema({
  title: String,
  link: String,
  original_subtitles: Array,
  new_subtitles: Array,
  status: String,
  platforms_uploaded: Array,
  createdAt: { type: Date, default: Date.now },
}));
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

async function seed() {
  await SocialAccount.deleteMany({});
  await Video.deleteMany({});
  await SocialAccount.insertMany([
    {
      platform: 'facebook',
      name: 'Ma page Facebook',
      username: 'podcastyyyyy',
      description: 'Podcasts with english subtitle',
      language: 'en',
      appId: '17841475744579093',
      accessToken: 'FAKE_TOKEN_FACEBOOK'
    },
    {
      platform: 'instagram',
      name: 'Mon Insta',
      username: 'instapodcast',
      description: 'Podcasts Insta',
      language: 'fr',
      appId: '17841475744579094',
      accessToken: 'FAKE_TOKEN_INSTAGRAM'
    }
  ]);
  await Video.insertMany([
    {
      title: '1st video',
      link: 'https://youtube.com/1',
      original_subtitles: [],
      new_subtitles: [],
      status: 'splitted',
      platforms_uploaded: ['facebook'],
      createdAt: new Date()
    },
    {
      title: '2nd video',
      link: 'https://youtube.com/2',
      original_subtitles: [],
      new_subtitles: [],
      status: 'uploaded',
      platforms_uploaded: ['instagram'],
      createdAt: new Date()
    }
  ]);
  // Création d'un utilisateur admin
  await User.deleteMany({ username: 'admin' });
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password: hash });
  console.log('Utilisateur admin créé (admin/admin123)');
  console.log('Exemples insérés !');
  process.exit();
}
seed();
