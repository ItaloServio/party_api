import * as yup from 'yup'

const dto = yup.object().shape({
  email: yup.string().email().required(),
  party_id: yup.number().required()
})

export type InviteDto = {
  email: string
  party_id: number
}

export default dto