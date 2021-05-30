import PlayerView from './PlayerView';
import PlayerRole from './types/PlayerRole';
import Prince from './types/Prince';
import Thief, { ThiefView } from './types/Thief';

type PlayerState = PrinceState | ThiefState
 
export default PlayerState

type PlayerCommon = {
  role: PlayerRole
  gold:number
  isReady:boolean
}

export type PrinceState = PlayerCommon & Prince

export type ThiefState = PlayerCommon & Thief

export function isPrinceState(state:PlayerState | PlayerView):state is PrinceState{
  return (state.role === PlayerRole.Prince)
}

export function isThiefState(state:PlayerState | PlayerView):state is (ThiefState | ThiefView){
  return (state.role !== PlayerRole.Prince)
}