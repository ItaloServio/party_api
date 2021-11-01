import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import { Tools } from '../../utils/tools'
import { CostEntity } from '../cost/cost.entity'
import { PartyUserEntity } from '../party_user/party_user.entity'
import { UserEntity } from '../user/user.entity'
import { User } from '../user/user.model'
import { PartyEntity } from './party.entity'

import costDto, { CostDto } from './dto/cost.dto'
import inviteDto, { InviteDto } from './dto/invite.dto'
import newDto, { NewDto } from './dto/new.dto'
import decisionDto, { DecisionDto } from './dto/decision.dto'

export class PartyService {
  static async new(req: Request, res: Response) {
    try {
      const isValid = await newDto.isValid(req.body)
      if (!isValid) throw 'Invalid object'

      const user: User = res.locals.user
      const body: NewDto = req.body

      const entityManager = getManager()
      await entityManager.transaction(async transaction => {
        const party = new PartyEntity()
        party.name = body.name!
        party.max_members = body.max_members!
        party.max_cost = body.max_cost!
        party.location = body.location!
        party.manager = user.id!
        party.created_at = Tools.getLocalDateISO()

        const register = await transaction.save(party)

        const partyUser = new PartyUserEntity()
        partyUser.accepted = 1
        partyUser.party_id = register.id
        partyUser.user_id = user.id!

        await transaction.save(partyUser)
      })

      res.status(201).send()
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async getManaged(req: Request, res: Response) {
    try {
      const user: User = res.locals.user
      const parties = await PartyService.getParties(user, true)
      res.status(200).json(parties)
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async getInvited(req: Request, res: Response) {
    try {
      const user = res.locals.user
      const parties = await PartyService.getParties(user, false)
      res.status(200).json(parties)
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async getParties(user: User, isManager: boolean) {
    const managerWhere = isManager
      ? `party.manager = ${user.id!}`
      : `party.manager != ${user.id!}`

    const entityManager = getManager()
    const registers = await entityManager
      .createQueryBuilder(PartyEntity, 'party')
      .select(`
        party.id,
        party.name,
        party.max_members,
        party.location,
        party.max_cost,
        party_user.accepted
      `)
      .addSelect('SUM(cost.price) as total_cost')
      .leftJoin(CostEntity, 'cost', 'cost.party_id = party.id')
      .leftJoin(PartyUserEntity, 'party_user', 'party_user.party_id = party.id')
      .where(`party_user.user_id = ${user.id!}`)
      .andWhere(managerWhere)
      .groupBy('party.id')
      .getRawMany()

    const response = []
    for (const party of registers) {
      const [members, countMembers] = await entityManager.findAndCount(
        PartyUserEntity,
        { where: { party_id: party.id, accepted: 1 }}
      )
      response.push({...party, total_members: countMembers })
    }

    return response
  }

  static async getParty(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      if (!id) throw 'Invalid identifier'

      const entityManager = getManager()

      const members = await entityManager
        .createQueryBuilder(PartyUserEntity, 'party_user')
        .select(`
          party_user.accepted,
          user.name,
          user.email
        `)
        .leftJoin(UserEntity, 'user', 'user.id = party_user.user_id')
        .where('party_user.party_id = :party_id', { party_id: id })
        .getRawMany()

      const party = await entityManager.findOne(PartyEntity, {
        where: { id },
        relations: ['costs'],
      })

      res.status(200).json({ ...party, members })
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async invite(req: Request, res: Response) {
    try {
      const isValid = await inviteDto.isValid(req.body)
      if (!isValid) throw 'Invalid object'

      const body: InviteDto = req.body
      const user: User = res.locals.user

      const entityManager = getManager()
      const party = await entityManager.findOne(PartyEntity, {
        where: { id: body.party_id, manager: user.id! },
      })
      if (!party) throw 'Invalid party identifier'

      const member = await entityManager.findOne(UserEntity, {
        where: { email: body.email },
      })
      if (!member) throw 'Invalid member identifier'

      const register = await entityManager.findOne(PartyUserEntity, {
        where: { user_id: member.id },
      })
      if (register) throw 'Member already invited'

      const partyUser = new PartyUserEntity()
      partyUser.party_id = body.party_id
      partyUser.user_id = member.id
      partyUser.accepted = 0
      await entityManager.save(PartyUserEntity, partyUser)

      res.status(201).send()
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async cost(req: Request, res: Response) {
    try {
      const isValid = await costDto.isValid(req.body)
      if (!isValid) throw 'Invalid object'

      const body: CostDto = req.body
      const user: User = res.locals.user

      const entityManager = getManager()
      const party = await entityManager.findOne(PartyEntity, {
        where: { id: body.party_id, manager: user.id! },
      })
      if (!party) throw 'Invalid party identifier'

      const cost = new CostEntity()
      cost.description = body.description
      cost.price = body.price
      cost.party_id = body.party_id
      await entityManager.save(CostEntity, cost)

      res.status(201).send()
    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }

  static async decision(req: Request, res: Response) {
    try {
      const isValid = await decisionDto.isValid(req.body)
      if (!isValid) throw 'Invalid object'

      const body: DecisionDto = req.body
      const user: User = res.locals.user

      const entityManager = getManager()
      const party = await entityManager.findOne(PartyEntity, {
        where: { id: body.party_id },
      })
      if (!party) throw 'Invalid party identifier'

      const partyUser = await entityManager.findOne(PartyUserEntity, {
        where: { user_id: user.id!, party_id: body.party_id }
      })
      if (!partyUser) throw 'Invalid party or user identifier'

      partyUser.accepted = body.decision
      entityManager.save(PartyUserEntity, partyUser)

      res.status(200).send()

    } catch (e) {
      res.status(400).json({
        status: 400,
        message: e,
      })
    }
  }
}
