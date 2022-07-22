/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import MoveType from '@gamepark/brigands/moves/MoveType'
import {placeMeepleMove} from '@gamepark/brigands/moves/PlaceMeeple'
import {PrinceState} from '@gamepark/brigands/PlayerState'
import HeadStartToken from '@gamepark/brigands/types/HeadStartToken'
import PartnerInHand, {isPartnerInHand} from '@gamepark/brigands/types/PartnerInHand'
import PatrolInHand, {isPatrolInHand} from '@gamepark/brigands/types/PatrolInHand'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {usePlay, usePlayerId, useSound} from '@gamepark/react-client'
import {FC, HTMLAttributes} from 'react'
import {useDrop} from 'react-dnd'
import {ResetSelectedPartner, resetSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import {ResetSelectedTokenInHand, resetSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import MoveTokenSound from '../sounds/moveToken.mp3'
import {cityCenterLeft, cityCenterTop} from '../utils/styles'
import {districtImage} from './DistrictTile'

type Props = {
  prince: PrinceState
  selectedPatrol?: PatrolInHand
  selectedHeadStart?: boolean

} & HTMLAttributes<HTMLDivElement>

const DistrictTile: FC<Props> = ({prince, selectedPatrol, selectedHeadStart, ...props}) => {
  const playerId = usePlayerId<PlayerRole>()
  const moveSound = useSound(MoveTokenSound)

  const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()
  const playResetSelectedPartner = usePlay<ResetSelectedPartner>()

  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: ['PartnerInHand', 'PatrolInHand', 'HeadStartToken'],
    canDrop: (item: PartnerInHand | PatrolInHand | HeadStartToken) => {
      return isPatrolInHand(item) && !prince.patrols.includes(DistrictName.Jail)
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: PartnerInHand | PatrolInHand | HeadStartToken) => {
      if (isPatrolInHand(item)) {
        moveSound.play()
        return placeMeepleMove(playerId!, DistrictName.Jail, item.patrolNumber)
      } else if (isPartnerInHand(item)) {
        moveSound.play()
        playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
        playResetSelectedPartner(resetSelectedPartnerMove(), {local: true})
        return placeMeepleMove(playerId!, DistrictName.Jail, item.partnerNumber)
      } else {
        moveSound.play()
        return {type: MoveType.PlayHeadStart, district: DistrictName.Jail}
      }
    }
  })

  return (

    <div ref={dropRef} css={[districtStyle(districtImage[DistrictName.Jail])]} {...props} >

      <div css={[dropSize,
        selectedPatrol !== undefined && !prince.patrols.includes(DistrictName.Jail) && canClickStyle,
        selectedHeadStart === true && prince.patrols.includes(DistrictName.Jail) && canClickStyle,
        canDrop && canDropStyle, canDrop && isOver && isOverStyle]}/>
    </div>
  )
}

const dropSize = css`
  width: 100%;
  height: 100%;
  position: absolute;
`

const canDropStyle = css`
  background-color: rgba(255, 255, 255, 0.2);
`

const canClickStyle = css`
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;

  :hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const isOverStyle = css`
  background-color: rgba(255, 255, 255, 0.5);
`

const jailSize = 31.5

const districtStyle = (image: string) => css`
  position: absolute;
  left: ${cityCenterLeft - jailSize / 2}em;
  top: ${cityCenterTop - jailSize / 2}em;
  width: ${jailSize}em;
  height: ${jailSize}em;
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    filter: brightness(110%);
  }
`

export default DistrictTile