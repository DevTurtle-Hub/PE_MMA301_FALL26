const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Read .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getOrCreateUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log(`[AUTH] Signed in successfully as: ${email} (UID: ${cred.user.uid})`);
    return cred.user;
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`[AUTH] Created new user: ${email} (UID: ${cred.user.uid})`);
        return cred.user;
      } catch (createErr) {
        console.error(`[ERROR] Failed to create user ${email}:`, createErr.message);
        throw createErr;
      }
    }
    console.error(`[ERROR] Auth failed for ${email}:`, err.message);
    throw err;
  }
}

async function seedDataForAccount(email, password) {
  console.log('='.repeat(60));
  console.log(`🎬 SEEDING TEST MOVIES FOR: ${email}`);
  console.log('='.repeat(60));

  const targetUser = await getOrCreateUser(email, password);

  // 6 balanced sample movies
  const sampleMovies = [
    {
      title: 'Inception',
      director: 'Christopher Nolan',
      genre: 'Action',
      status: 'Watched',
      rating: 5,
      favorite: true,
      notes: 'A mind-bending cinematic masterpiece exploring dream infiltration and layered realities.',
    },
    {
      title: 'Dune: Part Two',
      director: 'Denis Villeneuve',
      genre: 'Action',
      status: 'Watching',
      rating: 5,
      favorite: true,
      notes: 'Incredible desert cinematography, epic scale, and masterful sound design on Arrakis.',
    },
    {
      title: 'Oppenheimer',
      director: 'Christopher Nolan',
      genre: 'Drama',
      status: 'Watched',
      rating: 5,
      favorite: false,
      notes: 'Gripping historical biography exploring the tension and moral weight of the atomic age.',
    },
    {
      title: 'The Grand Budapest Hotel',
      director: 'Wes Anderson',
      genre: 'Comedy',
      status: 'Plan to Watch',
      rating: 4,
      favorite: false,
      notes: 'Delightful visual symmetry, whimsical characters, and witty dialogue.',
    },
    {
      title: 'A Quiet Place',
      director: 'John Krasinski',
      genre: 'Horror',
      status: 'Plan to Watch',
      rating: 4,
      favorite: true,
      notes: 'Tense atmospheric horror driven by silence and sharp sound cues.',
    },
    {
      title: 'Parasite',
      director: 'Bong Joon-ho',
      genre: 'Drama',
      status: 'Watching',
      rating: 5,
      favorite: false,
      notes: 'Riveting dark comedy thriller examining class divide with astonishing twists.',
    },
  ];

  console.log(`\n[FIRESTORE] Seeding ${sampleMovies.length} movies for UID: ${targetUser.uid}...`);

  for (const m of sampleMovies) {
    const clean1 = m.title.trim();
    const clean2 = m.director.trim();
    const docId = `${targetUser.uid}_${clean1.toLowerCase()}_${clean2.toLowerCase()}`.replace(/[\/\s]/g, '_');

    const docRef = doc(db, 'movies', docId);
    await setDoc(docRef, {
      id: docId,
      userId: targetUser.uid,
      title: clean1,
      director: clean2,
      genre: m.genre,
      status: m.status,
      rating: m.rating,
      favorite: m.favorite,
      notes: m.notes,
      createdAt: serverTimestamp(),
    });

    console.log(` -> Seeded: "${m.title}" by ${m.director} [${m.genre} | ${m.status} | ★${m.rating} | Fav: ${m.favorite}]`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ TEST DATA SEEDING COMPLETE FOR ${email}!`);
  console.log('='.repeat(60));
}

const targetEmail = process.argv[2] || 'vanquy0604q@gmail.com';
const targetPass = process.argv[3] || 'Quy123456@';

seedDataForAccount(targetEmail, targetPass).then(() => {
  process.exit(0);
}).catch(err => {
  console.error('\n[FATAL ERROR]', err);
  process.exit(1);
});
