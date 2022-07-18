/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {isThisPartnerHasAnyToken} from '@gamepark/brigands/Brigands'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import {isRevealPartnersDistrict, RevealPartnersDistrictsView} from '@gamepark/brigands/moves/RevealPartnersDistricts'
import Phase from '@gamepark/brigands/phases/Phase'
import {ThiefState} from '@gamepark/brigands/PlayerState'
import Partner from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ThiefView} from '@gamepark/brigands/types/Thief'
import ThiefTokenInHand from '@gamepark/brigands/types/ThiefTokenInHand'
import TokenAction from '@gamepark/brigands/types/TokenAction'
import {useAnimation, usePlay, usePlayerId, useSound} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC} from 'react'
import {useDrop} from 'react-dnd'
import {ResetSelectedPartner, resetSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import {ResetSelectedTokenInHand, resetSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import MoveTokenSound from '../sounds/moveToken.mp3'
import Images from '../utils/Images'


type Props = {
  district?: DistrictName
  thief: ThiefState | ThiefView
  color: PlayerRole
  partners?: Partner[]
  selectedTokenInHand?: ThiefTokenInHand
  phase?: Phase

}

const DistrictCard: FC<Props> = ({district, thief, color, partners, selectedTokenInHand, phase}) => {

  const playerId = usePlayerId<PlayerRole>()
  const play = usePlay<Move>()
  const indexOfFirstPartnerOnDistrict: number | undefined = partners !== undefined ? partners.findIndex((part, index) => part.district === district && !isThisPartnerHasAnyToken(thief, index)) : undefined

  const moveSound = useSound(MoveTokenSound)

  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: ['ThiefTokenInHand'],
    canDrop: () => {
      return playerId === color
        && partners !== undefined
        && indexOfFirstPartnerOnDistrict !== undefined && indexOfFirstPartnerOnDistrict !== -1
        && Object.keys(partners[indexOfFirstPartnerOnDistrict]).length !== 0
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: (item: ThiefTokenInHand) => {
      moveSound.play()
      playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
      playResetSelectedPartner(resetSelectedPartnerMove(), {local: true})
      return {type: MoveType.PlaceToken, role: playerId, tokenAction: item.tokenAction, partnerNumber: indexOfFirstPartnerOnDistrict}
    }
  })

  const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()
  const playResetSelectedPartner = usePlay<ResetSelectedPartner>()

  function playPlaceToken(partnerNumber: number, role: PlayerRole, tokenAction: TokenAction) {
    moveSound.play()
    play({
      type: MoveType.PlaceToken,
      partnerNumber,
      role,
      tokenAction
    })
    playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
    playResetSelectedPartner(resetSelectedPartnerMove(), {local: true})
  }

  function canDropSelected(): boolean {
    return playerId === color
      && partners !== undefined
      && indexOfFirstPartnerOnDistrict !== undefined && indexOfFirstPartnerOnDistrict !== -1
      && Object.keys(partners[indexOfFirstPartnerOnDistrict]).length !== 0
      && selectedTokenInHand !== undefined

  }

  const revealPartnersAnimation = useAnimation<RevealPartnersDistrictsView>(animation => isRevealPartnersDistrict(animation.move))

  return (

    <div css={[cardSize, revealPartnersAnimation && revealCardAnimation(revealPartnersAnimation.duration)]}>

      {(canDrop || canDropSelected()) && color === playerId && <div
        ref={dropRef}
        css={[fullSize, canDropSelected() && canDropSelectedStyle, canDrop && canDropStyle, canDrop && isOver && isOverStyle]}
        onClick={() => thief.role === playerId && selectedTokenInHand !== undefined && indexOfFirstPartnerOnDistrict !== undefined && indexOfFirstPartnerOnDistrict !== -1 && playPlaceToken(indexOfFirstPartnerOnDistrict, thief.role, selectedTokenInHand.tokenAction)}>
        ↓
      </div>
      }

      <div css={[backCard, shadow, card, districtCardBackStyle(getCardBG(undefined), getSeal(color))]}>
        {district !== undefined && phase === Phase.Planning && <Picture css={iconStyle} src={getIcon(district)}/>}
      </div>
      <div css={[frontCard, shadow, card, districtCardFrontStyle(getCardBG(district), getSeal(color))]}/>
    </div>

  )
}

const card = css`
  position: absolute;
  width: 100%;
  height: 100%;
`

const shadow = css`
  box-shadow: 0 0 1em 0.2em black;
  border-radius: 15% / 10%;
`


export const glowingColoredKeyframes = (color: string) => keyframes`
  0% {
    filter: drop-shadow(0 0 0.8em ${color});
  }
  80%, 100% {
    filter: drop-shadow(0 0 0.2em ${color});
  }
`

const iconStyle = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 100%;
  filter: grayscale(100%);
`

const fullSize = css`
  width: 100%;
  height: 100%;
  font-size: 7em;
  text-align: center;
  position: absolute;
`

const canDropStyle = css`
  z-index: 5;
  border: white solid 0.08em;
  background-color: rgba(0, 0, 0, 0.0);
  transition: background-color 0.5s ease-in-out, border 0.5s ease-in-out;
`

const canDropSelectedStyle = css`
  z-index: 5;
  border: white solid 0.08em;
  background-color: rgba(0, 0, 0, 0.0);
  transition: background-color 0.5s ease-in-out, border 0.5s ease-in-out;
  cursor: pointer;

  :hover {
    border: white solid 0.08em;
    background-color: rgba(0, 0, 0, 0.7);
    transition: background-color 0.5s ease-in-out, border 0.5s ease-in-out;
  }
`

const isOverStyle = css`
  z-index: 5;
  border: white solid 0.08em;
  background-color: rgba(0, 0, 0, 0.7);
  transition: background-color 0.5s ease-in-out, border 0.5s ease-in-out;;
`

const rotateCardKeyFrames = keyframes`
  from {
    transform: translateY(0em) translateZ(0em) rotateY(0deg)
  }
  25% {
    transform: translateY(-10em) translateZ(0em) rotateY(0deg)
  }
  50% {
    transform: translateY(-10em) translateZ(0em) rotateY(180deg);
  }
  75% {
    transform: translateY(0em) rotateY(180deg);
  }
  to {
    transform: translateY(0em) rotateY(180deg);
  }
`

const revealCardAnimation = (duration: number) => css`
  animation: ${rotateCardKeyFrames} ${duration}s ease-in-out;
`

const frontCard = css`
  transform-style: preserve-3d;
  transform: rotateY(-180deg);
  backface-visibility: hidden;
`

const backCard = css`
  transform-style: preserve-3d;
  backface-visibility: hidden;
`

const districtCardBackStyle = (back: string, seal: string) => css`
  z-index: 1;
  background: center / 50% no-repeat url(${seal}),center / contain no-repeat url(${back});
  width: 100%;
  height: 100%;
`

const districtCardFrontStyle = (front: string, seal: string) => css`
  z-index: 1;
  background: center 10% / 40% no-repeat url(${seal}),center / contain no-repeat url(${front});
  width: 100%;
  height: 100%;
`

const cardSize = css`
  position: relative;
  transform-style: preserve-3d;
  width: 31%;
  height: 100%;
`

function getIcon(district?: DistrictName): string {
  if (district === undefined) {
    return ''
  }
  switch (district) {
    case DistrictName.CityHall :
      return Images.iconCityHall
    case DistrictName.Harbor :
      return Images.iconHarbor
    case DistrictName.Market :
      return Images.iconMarket
    case DistrictName.Palace :
      return Images.iconPalace
    case DistrictName.Tavern :
      return Images.iconTavern
    case DistrictName.Treasure :
      return Images.iconTreasure
    case DistrictName.Convoy :
      return Images.iconConvoy
    default :
      return 'error : jail detected'
  }
}

function getCardBG(district?: DistrictName): string {

  if (district === undefined) {
    return Images.cardBack
  }

  switch (district) {
    case DistrictName.CityHall :
      return Images.cardCityHall
    case DistrictName.Harbor :
      return Images.cardHarbor
    case DistrictName.Market :
      return Images.cardMarket
    case DistrictName.Palace :
      return Images.cardPalace
    case DistrictName.Tavern :
      return Images.cardTavern
    case DistrictName.Treasure :
      return Images.cardTreasure
    case DistrictName.Convoy :
      return Images.cardConvoy
    default :
      return 'error : jail detected'
  }
}

function getSeal(color: PlayerRole): string {
  switch (color) {
    case PlayerRole.GreenThief:
      return Images.sealGreen
    case PlayerRole.BlueThief:
      return Images.sealBlue
    case PlayerRole.RedThief:
      return Images.sealRed
    case PlayerRole.PurpleThief:
      return Images.sealPurple
    case PlayerRole.YellowThief:
      return Images.sealYellow
    default:
      return 'error : no seal'
  }
}

export default DistrictCard