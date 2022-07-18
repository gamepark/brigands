import HeadStartToken from './HeadStartToken'
import PatrolInHand from './PatrolInHand'

type PartnerInHand = {
  partnerNumber: number,
}

export default PartnerInHand

export function isPartnerInHand(state: PatrolInHand | PartnerInHand | HeadStartToken): state is (PartnerInHand) {
  return (state as PartnerInHand).partnerNumber !== undefined
}