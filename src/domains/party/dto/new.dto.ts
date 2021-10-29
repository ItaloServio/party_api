import * as yup from 'yup'

const dto = yup.object().shape({
  name: yup.string().required(),
  max_members: yup.number().required(),
  max_cost: yup.number().required(),
  location: yup.string().required()
})

export type NewDto = {
  name: string
  max_members: number
  max_cost: number
  location: string
}

export default dto