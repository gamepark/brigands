import GameView from "@gamepark/brigands/GameView"
import PatrolInHand from "@gamepark/brigands/types/PatrolInHand"
import { resetSelectedHeadStart } from "./SetSelectedHeadStart"

export default interface SetSelectedPatrol {
    type: 'SetSelectedPatrol'
    selectedPatrol:PatrolInHand|undefined
}

export interface ResetSelectedPatrol {
    type:'ResetSelectedPatrol'
}

export const setSelectedPatrolMove = (patrolNumber:number, index:number):SetSelectedPatrol => ({
    type:'SetSelectedPatrol', selectedPatrol:{patrolNumber, index}
})

export const resetSelectedPatrolMove = ():ResetSelectedPatrol => ({
    type:'ResetSelectedPatrol'
})

export function setSelectedPatrol(state:GameView,move:SetSelectedPatrol){
    if (state.selectedPatrol?.patrolNumber === move.selectedPatrol?.patrolNumber){
        resetSelectedPatrol(state)
    } else {
        resetSelectedHeadStart(state)
        state.selectedPatrol = move.selectedPatrol
    }
}

export function resetSelectedPatrol(state:GameView){
    delete state.selectedPatrol
}