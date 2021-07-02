import GameView from "@gamepark/brigands/GameView";
import MoveType from "@gamepark/brigands/moves/MoveType";
import MoveView from "@gamepark/brigands/moves/MoveView";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { Animations } from "@gamepark/react-client";

const brigandsAnimations : Animations<GameView, MoveView, PlayerRole> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){

        if (move.type === MoveType.ArrestPartners){
            return 2
        } else if (move.type === MoveType.BetGold){
            return action.playerId === playerId ? 0 : 2
        } else if (move.type === MoveType.GainGold){
            return 2
        } else if (move.type === MoveType.MoveOnDistrictResolved){
            return 2
        } else if (move.type === MoveType.SpareGoldOnTreasure){
            return 2
        } else if (move.type === MoveType.TakeBackPartner){
            return 2
        } else if (move.type === MoveType.TakeToken){
            return action.playerId === playerId ? 0 : 2
        } else if (move.type === MoveType.ThrowDice){
            return 30
        } else if (move.type === MoveType.ResolveStealToken){
            return 2
        } else if (move.type === MoveType.MovePartner){
            return 2
        } else if (move.type === MoveType.DrawEvent){
            return 6
        } else if (move.type === MoveType.JudgePrisoners){
            return 2
        } else if (move.type === MoveType.PlacePartner){
            return action.playerId === playerId ? 0 : 1
        } else if (move.type === MoveType.RevealPartnersDistricts){
            return 5
        }

        return 0
    }

}

export default brigandsAnimations