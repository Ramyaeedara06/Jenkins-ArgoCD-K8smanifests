const http = require('http');
const port = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Hello from CI/CD demo app\n');
});
server.listen(port, () => console.log(`Listening on ${port}`));
