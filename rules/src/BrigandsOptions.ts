import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerRole, {playerRoles} from './types/PlayerRole'

export type BrigandsPlayerOptions = { id: PlayerRole }

export type BrigandsOptions = {
  players: BrigandsPlayerOptions[]
}

export function isGameOptions(arg: GameState | BrigandsOptions): arg is BrigandsOptions {
  return typeof (arg as GameState).eventDeck === 'undefined'
}

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