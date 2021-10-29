import * as yup from 'yup'

const dto = yup.object().shape({
  email: yup.string().email().required(),
  pass: yup.string().required()
})

export default dto