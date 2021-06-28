/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import DrawEvent, {DrawEventView, isDrawEvent} from "@gamepark/brigands/moves/DrawEvent";
import { useAnimation } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    event:number
    eventDeck:number
} & HTMLAttributes<HTMLDivElement>

const WeekCardsPanel : FC<Props> = ({event, eventDeck, ...props}) => {

    const animationDrawEvent = useAnimation<DrawEventView>(animation => isDrawEvent(animation.move))

    return (

        <div {...props} css={weekCardsPanelStyle}>

            <div css={[revealedCardPosition, revealedCardStyle(getWeekCardImage(event))]}></div>
            
            
            {animationDrawEvent 
            ? <div css={[hiddenCardPosition]}>
                    <div css={[frontCard, card, drawEventAnimationFront(animationDrawEvent.duration), revealedCardStyle(getWeekCardImage(animationDrawEvent.move.event))]}></div>
                    <div css={[backCard, card, drawEventAnimationBack(animationDrawEvent.duration), hiddenCardStyle]}></div>
              </div> 
            : <div css={[hiddenCardPosition]}>
                    <div css={[frontCard, card]}></div>
                    <div css={[backCard, card, hiddenCardStyle]}></div>
              </div> 
            }


           

        </div>

    )

}

const drawEventKeyFramesFront = keyframes`
    from{}
    to{
        transform-origin:left;
        transform:translateX(19em) rotateY(0deg);
    }
`
const drawEventKeyFramesBack = keyframes`
    from{}
    to{
        transform-origin:right;
        transform:translateX(2em) rotateY(180deg);
    }
`

const drawEventAnimationFront = (duration:number) => css`
animation:${drawEventKeyFramesFront} ${duration}s ease-in-out;
`

const drawEventAnimationBack = (duration:number) => css`
animation:${drawEventKeyFramesBack} ${duration}s ease-in-out;
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

const revealedCardPosition = css`
position:absolute;
bottom:0%;
right:2%;
width:40%;
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
bottom:0%;
right:45%;
width:40%;
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

export default WeekCardsPanel