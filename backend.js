// Import the built-in HTTP module
const http = require('http');

const hostname = '127.0.0.1'; // localhost
const port = 8082;

// "Static" variable to store the most recent command.
// It's initialized to 'none'.
let lastCommand = 'none';

// Create the server
const server = http.createServer((req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight 'OPTIONS' request
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No Content
        res.end();
        return;
    }

    // Handle POST requests to the root path '/' to receive commands
    if (req.method === 'POST' && req.url === '/direction') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // 1. Print the received direction to the console
            console.log(`Received command: ${body}`);
            
            // 2. Store the command in our variable
            lastCommand = body;
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Command received');
        });

    } 
    // Handle GET requests to the '/command' endpoint
    else if (req.method === 'GET' && req.url === '/command') {
        console.log(`Sending last command: ${lastCommand}`);
        
        // Respond with the last stored command
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(lastCommand);
    } 
    else {
        // Handle any other request as "Not Found"
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server is running and listening on http://${hostname}:${port}`);
    console.log('➡️  Send commands via the index.html page.');
    console.log(`➡️  Send the command to http://${hostname}:${port}/direction`);
    console.log(`➡️  Check the last command at http://${hostname}:${port}/command`);
});