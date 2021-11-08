import express from 'express'
import 'reflect-metadata'
import './database/conn'

import user from './domains/user/user.controller'
import party from './domains/party/party.controller'

const port = process.env.LISTEN_PORT || 3300
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/party-api/user', user)
app.use('/party-api/party', party)

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`)
})
