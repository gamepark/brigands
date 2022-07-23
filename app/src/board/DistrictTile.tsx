/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import MoveType from '@gamepark/brigands/moves/MoveType'
import {placeMeepleMove} from '@gamepark/brigands/moves/PlaceMeeple'
import Phase from '@gamepark/brigands/phases/Phase'
import {PrinceState} from '@gamepark/brigands/PlayerState'
import HeadStartToken from '@gamepark/brigands/types/HeadStartToken'
import PartnerInHand, {isPartnerInHand} from '@gamepark/brigands/types/PartnerInHand'
import PatrolInHand, {isPatrolInHand} from '@gamepark/brigands/types/PatrolInHand'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {usePlay, usePlayerId, useSound} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {ResetSelectedPartner, resetSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import {ResetSelectedTokenInHand, resetSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import MoveTokenSound from '../sounds/moveToken.mp3'
import Images from '../utils/Images'

type Props = {
  district: District
  prince: PrinceState
  phase: Phase | undefined
  nbPartners?: number
  isPlayerReady?: boolean
  selectedPartner?: number
  selectedPatrol?: PatrolInHand
  selectedHeadStart?: boolean

} & HTMLAttributes<HTMLDivElement>

const DistrictTile: FC<Props> = ({
                                   district, prince, phase, nbPartners, isPlayerReady, selectedPartner, selectedPatrol,
                                   selectedHeadStart, ...props
                                 }) => {

  const playerId = usePlayerId<PlayerRole>()
  const {t} = useTranslation()
  const moveSound = useSound(MoveTokenSound)

  const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()
  const playResetSelectedPartner = usePlay<ResetSelectedPartner>()

  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: ['PartnerInHand', 'PatrolInHand', 'HeadStartToken'],
    canDrop: (item: PartnerInHand | PatrolInHand | HeadStartToken) => {
      if (isPatrolInHand(item)) {
        return !prince.patrols.includes(district.name)
      } else if (isPartnerInHand(item)) {
        return district.name !== DistrictName.Jail
      } else {
        return prince.patrols.includes(district.name) && district.name !== DistrictName.Jail
      }

    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: PartnerInHand | PatrolInHand | HeadStartToken) => {
      if (isPatrolInHand(item)) {
        moveSound.play()
        return placeMeepleMove(playerId!, district.name, item.patrolNumber)
      } else if (isPartnerInHand(item)) {
        moveSound.play()
        playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
        playResetSelectedPartner(resetSelectedPartnerMove(), {local: true})
        return placeMeepleMove(playerId!, district.name, item.partnerNumber)
      } else {
        moveSound.play()
        return {type: MoveType.PlayHeadStart, district: district.name}
      }
    }
  })

  return (

    <div ref={dropRef} css={[districtStyle(districtImage[district.name])]} {...props} >

      <div css={[dropSize,
        selectedPartner !== undefined && district.name !== DistrictName.Jail && canClickStyle,
        selectedPatrol !== undefined && !prince.patrols.includes(district.name) && canClickStyle,
        selectedHeadStart === true && prince.patrols.includes(district.name) && canClickStyle,
        canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>

        {phase === Phase.Planning && district.name !== DistrictName.Jail && playerId !== PlayerRole.Prince && playerId !== undefined &&
        [...Array(nbPartners)].map((_, i) => <Picture key={i} alt={t('temporary partner')} src={Images.partnerGreen}
                                                      css={[temporaryPartnerPosition(i), isPlayerReady === true && blurEffect]}/>)
        }
      </div>
    </div>
  )
}

const blurEffect = css`
  filter: blur(10em);
  transition: filter 1s ease-in;
`

const temporaryPartnerPosition = (index: number) => css`
  position: absolute;
  top: 20%;
  left: ${20 + index * 20}%;
  height: 20%;
  transition: filter 1s ease-in;
  z-index: 1;
  filter: grayscale(1);
`

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

const districtWidth = 31
const districtImageRatio = 1653 / 1638

const districtStyle = (image: string) => css`
  width: ${districtWidth}em;
  height: ${districtWidth * districtImageRatio}em;
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  clip-path: polygon(30.6% 0, 69.4% 0, 100% 73.2%, 82.9% 78.7%, 82.9% 100%, 17.6% 100%, 17.7% 78.9%, 0% 73.3%);
  cursor: pointer;

  &:hover {
    filter: brightness(110%);
  }
`

export const districtImage: Record<DistrictName, string> = {
  [DistrictName.Jail]: Images.jail,
  [DistrictName.Tavern]: Images.tavern,
  [DistrictName.Market]: Images.market,
  [DistrictName.Harbor]: Images.harbour,
  [DistrictName.CityHall]: Images.cityHall,
  [DistrictName.Treasure]: Images.treasure,
  [DistrictName.Palace]: Images.palace,
  [DistrictName.Convoy]: Images.convoy
}

export default DistrictTile