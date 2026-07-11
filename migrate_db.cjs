const fs = require('fs');
let code = fs.readFileSync('src/db.js', 'utf8');

code = code.replace(/localStorage\.setItem\(([^,]+),\s*JSON\.stringify\(([^)]+)\)\)/g, 'saveToFirebase($1, $2)');
code = code.replace(/localStorage\.getItem\(([^)]+)\)/g, 'getFromFirebaseCache($1)');
code = code.replace(/localStorage\.removeItem\(([^)]+)\)/g, 'removeFromFirebaseCache($1)');

const imports = `import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DOC_REF = doc(db, 'appData', 'cddInfo');
export let firebaseCache = {};

export const loadFirebaseData = async () => {
  try {
    const snap = await getDoc(DOC_REF);
    if (snap.exists()) {
      firebaseCache = snap.data();
    } else {
      firebaseCache = {};
    }
  } catch (e) {
    console.error("Firebase load error", e);
    firebaseCache = {};
  }
};

const getFromFirebaseCache = (key) => {
  return firebaseCache[key] ? JSON.stringify(firebaseCache[key]) : null;
};

const saveToFirebase = (key, value) => {
  firebaseCache[key] = value;
  setDoc(DOC_REF, { [key]: value }, { merge: true }).catch(console.error);
};

const removeFromFirebaseCache = (key) => {
  delete firebaseCache[key];
  // Normally we would use updateDoc with deleteField() here, but setting to null is okay for now
  setDoc(DOC_REF, { [key]: null }, { merge: true }).catch(console.error);
};
`;

code = imports + '\n' + code;

fs.writeFileSync('src/db.js', code);
console.log('db.js rewritten for Firebase');
