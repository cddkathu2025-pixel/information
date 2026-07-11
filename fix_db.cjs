const fs = require('fs');
let code = fs.readFileSync('src/db.js', 'utf8');

code = code.replace(/if \(districts && \(districts\.includes\('เมือง'\) \|\| districts\.includes\('อ\.เมือง'\)\)\) \{[\s\S]*?districts = null;\s*\}/g, '');
code = code.replace(/if \(districts && !districts\.includes\('"total":2'\)\) \{[\s\S]*?districts = null;\s*\}/g, '');
code = code.replace(/if \(!projects \|\| \(projects && !projects\.includes\('progress'\)\)\) \{/g, 'if (!projects) {');
code = code.replace(/if \(groups && !groups\.includes\('แก้ไข'\)\) \{[\s\S]*?groups = null;\s*\}/g, '');
code = code.replace(/if \(otopProducts && \(!otopProducts\.includes\('"type":"'\) \|\| !otopProducts\.includes\('"district":"'\)\)\) \{[\s\S]*?otopProducts = null;\s*\}/g, '');
code = code.replace(/if \(groups && groups\.length > 0 && \(!types\.includes\(groups\[0\]\.type\) \|\| groups\[0\]\.subdistrict\)\) \{[\s\S]*?return db\.groups;\s*\}/g, '');

fs.writeFileSync('src/db.js', code);
console.log('Fixed reseeding bugs.');
