import { getManager } from 'typeorm'
import { UserEntity } from '../domains/user/user.entity'
import { User } from '../domains/user/user.model'

export class Tools {
  static async getUserByToken(token: string): Promise<User> {
    const entityManager = getManager()
    const register = await entityManager.findOne(UserEntity, {
      where: { token: token!.replace('Bearer ', '') },
    })
    const user: User = register!
    delete user.pass
    return user
  }

  static getLocalDateISO(): string {
    const now = new Date()
    return new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString()
  }

  static getLocalDate(): Date {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  }
}
