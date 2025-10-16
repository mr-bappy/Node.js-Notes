/*

ENVIRONMENT VARIABLES

- used to store code configurations like port number, API keys, database URLs and secret outside the codebase

in node.js we use process object to access environment variable in our project
syntax:
process.env.variable_name

to set environment variable you need to create .env file in your project and define it
syntax:
VARIABLE_NAME=your_key_here

in powershell
$env:VARIABLE_NAME="value"

on cmd prompt
set VARIABLE_NAME="value"

for older version we need to install dotenv package and import it
import 'dotenv/config'
require('dotenv').config()

but now, you can write --env-file=.env along with your project running command


note: you should never share your .env file to anyone, it contains secret keys that except you no one can see it, if you want to share you should .env-example file which contains only variable names with empty values and while pushing your project to github, you should add your .env file in .gitignore directory.

facing problem to change PORT value
use command: echo $env:PORT
check if PORT has existing default value

to remove it use command:
Remove-Item env:\PORT

*/

/*

Validate Environment Variables in Express.js Using Zod

*/