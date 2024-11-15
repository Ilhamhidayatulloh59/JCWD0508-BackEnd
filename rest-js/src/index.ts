import http, { IncomingMessage, ServerResponse } from 'http'

const PORT: number = 8000

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url == "/api" && req.method == "GET") {
        res.writeHead(200, { "content-type": "application/json" })
        res.write("Hi there, This is a Vanilla Node.js API")
        res.end()
    }
})

server.listen(PORT, () => {
    console.log("application run on port ", PORT)
})