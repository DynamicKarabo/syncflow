import { Server } from '@hocuspocus/server'

const server = new Server({
    port: 1234,
    onConnect: (data) => {
        console.log('Server: Connection attempt from', data.requestHeaders['sec-websocket-key']);
        // Simulate acceptance context
        return Promise.resolve()
    },
    onDisconnect: () => {
        console.log('Server: Disconnected')
        return Promise.resolve()
    },
    onLoadDocument: (data) => {
        console.log('Server: Loading document', data.documentName)
        return Promise.resolve(data.document)
    },
})

server.listen()
console.log('Hocuspocus server running on port 1234')
