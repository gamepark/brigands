import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {DraggableProps} from '@gamepark/react-components/dist/Draggable/Draggable'
import ActionToken, {actionTokenCss} from './ActionToken'

type Props = {
  player: PlayerRole
} & Omit<DraggableProps, 'type'>

export function DraggableActionToken({player, ...props}: Props) {
  const play = usePlay()
  return (
    <Draggable type="ActionToken" css={actionTokenCss} drop={play} {...props}>
      <ActionToken player={player}/>
    </Draggable>
  )
}