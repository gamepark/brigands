import HeadStartToken from "./HeadStartToken"
import PatrolInHand from "./PatrolInHand"

type PartnerInHand = {
    partnerNumber:number,
}

export default PartnerInHand

export function isPartnerInHand(state:PatrolInHand|PartnerInHand|HeadStartToken):state is (PartnerInHand){
    return typeof (state as PartnerInHand).partnerNumber === 'number'}