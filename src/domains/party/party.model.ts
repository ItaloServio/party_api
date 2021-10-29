import { getManager } from "typeorm"
import { CostEntity } from "../cost/cost.entity"
import { PartyUserEntity } from "../party_user/party_user.entity"
import { User } from "../user/user.model"
import { PartyEntity } from "./party.entity"

export class Party {
  id?: number
  name?: string
  max_members?: number
  max_cost?: number
  location?: string
  created_at?: string
}
