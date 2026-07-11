const fs = require('fs');
let code = fs.readFileSync('src/db.js', 'utf8');

code = code.replace(
  /const saveToFirebase = \(key, value\) => \{[\s\S]*?catch\(console\.error\);\s*\};/,
  `const saveToFirebase = (key, value) => {
  firebaseCache[key] = value;
  setDoc(DOC_REF, { [key]: value }, { merge: true })
    .then(() => console.log('Successfully saved ' + key + ' to Firestore.'))
    .catch(e => {
      console.error("Firebase save error", e);
      alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือติดต่อผู้ดูแลระบบ (Error: " + e.message + ")");
    });
};`
);

fs.writeFileSync('src/db.js', code);
console.log('Added alert to saveToFirebase');
