CCP555 Fragments - Development and Running Guide - Dennis Baksheev

Introduction

This server is a part of my Fragments project. Below you'll find instructions on how to use the various scripts created to streamline development.

Scripts
The following scripts have been provided in the package.json to ease the development and running processes:

1. Linting
   To ensure that the code follows consistent styling and has no obvious issues, we use ESLint.

Script:

npm run lint
This script will lint all JS files within the src directory using the provided .eslintrc.js configuration.

2. Starting the Server
   To simply start the server without any development mode features:

Script:

npm start
This will start the server using Node.js.

3. Development Mode
   For active development, it's beneficial to have the server automatically restart upon code changes.

Script:

npm run dev
This uses nodemon to watch the files in the src directory and restart the server upon any changes.

4. Debugging
   If you need to connect a debugger and have it pause execution on set breakpoints:

Script:

npm run debug
This command starts the server with Node's inspector active. Use tools like Chrome DevTools or VSCode's debugger to attach to this process.

5. Testing

Script:

npm test
This will currently echo a message indicating that no tests have been specified.
