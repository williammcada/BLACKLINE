const fs=require('node:fs');const path=require('node:path');const root=path.join(__dirname,'..');
const version=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version;
let html=fs.readFileSync(path.join(root,'src/shell.html'),'utf8');
const code=['sim','input','audio','render','main'].map(n=>fs.readFileSync(path.join(root,`src/${n}.js`),'utf8')).join('\n');
html=html.replace('/*__GAME__*/',code);fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,`dist/BLACKLINE-v${version}.html`),html);console.log(`Built BLACKLINE-v${version}.html`,Buffer.byteLength(html),'bytes');
