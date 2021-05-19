import {GameOptions, OptionsDescription, OptionType} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor, {playerColors} from './PlayerColor'
import PlayerRole, { playerRoles } from './types/PlayerRole'

/**
 * This is the options for each players in the game.
 */
export type BrigandsPlayerOptions = { id: PlayerRole }

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type BrigandsOptions = GameOptions<BrigandsPlayerOptions, BrigandsPlayerOptions>

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
export const BrigandsOptionsDescription: OptionsDescription<{}, BrigandsPlayerOptions> = {
  players: {
    id: {
      type: OptionType.LIST,
      getLabel: (t: TFunction) => t('Color'),
      values: playerRoles,
      getValueLabel: getPlayerName
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