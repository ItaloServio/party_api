import { createConnection } from 'typeorm'
import { CostEntity } from '../domains/cost/cost.entity'
import { PartyEntity } from '../domains/party/party.entity'
import { PartyUserEntity } from '../domains/party_user/party_user.entity'
import { UserEntity } from '../domains/user/user.entity'

createConnection({
  type: 'sqlite',
  database: `${__dirname}/database.sqlite`,
  entities: [
    UserEntity,
    PartyEntity,
    CostEntity,
    PartyUserEntity
  ],
  synchronize: true,
  logging: true,
})
