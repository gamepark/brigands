/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import {DrawDayCardView, isDrawDayCard} from '@gamepark/brigands/moves/DrawDayCard'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {useAnimation, usePlayerId} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../images/Images'
import {cityCenterLeft, weekCardHeight, weekCardWidth} from '../utils/styles'

type Props = {
  deck: number
  dayCards: DistrictName[]
  city: District[]
}

const WeekCardsPanel: FC<Props> = ({dayCards, deck, city}) => {
  const animationDrawEvent = useAnimation<DrawDayCardView>(animation => isDrawDayCard(animation.move))
  const playerId = usePlayerId<PlayerRole>()
  const {t} = useTranslation()
  return (
    <>
      <div css={[revealedCardPosition(getPositionOfDistrict(city, dayCards[0])),
        revealedCardStyle(getWeekCardImage(dayCards[0])),
        shadow,
        animationDrawEvent && fadeOut(animationDrawEvent.duration)]}/>
      {animationDrawEvent ?
        <div
          css={[hiddenCardPosition, drawEventAnimation(animationDrawEvent.duration, getPositionOfDistrict(city, animationDrawEvent.move.district), playerId === undefined || playerId === PlayerRole.Prince)]}>
          <div css={[frontCard, shadow, card, revealedCardStyle(getWeekCardImage(animationDrawEvent.move.district))]}/>
          <div css={[backCard, shadow, card, hiddenCardStyle]}/>
        </div>
        : deck > 0 && <div css={[hiddenCardPosition, shadow]}>
        <div css={[frontCard, shadow, card]}/>
        <div css={[backCard, shadow, card, hiddenCardStyle]}/>
      </div>
      }

      {deck <= 1 && <div css={[hiddenCardPosition, lastTurnStyle]}><p>{t('Last Turn')}</p></div>}

      {deck > 1 && [...Array(deck - 1)].map((_, i) => <Picture key={i} alt={t('deck')} src={Images.dayCardBack}
                                                               css={[backCard, hiddenCardStyle, offsetDeck(i + 1), shadow]}/>)}


    </>

  )

}

const lastTurnStyle = css`
  border: white 0.8em dashed;
  border-radius: 15% / 10%;
  z-index: -2;
  text-align: center;

  p {
    font-size: 4.2em;
  }
`

const fadeOutKeyFrames = keyframes`
  from {
    opacity: 1
  }
  10%, to {
    opacity: 0
  }
`

const fadeOut = (duration: number) => css`
  animation: ${fadeOutKeyFrames} ${duration}s ease-in;
`

const shadow = css`
  box-shadow: 0 0 0.2em 0.1em black;
  border-radius: 15% / 10%;
`

const offsetDeck = (index: number) => css`
  width: ${weekCardWidth}em;
  height: ${weekCardHeight}em;
  position: absolute;
  top: ${70 - index * 0.2}em;
  left: ${cityCenterLeft - weekCardWidth / 2 - index * 0.2}em;
`

const drawEventKeyFrames = (districtPosition: number, isPrinceView: boolean) => keyframes`
  from {
    top: 0;
    left: 60%;
    transform: translateZ(0em) rotateY(0deg);
  }
  15% {
    top: 0;
    left: 60%;
    transform: translateZ(18em) rotateY(90deg);
  }
  30%, 50% {
    top: 0;
    left: 60%;
    transform: translateZ(0em) rotateY(180deg);
  }
  75% {
    top: ${isPrinceView ? -147 : 137}%;
    left: ${isPrinceView ? -31 + districtPosition * 52.5 : -47 + districtPosition * 58}%;
    transform: translateZ(0em) rotateY(180deg);
  }
  to {
    transform: translateZ(0em) rotateY(180deg);
    top: ${isPrinceView ? -147 : 137}%;
    left: ${isPrinceView ? -31 + districtPosition * 52.5 : -47 + districtPosition * 58}%;

  }
`

const drawEventAnimation = (duration: number, districtPosition: number, isPrinceView: boolean) => css`
  animation: ${drawEventKeyFrames(districtPosition, isPrinceView)} ${duration}s ease-in-out;
`

const card = css`
  position: absolute;
  width: 100%;
  height: 100%;
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

const revealedCardPosition = (_districtPosition: number) => css`
  position: absolute;
  top: 44.4em;
  left: 2.8em;
  width: ${weekCardWidth}em;
  height: ${weekCardHeight}em;

`

const revealedCardStyle = (image: string) => css`
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;

  border-radius: 15% / 10%;
`

const hiddenCardPosition = css`
  position: absolute;
  width: ${weekCardWidth}em;
  height: ${weekCardHeight}em;
  top: ${70}em;
  left: ${cityCenterLeft - weekCardWidth / 2}em;
  transform-style: preserve-3d;
`

const hiddenCardStyle = css`
  background-image: url(${Images.dayCardBack});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;

  border-radius: 15% / 10%;
`

function getWeekCardImage(district: DistrictName): string {
  switch (district) {
    case DistrictName.Market:
      return Images.dayCardMarket
    case DistrictName.CityHall:
      return Images.dayCardCityHall
    case DistrictName.Harbor:
      return Images.dayCardHarbor
    case DistrictName.Tavern:
      return Images.dayCardTavern
    case DistrictName.Palace:
      return Images.dayCardPalace
    case DistrictName.Convoy:
      return Images.dayCardConvoy
    case DistrictName.Treasure:
      return Images.dayCardTreasure
    default:
      return Images.dayCardBack
  }
}

function getPositionOfDistrict(city: District[], district: DistrictName): number {
  return city.findIndex(d => d.name === district)
}

export default WeekCardsPanel