import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io } from 'socket.io-client'
import sqlite3 from 'sqlite3'
import { IClientEvents, IServerEvents } from './events'

const row = [];
const db = sqlite3.verbose();
const banco = new db.Database("./database/banco.db");
const port = 5000
const app = express()
const httpServer = createServer(app)

/* Connection of front and BackEnd (A -> B)*/
const server = new Server<IClientEvents, IServerEvents>(httpServer, {
  cors: { origin: ['http://localhost:3000'] },
})
const backend_2 = io('http://localhost:5001')

/* Queued messages waiting for connection  */
backend_2.on('connect', () => {
  if (row.length > 0) {
    row.forEach((message) => {

      backend_2.timeout(1000).emit('message:repass', message, (
        err: any) => {
        if (err) {
          console.log('row: ', row)
        }
        else {
          row.pop()
          console.log(row.length)
        }
      })
    })
  }
})


backend_2.on('disconnect', () => {
  console.log('disconected')
})

/* Connection with front and save informations in bdc*/
server.on('connection', socket => {
  console.log('connected')


  socket.on('message:send', (message, callback) => {
    console.log('backend 1', message)

    banco.run(`insert into message(message) values ('${message}') `)


    backSend(message, callback)

  })
})

function backSend(message: any, callback?: any) {
  backend_2.timeout(1000).emit('message:repass', message, (
    err: any, response: any) => {
    if (err) {
      row.push(message)
      callback("error")
      console.log('row: ', row)

    }
    else {
      callback(response)
    }
  })
}

httpServer.on('listening', () => {
  banco.run('create table if not exists message(id integer primary key  autoincrement , message varchar not null)')
})
httpServer.listen(port, () => console.log(`Running on port: ${port}`))
