/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import MoveType from '@gamepark/brigands/moves/MoveType'
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
import {decomposeGold, getCoin} from './PrincePanel'

type Props = {
  district: District
  prince: PrinceState
  phase: Phase | undefined
  nbPlayers: number
  nbPartners?: number
  isPlayerReady?: boolean
  isDistrictNotResolved?: boolean
  selectedPartner?: number
  selectedPatrol?: PatrolInHand
  selectedHeadStart?: boolean

} & HTMLAttributes<HTMLDivElement>

const DistrictTile: FC<Props> = ({
                                   district, prince, phase, nbPlayers, nbPartners, isPlayerReady, isDistrictNotResolved, selectedPartner, selectedPatrol,
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
        if (item.patrolNumber !== 2) {
          return !prince.patrols.includes(district.name)
        } else {
          return !prince.patrols.includes(district.name)
        }

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
        return {type: MoveType.PlacePatrol, patrolNumber: item.patrolNumber, district: district.name}
      } else if (isPartnerInHand(item)) {
        moveSound.play()
        playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
        playResetSelectedPartner(resetSelectedPartnerMove(), {local: true})
        return {type: MoveType.PlacePartner, playerId, district: district.name, partnerNumber: item.partnerNumber}
      } else {
        moveSound.play()
        return {type: MoveType.PlayHeadStart, district: district.name}
      }
    }
  })

  return (

    <div {...props} ref={dropRef} css={districtStyle(districtImage[district.name])}>

      <div css={districtNotResolvedCache(isDistrictNotResolved)}/>

      <div css={[dropSize,
        selectedPartner !== undefined && district.name !== DistrictName.Jail && canClickStyle,
        selectedPatrol !== undefined && !prince.patrols.includes(district.name) && canClickStyle,
        selectedHeadStart === true && prince.patrols.includes(district.name) && canClickStyle,
        canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>

        {phase === Phase.Planning && district.name !== DistrictName.Jail && playerId !== PlayerRole.Prince && playerId !== undefined &&
        [...Array(nbPartners)].map((_, i) => <Picture key={i} alt={t('temporary partner')} src={Images.partnerGreen}
                                                      css={[temporaryPartnerPosition(i), isPlayerReady === true && blurEffect]}/>)
        }

        {district.gold !== undefined &&
        <div css={goldOnTreasureDisplay}>
          {decomposeGold(district.gold).map((coin, index) =>
            [...Array(coin)].map((_, index2) => <Picture key={index2 + '_' + index} alt={t('Coin')} src={getCoin(index)} css={coinPosition(index, index2)}/>)
          )}
        </div>
        }
      </div>
    </div>
  )
}

const districtNotResolvedCache = (isDistrictNotResolved?: boolean) => css`
  position: absolute;
  width: 100%;
  height: 100%;
  ${isDistrictNotResolved === true ? `background-color:rgba(0,0,0,0.6);` : `background-color:rgba(0,0,0,0);`}
  transition: background-color 0.5s ease-in;
`

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

const goldOnTreasureDisplay = css`
  position: relative;
  width: 90%;
  height: 50%;
  top: 5%;
  left: 5%;
`

const coinPosition = (firstI: number, secondI: number) => css`
  position: absolute;
  top: ${25 + 25 * firstI}%;
  left: ${10 + 10 * secondI}%;
  width: ${30 - firstI * 2.75}%;
  height: ${55 - firstI * 5}%;

  border-radius: 100%;
  box-shadow: 0 0 1em 0.2em black;
`

const districtStyle = (image: string) => css`
  position: relative;

  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
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