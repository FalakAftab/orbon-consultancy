const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('StudyPath')) {
        content = content.replace(/StudyPath/g, 'Orbon Consultancy');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file);
        } else {
            const ext = path.extname(file);
            if (['.jsx', '.js', '.css', '.html'].includes(ext)) {
                replaceInFile(file);
            }
        }
    });
}

walk(path.join(__dirname, 'frontend-react', 'src'));
console.log('Done frontend.');

walk(path.join(__dirname, 'backend', 'app'));
walk(path.join(__dirname, 'backend', 'resources'));
walk(path.join(__dirname, 'backend', 'routes'));
console.log('Done backend.');
