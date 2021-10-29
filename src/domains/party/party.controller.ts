import express from 'express'
import { tokenMiddleware } from '../../middlewares/token.middleware'
import { PartyService } from './party.service'

const r = express.Router()

r.post('/', tokenMiddleware(), PartyService.new)
r.post('/cost', tokenMiddleware(), PartyService.cost)
r.post('/invite', tokenMiddleware(), PartyService.invite)
r.post('/decision', tokenMiddleware(), PartyService.decision)

r.get('/manager', tokenMiddleware(), PartyService.getManaged)
r.get('/invited', tokenMiddleware(), PartyService.getInvited)
r.get('/:id', tokenMiddleware(), PartyService.getParty)

export default r
