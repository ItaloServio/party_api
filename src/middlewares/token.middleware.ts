import { NextFunction, Request, Response } from 'express'
import { getManager } from 'typeorm'
import { UserEntity } from '../domains/user/user.entity'
import { Tools } from '../utils/tools'

export function tokenMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) throw 'Empty token'

      const entityManager = getManager()
      const user = await entityManager.findOne(UserEntity, {
        where: { token: token.replace('Bearer ', '') }
      })

      if (!user) throw 'Invalid token'

      const expireTimestamp = (new Date(user.token_expire)).getTime()
      const nowTimestamp = Tools.getLocalDate().getTime()

      if (nowTimestamp > expireTimestamp) throw 'Token expired'

      res.locals.user = user
      next()
    } catch (e) {
      console.log('deu pau', e)
      res.status(401).json({
        status: 401,
        message: e,
      })
    }
  }
}
