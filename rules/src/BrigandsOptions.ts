import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerRole, {playerRoles} from './types/PlayerRole'

/**
 * This is the options for each players in the game.
 */
export type BrigandsPlayerOptions = { id: PlayerRole }

/**
 * This is the type of object that the game receives when a new game is started.
 */
export type BrigandsOptions = {
  players: BrigandsPlayerOptions[]
}

/**
 * Typeguard to help Typescript distinguish between a GameState and new game's options, for you main class constructor.
 * @param arg GameState or Game options
 * @return true if arg is a Game options
 */
export function isGameOptions(arg: GameState | BrigandsOptions): arg is BrigandsOptions {
  return typeof (arg as GameState).eventDeck === 'undefined'
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const BrigandsOptionsSpec: OptionsSpec<BrigandsOptions> = {
  players: {
    id: {
      label: t => t('Color'),
      values: playerRoles,
      valueSpec: color => ({label: t => getPlayerName(color, t)}),
      mandatory: PlayerRole.Prince
    }
  }
}

export function getPlayerName(playerId: PlayerRole, t: TFunction) {
  switch (playerId) {
    case PlayerRole.BlueThief:
      return t('Blue player')
    case PlayerRole.GreenThief:
      return t('Green player')
    case PlayerRole.PurpleThief:
      return t('Purple player')
    case PlayerRole.RedThief:
      return t('Red player')
    case PlayerRole.YellowThief:
      return t('Yellow player')
    case PlayerRole.Prince:
      return t('Prince player')
  }
}