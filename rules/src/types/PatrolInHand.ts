import HeadStartToken from './HeadStartToken'
import PartnerInHand from './PartnerInHand'

type PatrolInHand = {
  patrolNumber: number
  index?: number
}

export default PatrolInHand

export function isPatrolInHand(state: PatrolInHand | PartnerInHand | HeadStartToken): state is (PatrolInHand) {
  return (state as PatrolInHand).patrolNumber !== undefined
}