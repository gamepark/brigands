/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Move from '@gamepark/brigands/moves/Move'
import HeadStartToken from '@gamepark/brigands/types/HeadStartToken'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import Images from '../utils/Images'

type Props = {
  draggable?: boolean
  type?: 'HeadStartToken'
  draggableItem?: HeadStartToken
} & HTMLAttributes<HTMLDivElement>

const HeadStart: FC<Props> = ({draggable = false, type = '', draggableItem, ...props}) => {
  const play = usePlay<Move>()
  const item = {...draggableItem}
  return <Draggable {...props} css={headStartTokenStyle} canDrag={draggable} item={item} type={type} drop={play}/>
}

const headStartTokenStyle = css`
  background-image: url(${Images.actionTokenWhite});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  width: 100%;
  height: 100%;
`

export default HeadStart