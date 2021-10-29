import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { CostEntity } from '../cost/cost.entity'
import { PartyUserEntity } from '../party_user/party_user.entity'

@Entity({ name: 'party' })
export class PartyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    nullable: true,
  })
  max_members: number

  @Column({
    nullable: true,
  })
  max_cost: number

  @Column({
    nullable: true,
  })
  location: string

  @Column()
  created_at: string

  @Column()
  manager: number

  @OneToMany(() => CostEntity, cost => cost.party)
  @JoinColumn({ name: 'id', referencedColumnName: 'party_id' })
  costs: CostEntity[]

  @OneToMany(() => PartyUserEntity, partyUser => partyUser.party)
  @JoinColumn({ name: 'id', referencedColumnName: 'party_id' })
  party_users: PartyUserEntity[]
}
