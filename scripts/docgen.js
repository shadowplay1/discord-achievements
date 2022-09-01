const { exec } = require('child_process')
const modulePackage = require('../package.json')

exec(
    'docgen ' +
    '-s src/*.ts src/**/*.ts ' +
    `-o branches/docs/${modulePackage.version}.json ` +
    '-c branches/docs/index.yml ' +
    '-g -S 1 ' +
    '-j jsconfig.json',
    (err, stdout) => {
        if (err) {
            return console.error(err)
        }

        console.log(stdout)
    })