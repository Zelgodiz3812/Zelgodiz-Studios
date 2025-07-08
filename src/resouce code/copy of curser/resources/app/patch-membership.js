import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the main workbench file
const workbenchPath = path.join(__dirname, 'out', 'vs', 'workbench', 'workbench.desktop.main.js');

console.log('Patching Zelgodiz membership types...');

try {
    // Read the workbench file
    let content = fs.readFileSync(workbenchPath, 'utf8');
    
    // Replace membership type constants
    content = content.replace(/ja\.FREE/g, 'ja.PRO');
    content = content.replace(/ja\.FREE_TRIAL/g, 'ja.PRO');
    
    // Replace membership type function logic
    content = content.replace(
        /this\.membershipType=\(\)=>\{switch\(this\.w\(\)\)\{case ja\.ENTERPRISE:return ja\.ENTERPRISE;case ja\.PRO:return ja\.PRO;case ja\.PRO_PLUS:return ja\.PRO_PLUS;case ja\.FREE_TRIAL:return ja\.FREE_TRIAL;case ja\.ULTRA:return ja\.ULTRA;default:return ja\.FREE\}/g,
        'this.membershipType=()=>{return ja.PRO}'
    );
    
    // Replace membership type checks
    content = content.replace(/membershipType\(\)===ja\.FREE/g, 'membershipType()===ja.PRO');
    content = content.replace(/membershipType\(\)===ja\.FREE_TRIAL/g, 'membershipType()===ja.PRO');
    
    // Replace reactive membership type
    content = content.replace(/reactiveMembershipType\(\)===ja\.FREE/g, 'reactiveMembershipType()===ja.PRO');
    content = content.replace(/reactiveMembershipType\(\)===ja\.FREE_TRIAL/g, 'reactiveMembershipType()===ja.PRO');
    
    // Write the patched content back
    fs.writeFileSync(workbenchPath, content, 'utf8');
    
    console.log('Successfully patched workbench.desktop.main.js');
    
} catch (error) {
    console.error('Error patching file:', error);
} 