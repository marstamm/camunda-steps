import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// fs.readFileSync(__dirname + '/node.js', 'utf8')
const files = fs.readdirSync(__dirname);

const allTemplates = [];

for (const file of files) {
  console.log(file);
  if (!file.endsWith('.json')) {
    continue;
  }

  const content = fs.readFileSync(__dirname + '/' + file, 'utf8')
  allTemplates.push(JSON.parse(content));
}

fs.writeFileSync(__dirname + '/all-templates.json', JSON.stringify(allTemplates, null, 2), 'utf8');