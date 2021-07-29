import GameView from "@gamepark/brigands/GameView"
import { resetSelectedPatrol } from "./SetSelectedPatrol"

export default interface SetSelectedHeadStart {
    type: 'SetSelectedHeadStart'
}

export interface ResetSelectedHeadStart {
    type:'ResetSelectedHeadStart'
}

export const setSelectedHeadStartMove = ():SetSelectedHeadStart => ({
    type:'SetSelectedHeadStart'
})

export const resetSelectedHeadStartMove = ():ResetSelectedHeadStart=> ({
    type:'ResetSelectedHeadStart'
})

export function setSelectedHeadStart(state:GameView){
    if (state.selectedHeadStart === true){
        resetSelectedHeadStart(state)
    } else {
        resetSelectedPatrol(state)
        state.selectedHeadStart = true
    }
}

export function resetSelectedHeadStart(state:GameView){
    delete state.selectedHeadStart
}