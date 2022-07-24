/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {MAX_ACTIONS} from '@gamepark/brigands/Brigands'
import District from '@gamepark/brigands/districts/District'
import Phase from '@gamepark/brigands/phases/Phase'
import PlayerView from '@gamepark/brigands/PlayerView'
import ActionToken, {actionTokenPosition} from './board/ActionToken'
import {DraggableActionToken} from './board/DraggableActionToken'

type Props = {
  player: PlayerView
  me: boolean
  city: District[]
  phase?: Phase
}

export function PlayerDisplay({player, me, phase, city}: Props) {
  return <>
    {[...Array(MAX_ACTIONS)].map((_, index) => {
        if (me) {
          const canDrag = phase === Phase.Planning && player.tokens[index] === null
          return <DraggableActionToken key={index} player={player.role} item={{token: index}} canDrag={canDrag}
                                       css={[actionTokenPosition(player.tokens[index], player.role, index, city), canDrag && canDragCss]}/>
        } else {
          return <ActionToken key={index} player={player.role} css={actionTokenPosition(player.tokens[index], player.role, index, city)}/>
        }
      }
    )}
  </>
}

const canDragCss = css`
  cursor: pointer;
`
