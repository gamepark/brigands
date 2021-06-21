/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    event:number
    eventDeck:number
} & HTMLAttributes<HTMLDivElement>

const WeekCardsPanel : FC<Props> = ({event, eventDeck, ...props}) => {

    return (

        <div {...props} css={weekCardsPanelStyle}>

            <div css={[revealedCardPosition, revealedCardStyle(getWeekCardImage(event))]}></div>

            <div css={[hiddenCardPosition, hiddenCardStyle]}></div>

        </div>

    )

}

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