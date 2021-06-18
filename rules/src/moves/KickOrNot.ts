import GameState from "../GameState"
import GameView from "../GameView"
import { isThiefState, ThiefState } from "../PlayerState"
import PlayerRole from "../types/PlayerRole"
import MoveType from "./MoveType"

type KickOrNot = {
    type : MoveType.KickOrNot
    kickerRole : PlayerRole
    partnerToKick: false | {role:PlayerRole, indexPartner:number}
}

export default KickOrNot 

export type KickOrNotView = {
    type:MoveType.KickOrNot
    kickerRole:PlayerRole
}

export function kickOrNot(state:GameState|GameView, move : KickOrNot){
    const kicker:ThiefState = (state.players.find(p => p.role === move.kickerRole) as ThiefState)
    const kickerIndexPartner:number = kicker.partner.findIndex((part, index) => part.district === state.city[state.districtResolved!].name && kicker.tokens.kick.some(t => t === index))

    kicker.partner[kickerIndexPartner].kickOrNot = move.partnerToKick
    kicker.isReady = true
}

export function kickOrNotInView(state:GameView, move:KickOrNot | KickOrNotView){
    if (isKickOrNotView(move)){
        state.players.find(p => p.role === move.kickerRole)!.isReady = true
    } else {
        kickOrNot(state, move)
    }
}

export function isKickOrNotView(move:KickOrNot | KickOrNotView):move is KickOrNotView{
    return (move as KickOrNot).partnerToKick === undefined
}