import PlayerRole from './types/PlayerRole';
import Prince from './types/Prince';
import Thief from './types/Thief';

export default interface PlayerState {
  role: PlayerRole
  gold:number
  isReady:boolean
}

export type PrinceState = PlayerState & Prince

export type ThiefState = PlayerState & Thief

export function isPrinceState(state:PlayerState):state is PrinceState{
  return (state.role === PlayerRole.Prince)
}

export function isThiefState(state:PlayerState):state is ThiefState{
  return (state.role === PlayerRole.GreenThief || state.role === PlayerRole.BlueThief || state.role === PlayerRole.PurpleThief || state.role === PlayerRole.RedThief || state.role === PlayerRole.YellowThief)
}