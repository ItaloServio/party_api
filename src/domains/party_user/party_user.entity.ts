import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { PartyEntity } from '../party/party.entity'
import { UserEntity } from '../user/user.entity'

@Entity({ name: 'party_user' })
export class PartyUserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  party_id: number

  @Column()
  user_id: number

  @Column({
    default: 0
  })
  accepted: number

  @ManyToOne(() => PartyEntity, party => party.party_users)
  @JoinColumn({ name: 'party_id', referencedColumnName: 'id' })
  party: PartyEntity

  @ManyToOne(() => UserEntity, user => user.party_users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity
}
