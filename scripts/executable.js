const { execSync } = require('child_process')

if (process.platform !== 'win32') {
    execSync('npm run executable')
} else {
    console.log('This script does not work on Windows.')
}