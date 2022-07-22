/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Move from '@gamepark/brigands/moves/Move'
import PatrolInHand from '@gamepark/brigands/types/PatrolInHand'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import Images from '../utils/Images'

type Props = {
  draggable?: boolean
  type?: 'PatrolInHand'
  draggableItem?: PatrolInHand
} & HTMLAttributes<HTMLDivElement>

const PatrolToken: FC<Props> = ({draggable = false, type = '', draggableItem, ...props}) => {

  const play = usePlay<Move>()
  const item = {...draggableItem}

  return (
    <Draggable {...props}
               css={patrolTokenStyle}
               canDrag={draggable}
               type={type}
               item={item}
               drop={play}
    >


    </Draggable>
  )
}

const patrolTokenStyle = css`
  background-image: url(${Images.patrol});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  width: 100%;
  height: 100%;
`

export default PatrolToken