import fs from 'fs';
import path from 'path';

const fix = () => {
    try {
        const filePath = path.join(process.cwd(), 'config', 'serviceAccountKey.json');
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        let key = data.private_key;
        if (!key) {
            console.log("No private_key found");
            return;
        }

        console.log("Original key length:", key.length);

        // 1. Convert any literal '\n' sequences to real newlines
        key = key.replace(/\\n/g, '\n');
        
        // 2. Remove any carriage returns (\r)
        key = key.replace(/\r/g, '');
        
        // 3. Trim extra whitespace but keep necessary PEM structure
        key = key.trim();
        
        // 4. Ensure it ends with a newline
        if (!key.endsWith('\n')) {
            key += '\n';
        }

        console.log("Fixed key length:", key.length);

        data.private_key = key;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("Key fixed and saved to serviceAccountKey.json");
    } catch (err) {
        console.error("Fix failed:", err.message);
    }
};

fix();
