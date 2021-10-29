import * as yup from 'yup'

const dto = yup.object().shape({
  party_id: yup.number().required(),
  decision: yup.number().required().moreThan(-2).lessThan(2).not([0])
})

export type DecisionDto = {
  party_id: number
  decision: 1 | -1
}

export default dto