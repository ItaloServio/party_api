import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PartyEntity } from '../party/party.entity'

@Entity({ name: 'cost' })
export class CostEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  party_id: number

  @Column({
    nullable: true
  })
  description: string

  @Column({
    default: 0
  })
  price: number

  @ManyToOne(() => PartyEntity, party => party.costs)
  @JoinColumn({ name: 'party_id', referencedColumnName: 'id' })
  party: PartyEntity
}
