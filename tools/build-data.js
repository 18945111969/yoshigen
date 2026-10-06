// data/*.json の内容を、file:// でも読み込める JS 版 (data/*.js) として書き出します。
// 元データは今まで通り data/*.json です。JSON を編集したらこのスクリプトを実行してください。
//   node tools/build-data.js
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targets = [
    { json: 'data/i18n.json', js: 'data/i18n.js', global: '__YOSHIGEN_I18N__' },
    { json: 'data/site.json', js: 'data/site.js', global: '__YOSHIGEN_SITE__' }
];

for (const { json, js, global } of targets) {
    const source = path.join(root, json);
    const output = path.join(root, js);
    const data = JSON.parse(fs.readFileSync(source, 'utf8'));
    const body = JSON.stringify(data, null, 2);
    const content = `/* 自動生成ファイルです。直接編集しないでください。\n   元データ: ${json}\n   再生成: node tools/build-data.js */\nwindow.${global} = ${body};\n`;
    fs.writeFileSync(output, content, 'utf8');
    console.log(`${js}  <-  ${json} (${Buffer.byteLength(content)} bytes)`);
}
