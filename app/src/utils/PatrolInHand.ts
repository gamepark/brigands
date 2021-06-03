import PartnerInHand from "./PartnerInHand"

type PatrolInHand = {
    patrolNumber:number
}

export default PatrolInHand

export function isPatrolInHand(state:PatrolInHand|PartnerInHand):state is (PatrolInHand){
    return typeof (state as PatrolInHand).patrolNumber === 'number'}