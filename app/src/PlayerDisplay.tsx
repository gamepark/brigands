/** @jsxImportSource @emotion/react */
import {MAX_ACTIONS} from '@gamepark/brigands/Brigands'
import PlayerView from '@gamepark/brigands/PlayerView'
import ActionToken, {actionTokenPosition} from './board/ActionToken'
import {DraggableActionToken} from './board/DraggableActionToken'

type Props = {
  player: PlayerView
  me: boolean
}

export function PlayerDisplay({player, me}: Props) {
  return <>
    {[...Array(MAX_ACTIONS)].map((_, index) =>
      me ?
        <DraggableActionToken key={index} player={player.role} css={actionTokenPosition(player.tokens[index], player.role, index)}/> :
        <ActionToken key={index} player={player.role} css={actionTokenPosition(player.tokens[index], player.role, index)}/>
    )}
  </>
}
