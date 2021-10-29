import express from 'express'
import { UserService } from './user.service'
import { tokenMiddleware } from '../../middlewares/token.middleware'

const r = express.Router()

r.post('/', UserService.new)
r.post('/authenticate', UserService.authenticate)

r.get('/', tokenMiddleware(), UserService.all)
r.get('/profile', tokenMiddleware(), UserService.profile)

export default r
