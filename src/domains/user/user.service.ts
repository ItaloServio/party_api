import * as crypto from 'crypto'
import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import { Tools } from '../../utils/tools'
import authenticateDto from './dto/authenticate.dto'
import newDto from './dto/new.dto'
import { UserEntity } from './user.entity'
import { User } from './user.model'

export class UserService {
  static async new(req: Request, res: Response) {
    try {
      const isValid = await newDto.isValid(req.body)
      if (!isValid) throw 'Invalid object'

      const body: User = req.body

      const entityManager = getManager()
      const exists = await entityManager.findOne(UserEntity, {
        select: ['id'],
        where: {
          email: body.email!
        }
      })

      if (exists && exists.id) throw 'User already created'

      const user = new UserEntity()
      user.email = body.email!
      user.pass = crypto.createHash('sha256').update(body.pass!).digest('hex')
      user.name = body.name!
      user.created_at = Tools.getLocalDateISO()

      await entityManager.save(UserEntity, user)

      res.status(201).send()
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async authenticate(req: Request, res: Response) {
    try {
      const isValid = await authenticateDto.isValid(req.body)
      if (!isValid) throw 'Invalid object'

      const body: User = req.body

      const entityManager = getManager()
      const user = await entityManager.findOne(UserEntity, {
        select: ['id', 'name', 'email', 'created_at'],
        where: {
          email: body.email!,
          pass: crypto.createHash('sha256').update(body.pass!).digest('hex'),
        },
      })

      if (!user) throw 'Invalid credentials'

      const now = new Date()
      const key = user.id + now.getTime().toString()

      const token = crypto.createHash('sha256').update(key).digest('hex')
      const tokenExpire = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000 + 1 * 60 * 60 * 1000
      ).toISOString()

      await entityManager.update(
        UserEntity,
        { id: user.id },
        { token: token, token_expire: tokenExpire }
      )

      res.status(200).json({
        ...user,
        token: token,
        token_expire: tokenExpire,
      })
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async profile(req: Request, res: Response) {
    try {
      const user: User = await res.locals.user
      res.status(200).json(user)
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async all(req: Request, res: Response) {
    try {
      const entityManager = getManager()
      const users = await entityManager.find(UserEntity, {
        select: ['id', 'name', 'email', 'created_at'],
        order: { name: 'ASC' },
      })
      res.json(users)
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }
}
