/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Move from '@gamepark/brigands/moves/Move'
import PlaceMeeple from '@gamepark/brigands/moves/PlaceMeeple'
import PlaceToken from '@gamepark/brigands/moves/PlaceToken'
import Phase from '@gamepark/brigands/phases/Phase'
import Partner, {PartnerView} from '@gamepark/brigands/types/Partner'
import PartnerInHand from '@gamepark/brigands/types/PartnerInHand'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import Images from '../utils/Images'

type Props = {
  role: PlayerRole
  partners: (Partner | PartnerView)[]
  partnerNumber: number
  phase: Phase | undefined
  draggable?: boolean
  type?: 'PartnerInHand'
  draggableItem?: PartnerInHand

} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>

const PartnerComponent: FC<Props> = ({role, partners, partnerNumber, phase, draggable = false, type = '', draggableItem, ...props}) => {

  const play = usePlay<Move>()
  const item = {...draggableItem}
  const onDrop = (move: PlaceMeeple | PlaceToken) => {
    play(move)
  }

  return (
    <Draggable canDrag={draggable} type={type} item={item} drop={onDrop} css={[partnerStyle(getPartnerImage(role))]} {...props}/>
  )
}

const partnerStyle = (image: string) => css`
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;

  width: 100%;
  height: 100%;
`

function getPartnerImage(role: PlayerRole): string {
  switch (role) {
    case PlayerRole.BlueThief :
      return Images.partnerBlue
    case PlayerRole.GreenThief :
      return Images.partnerGreen
    case PlayerRole.PurpleThief :
      return Images.partnerPurple
    case PlayerRole.RedThief :
      return Images.partnerRed
    case PlayerRole.YellowThief :
      return Images.partnerYellow
    default:
      return 'error : prince detected'
  }
}

export default PartnerComponent