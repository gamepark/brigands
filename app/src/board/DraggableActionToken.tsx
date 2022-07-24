import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {DraggableProps} from '@gamepark/react-components/dist/Draggable/Draggable'
import ActionToken, {actionTokenCss} from './ActionToken'

type Props = {
  player: PlayerRole
} & Omit<DraggableProps<ActionTokenItem>, 'type'>

export const ACTION_TOKEN = 'ActionToken'

export type ActionTokenItem = { token: number }

export function isActionTokenItem(item: any): item is ActionTokenItem {
  return typeof item?.token === 'number'
}

export function DraggableActionToken({player, ...props}: Props) {
  const play = usePlay()
  return (
    <Draggable type={ACTION_TOKEN} css={actionTokenCss} drop={play} {...props}>
      <ActionToken player={player}/>
    </Draggable>
  )
}