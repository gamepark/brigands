/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import {EventArray} from '@gamepark/brigands/material/Events'
import {DrawEventView, isDrawEvent} from '@gamepark/brigands/moves/DrawEvent'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {useAnimation, usePlayerId} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../images/Images'
import {cityCenterLeft, weekCardHeight, weekCardWidth} from '../utils/styles'

type Props = {
  event: number
  eventDeck: number
  city: District[]
}

const WeekCardsPanel: FC<Props> = ({event, eventDeck, city}) => {
  const animationDrawEvent = useAnimation<DrawEventView>(animation => isDrawEvent(animation.move))
  const playerId = usePlayerId<PlayerRole>()
  const {t} = useTranslation()
  return (
    <>
      <div css={[revealedCardPosition(getPositionOfDistrict(city, EventArray[event].district)),
        revealedCardStyle(getWeekCardImage(event)),
        shadow,
        animationDrawEvent && fadeOut(animationDrawEvent.duration)]}/>
      {animationDrawEvent ?
        <div
          css={[hiddenCardPosition, drawEventAnimation(animationDrawEvent.duration, getPositionOfDistrict(city, EventArray[animationDrawEvent.move.event].district), playerId === undefined || playerId === PlayerRole.Prince)]}>
          <div css={[frontCard, shadow, card, revealedCardStyle(getWeekCardImage(animationDrawEvent.move.event))]}/>
          <div css={[backCard, shadow, card, hiddenCardStyle]}/>
        </div>
        : eventDeck > 0 && <div css={[hiddenCardPosition, shadow]}>
        <div css={[frontCard, shadow, card]}/>
        <div css={[backCard, shadow, card, hiddenCardStyle]}/>
      </div>
      }

      {eventDeck <= 1 && <div css={[hiddenCardPosition, lastTurnStyle]}><p>{t('Last Turn')}</p></div>}

      {eventDeck > 1 && [...Array(eventDeck - 1)].map((_, i) => <Picture key={i} alt={t('deck')} src={Images.weekCardBack}
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
  background-image: url(${Images.weekCardBack});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;

  border-radius: 15% / 10%;
`

function getWeekCardImage(image: number): string {
  switch (image) {
    case 0 :
      return Images.weekCardMarket1
    case 1 :
      return Images.weekCardCityHall1
    case 2 :
      return Images.weekCardTavern1
    case 3 :
      return Images.weekCardPalace1
    case 4 :
      return Images.weekCardHarbor1
    case 5 :
      return Images.weekCardPalace2
    case 6 :
      return Images.weekCardMarket2
    case 7 :
      return Images.weekCardHarbor2
    case 8 :
      return Images.weekCardCityHall2
    case 9 :
      return Images.weekCardTavern2
    case 10 :
      return Images.weekCardConvoy1
    case 11 :
      return Images.weekCardConvoy2
    default :
      return 'error : no week Card founded'
  }
}

function getPositionOfDistrict(city: District[], district: DistrictName): number {
  return city.findIndex(d => d.name === district)
}

export default WeekCardsPanel