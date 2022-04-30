# Thingy client 
[![Docker Image CI](https://github.com/ASE2021-purple/thingy-client-purple/actions/workflows/docker-image.yml/badge.svg)](https://github.com/ASE2021-purple/thingy-client-purple/actions/workflows/docker-image.yml)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Libraries used:
### Axios
Install with: npm i react-axios 
https://www.npmjs.com/package/react-axios

### react-validation
Install with:
npm install react-validation

https://www.npmjs.com/package/react-validation

### bootstrap
npm install bootstrap --save

### React-Toastify
Install with the commmand:
npm install --save react-toastify

https://www.npmjs.com/package/react-toastify

### MUI Component For Additional CSS
Install Mui with the command:
npm install @mui/material @emotion/react @emotion/styled


https://mui.com/components/slider/


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# Create Docker container for this App
Run the following command from projects root directory (where this README file is):

`docker build --network=host -t thingy-client-purple .`

This command will build a docker container with this react application in it. I had to use the --network=host option in my wsl in order to download the dependencies.

(Linux, Mac and Windows PowerShell) Once the container is built, you can run it by using the following command:

`docker run -it --rm -v ${PWD}:/thingy-client -v /thingy-client/node_modules/ -p 3001:3000 thingy-client-purple`

(Windows CMD version):

`docker run -it --rm -v %cd%:/thingy-client -v /thingy-client/node_modules/ -p 3001:3000 thingy-client-purple`

Some explanations on the command if you are not familiar with docker:
* it : Interactive mode, this prevents the container from exiting and is necessary for v3.4.1 react-scripts and later (because they exit after start-up)
* rm : removes docker container and volumes after the container exists
* v : adds volumes and mounts them at the specified path (I recommend to read the doc on this if you are unfamiliar with that)
* p: exposes the port 3000 to other Docker containers and 3001 to the host (necessary to access the app via browser)

**Careful:** to access the app now, you have to go to [http://localhost:3001](http://localhost:3001) if you are using a browser on you host!
