#Objective - Using React, build the client-side for an app called myFlix based on its existing server-side code (REST API and databases).
------------------------------------------------

#Getting started:
1. Create new repo on GitHub desktop --> new repo name: myFlix-client
2. Publish project make sure private code checkbox is unchecked to share.
3. Next in terminal run the following command npm init follow the prompts.
(this will result in a package.json file to be created.)
4. Make sure to open VS Code (editor of choice) and remove "main": "index.s" from package.json file.
5. Create a .gitignore file add the following:
node_modules
.cache
.parcel-cache
6. npm install -g parcel in terminal. 
7. Navigate to project folder and run the folloing command in terminal:
- npm install --save react react-dom (results in package-lock.json file)
8. Create src folder, then add the following 3 files in project.
- index.html
- index.jsx
- index.scss
Each one containg pieces of code to build the app.
9. Test project using parcel in your terminal run the following command:
- Make sure your within your project folder 
parcel src/index.html
This results in server running on http://localhost:1234
#Creating the following:
- A new Dist folder
with the following inside: 4 files will be rendered after completeing step 9.
- dist/index. css 
- dist/index. css.map
- dist/index. js
- dist /index. js.map




