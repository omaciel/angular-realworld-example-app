// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
//import './commands'

// Alternatively you can use CommonJS syntax:

import './commands';
import 'cypress-plugin-snapshots/commands';

// const fs = require('fs-extra')
// const path = require('path')

// function getConfigurationByFile(file) {
//     const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`);

//     console.log(file)
//     console.log(pathToConfigFile)
//     cy.log(file)
//     if (!fs.existsSync(pathToConfigFile)) {
//         return {};
//     }
//     return fs.readJson(pathToConfigFile)
// }

// plugins file
export default (on, config) => {
    // // accept a configFile value or use cypress.json by default
    // const file = config.env.configFile

    // return getConfigurationByFile(file)

}