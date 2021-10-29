import * as yup from 'yup'

export const dto = yup.object().shape({
  description: yup.string().required(),
  price: yup.number().required(),
  party_id: yup.number().required()
})

export type CostDto = {
  description: string
  price: number
  party_id: number
}

export default dto