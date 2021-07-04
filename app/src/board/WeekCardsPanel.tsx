/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import District from "@gamepark/brigands/districts/District";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import { EventArray } from "@gamepark/brigands/material/Events";
import {DrawEventView, isDrawEvent} from "@gamepark/brigands/moves/DrawEvent";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { useAnimation, usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Images from "../utils/Images";

type Props = {
    event:number
    eventDeck:number
    city:District[]
} & HTMLAttributes<HTMLDivElement>

const WeekCardsPanel : FC<Props> = ({event, eventDeck, city, ...props}) => {

    const animationDrawEvent = useAnimation<DrawEventView>(animation => isDrawEvent(animation.move))
    const playerId = usePlayerId<PlayerRole>()
    const {t} = useTranslation()

    return (

        <div {...props} css={weekCardsPanelStyle}>

            <div css={[revealedCardPosition(getPositionOfDistrict(city, EventArray[event].district), playerId === PlayerRole.Prince || playerId === undefined), 
                       revealedCardStyle(getWeekCardImage(event)),
                       shadow,
                       animationDrawEvent && fadeOut(animationDrawEvent.duration)]}></div>
            
            
            {animationDrawEvent 
            ? <div css={[hiddenCardPosition]}>
                    <div css={[frontCard, shadow, card, drawEventAnimationFront(animationDrawEvent.duration, getPositionOfDistrict(city, EventArray[animationDrawEvent.move.event].district), playerId === PlayerRole.Prince || playerId === undefined), revealedCardStyle(getWeekCardImage(animationDrawEvent.move.event))]}></div>
                    <div css={[backCard, shadow, card, drawEventAnimationBack(animationDrawEvent.duration, getPositionOfDistrict(city, EventArray[animationDrawEvent.move.event].district), playerId === PlayerRole.Prince || playerId === undefined), hiddenCardStyle]}></div>
              </div> 
            : eventDeck > 0 && <div css={[hiddenCardPosition, shadow]}>
                    <div css={[frontCard, shadow, card]}></div>
                    <div css={[backCard, shadow, card, hiddenCardStyle]}></div>
              </div> 
            }

            {eventDeck <= 1 && <div css={[hiddenCardPosition, lastTurnStyle]}><p>{t("Last Turn")}</p></div>}

            {eventDeck > 1 && [...Array(eventDeck-1)].map((_, i) => <img key={i} alt={t('deck')} src={Images.weekCardBack} css={[backCard, hiddenCardStyle, offsetDeck(i+1), shadow]} draggable={false} />)}


           

        </div>

    )

}

const lastTurnStyle = css`
border:white 0.8em dashed;
border-radius:15% / 10%;
z-index:-2;
text-align:center;

p{
    font-size:4.2em;
}


`

const fadeOutKeyFrames = keyframes`
from{opacity:1};
10%, to{opacity:0};
`

const fadeOut = (duration:number) => css`
animation:${fadeOutKeyFrames} ${duration}s ease-in;
`

const shadow = css`
box-shadow:0 0 0.2em 0.1em black;
border-radius:15% / 10%;
`

const offsetDeck = (index:number) => css`
width:38%;
height:100%;
position:absolute;
top:0%;
left:${60-index*5}%;
z-index:${-1-index};

`

const drawEventKeyFramesFront = (districtPosition:number, isPrinceView:boolean) => keyframes`
    from{        
        top:0%;
        left:0%;
    }
    15%{
        top:0%;
        left:0%;
        transform:translateZ(18em) rotateY(-90deg);
    }
    30%,50%{
        top:0%;
        left:0%;
        transform:translateZ(0em) rotateY(0deg);
    }
    75%{
        top:${isPrinceView ? -147 : 137}%;
        left:${isPrinceView ? -226+districtPosition*131 : -270+districtPosition*145.5}%;
        transform:translateZ(0em) rotateY(0deg);
    }
    to{
        transform:translateZ(0em) rotateY(0deg);
        top:${isPrinceView ? -147 : 137}%;
        left:${isPrinceView ? -226+districtPosition*131 : -270+districtPosition*145.5}%;

    }
`
const drawEventKeyFramesBack = (districtPosition:number, isPrinceView:boolean) => keyframes`
    from{
        top:0%;
        left:0%;
    }
    15%{
        top:0%;
        left:0%;
        transform:translateZ(18em) rotateY(90deg);
    }
    30%,50%{        
        top:0%;
        left:0%;
        transform:translateZ(0em) rotateY(180deg);
    }
    75%{
        top:${isPrinceView ? -147 : 137}%;
        left:${isPrinceView ? -226+districtPosition*131 : -270+districtPosition*145.5}%;
        transform:translateZ(0em) rotateY(180deg);
    }
    to{
        transform:translateZ(0em) rotateY(180deg);
        top:${isPrinceView ? -147 : 137}%;
        left:${isPrinceView ? -226+districtPosition*131 : -270+districtPosition*145.5}%;
    }
`

const drawEventAnimationFront = (duration:number, districtPosition:number, isPrinceView:boolean) => css`
animation:${drawEventKeyFramesFront(districtPosition, isPrinceView)} ${duration}s ease-in-out;
`

const drawEventAnimationBack = (duration:number, districtPosition:number, isPrinceView:boolean) => css`
animation:${drawEventKeyFramesBack(districtPosition, isPrinceView)} ${duration}s ease-in-out;
`

const card = css`
position:absolute;
width:100%;
height:100%;
`

const frontCard = css`
transform:rotateY(-180deg);
backface-visibility:hidden;
`

const backCard = css`
backface-visibility:hidden;
`

const revealedCardPosition = (districtPosition:number, isPrinceView:boolean) => css`
position:absolute;
top:${isPrinceView ? -147 : 137}%;
left:${isPrinceView ? -31+districtPosition*52.5 : -47+districtPosition*58}%;
width:38%;
height:100%;

`

const revealedCardStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;

border-radius:15% / 10%;
`

const hiddenCardPosition = css`
position:absolute;
top:0%;
left:60%;
width:38%;
height:100%;
`

const hiddenCardStyle = css`
background-image: url(${Images.weekCardBack});
background-size: contain;
background-repeat: no-repeat;
background-position: top;

border-radius:15% / 10%;
`

const weekCardsPanelStyle = css`
transform-style: preserve-3d;
`

function getWeekCardImage(image:number):string{
    switch (image){
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

function getPositionOfDistrict(city:District[], district:DistrictName):number{
    return city.findIndex(d => d.name === district)
}

export default WeekCardsPanel