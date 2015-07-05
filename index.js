
//
// Dependency graph
//
// fun.js
// ├── builtinFunctions.js
// ├── inject/accessors.js
// │   └── regex/accessors.js
// ├── inject/additionalFunctions.js
// ├── inject/arguments.js
// │   └── regex/arguments.js
// ├── inject/dotOperator.js
// │   └── regex/dotOperator.js
// ├── inject/references.js
// │   └── regex/references.js
// ├── inputArgs.js
// │   └── inputPipes.js
// ├── isDflowFun.js
// ├── level.js
// │   └── parents.js
// │       └── inputPipes.js
// └── validate.js
//     ├── regex/accessors.js
//     ├── regex/arguments.js
//     ├── regex/dotOperator.js
//     └── regex/references.js
//

exports.fun = require('./src/fun')

