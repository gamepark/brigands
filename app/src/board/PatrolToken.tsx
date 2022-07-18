/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Move from '@gamepark/brigands/moves/Move'
import PlacePatrol from '@gamepark/brigands/moves/PlacePatrol'
import PatrolInHand from '@gamepark/brigands/types/PatrolInHand'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import Images from '../utils/Images'

type Props = {
  isMercenary: boolean
  draggable?: boolean
  type?: 'PatrolInHand'
  draggableItem?: PatrolInHand
} & HTMLAttributes<HTMLDivElement>

const PatrolToken: FC<Props> = ({isMercenary, draggable = false, type = '', draggableItem, ...props}) => {

  const play = usePlay<Move>()
  const item = {...draggableItem}
  const onDrop = (move: PlacePatrol) => {
    play(move)
  }

  return (
    <Draggable {...props}
               css={patrolTokenStyle(isMercenary ? Images.mercenary : Images.patrol)}
               canDrag={draggable}
               type={type}
               item={item}
               drop={onDrop}
    >


    </Draggable>
  )
}

const patrolTokenStyle = (image: string) => css`
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  width: 100%;
  height: 100%;
`

export default PatrolToken