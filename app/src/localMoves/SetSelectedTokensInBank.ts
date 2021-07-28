import GameView from "@gamepark/brigands/GameView";
import ThiefTokenInBank from "@gamepark/brigands/types/ThiefTokenInBank";
import TokenAction from "@gamepark/brigands/types/TokenAction";

export default interface SetSelectedTokensInBank {
    type: 'SetSelectedTokensInBank'
    selectedToken: ThiefTokenInBank,
}

export interface ResetSelectedTokensInBank {
    type:'ResetSelectedTokensInBank'
}

export const setSelectedTokensInBankMove = (action:TokenAction, index:number):SetSelectedTokensInBank => ({
    type:'SetSelectedTokensInBank', selectedToken:{tokenAction : action, index}
})

export const resetSelectedTokensInBankMove = ():ResetSelectedTokensInBank => ({
    type:'ResetSelectedTokensInBank'
})

export function setSelectedTokensInBank(state:GameView,move:SetSelectedTokensInBank){
    if (state.selectedTokensInBank?.find(tok => tok.tokenAction === move.selectedToken.tokenAction && tok.index === move.selectedToken.index) !== undefined){
        state.selectedTokensInBank.splice(state.selectedTokensInBank.findIndex(tok => tok.tokenAction === move.selectedToken.tokenAction && tok.index === move.selectedToken.index),1)
    } else {
        if (state.selectedTokensInBank === undefined){
            state.selectedTokensInBank = [move.selectedToken]
        } else {
            state.selectedTokensInBank.push(move.selectedToken)
        }
    }

}

export function resetSelectedTokensInBank(state:GameView){
    delete state.selectedTokensInBank
}