/*

NPM - node package manager

to install any package using npm command used:
npm install package-name or npm i package-name

to see packages your project dependent on:
npm list

to view particular package info:
npm view package-name
npm view package-name package-property
eg: npm view package-name version/s

semantic versioning system
for eg. 1.0.0, 1 is major change, 0 is minor change, 0 is patch change

version symbols: ^, ~, *, x, <, >, <=, >=, exact, range
- to view all versions: npm show express versions

npm commands:
- npm outdated
- npm remove package-name
- npm update package-name
- npx npm-check-updates

--- Global packages ---
- install packages in your system globally, not in particular project.
- npm install -g package-name
- npm outdated -g
- npm update -g package-name
- npm remove -g package-name
- npm install -g npm-check-updates
- npm install -g npm

--- devDependencies ---
- install for development purpose, but not needed for production
- npm install -D package-name

*/