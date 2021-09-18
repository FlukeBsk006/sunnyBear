
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'
import axios from 'axios'
const massages = require('../massages.json')

const app = express()
const port = 9000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


const app2 = app.listen(port, function (err, result) {
    console.log('running in port http://localhost:' + port)
})

const io = socketIO.listen(app2);
// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')

    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
    })

    // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
    client.on('sent-message', function (message, userid) {
        console.log(userid + message)
        io.sockets.emit('new-message', message, userid, new Date())
    })
})

// app.get('/', (req, res) => {
//     res.send('HHHH')
// })

app.get('/massages', (req, res) => {
    res.json(massages)
})

app.get('/massages/:id', (req, res)=>{
    res.json(massages.find(massages => massages.i === req.params.id))
})



export default app
