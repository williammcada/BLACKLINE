const fs=require('node:fs');const path=require('node:path');const root=path.join(__dirname,'..');
let html=fs.readFileSync(path.join(root,'src/shell.html'),'utf8');
const code=['sim','input','audio','render','main'].map(n=>fs.readFileSync(path.join(root,`src/${n}.js`),'utf8')).join('\n');
html=html.replace('/*__GAME__*/',code);fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist/BLACKLINE-v0.1.0-alpha.1.html'),html);console.log('Built BLACKLINE-v0.1.0-alpha.1.html',Buffer.byteLength(html),'bytes');
