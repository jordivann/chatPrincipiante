import express from "express";
import morgan from "morgan";
import cors from 'cors'
import {Server as SocketServer} from 'socket.io';
import http from 'http'
// SI TRAEMOS NUESTROS PROPIOS ARCHIVOS TIENEN QUE VENIR CON LA EXTENSIÓN POR EL TYPE MODULE DE LA CONFIG
import {PORT} from './config.js'

import {dirname, join} from 'path'
import {fileURLToPath} from "url";

const app = express()
//Esto nos trae el path absoluto desde el archivo inicial osea CHAT
const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(__dirname)
const server = http.createServer(app)
const io = new SocketServer(server, {
    // Con esto le decimos al servidor que permita que el puerto 5173 del front se comunique con el de back
    cors: { 
        origin:'http://localhost:5173',
    }
})

app.use(cors())
app.use(morgan("dev"))

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('message', function (message) {
        //Con esto le transmito al resto de los clientes, es como lo inverso a lo que hacía antes
        socket.broadcast.emit('message', {
            body:message, 
            from: socket.id
        })

    })

})


//Necesito que sirva los archivos estaticos
app.use(express.static(join(__dirname, '../client/dist')))


server.listen(PORT)
console.log('Server started on port ' + PORT )