import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import { PartyUserEntity } from '../party_user/party_user.entity'

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  pass: string

  @Column({
    nullable: true,
  })
  token: string

  @Column({
    nullable: true,
  })
  token_expire: string

  @Column()
  created_at: string

  @OneToMany(() => PartyUserEntity, partyUser => partyUser.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  party_users: PartyUserEntity[]
}
