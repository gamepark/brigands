import {getDistrictRules} from '../Brigands'
import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type ThrowDices = {
  type: MoveType.ThrowDices
  player: PlayerRole
  dices: number
}

export default ThrowDices

export type ThrowDicesRandomized = ThrowDices & {
  result: number[]
}

export function throwDicesMove(player: PlayerRole, dices: number): ThrowDices {
  return {type: MoveType.ThrowDices, player, dices}
}

export function randomizeThrowDices(move: ThrowDices): ThrowDicesRandomized {
  return {...move, result: [...Array(move.dices)].map(() => Math.floor(Math.random() * 6) + 1)}
}

export function throwDices(state: GameState | GameView, move: ThrowDicesRandomized) {
  getDistrictRules(state).onThrowDices(move)
}

export function isThrowDice(move: Move | MoveView): move is ThrowDices {
  return move.type === MoveType.ThrowDices
}
