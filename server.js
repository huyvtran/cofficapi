const http 					= require('http');
const app 					= require('./app'); // app file include
const globalVariable		= require('./nodemon');
const port = process.env.PORT || globalVariable.PORT;
const server = http.createServer(app);
console.log("port ",port);
server.listen(port);

