const { existsSync } = require('fs');
const { exec, execSync } = require('child_process')

const commitlintConfig = `
module.exports = {
    extends: ['@commitlint/config-conventional']
}
`

exec('npm run prepare', () => {})

if (!existsSync('./commitlint.config.js')) {
    execSync(`echo "${commitlintConfig}" > commitlint.config.js`)
}

if (process.platform !== 'win32') {
    execSync('npm run executables')
}