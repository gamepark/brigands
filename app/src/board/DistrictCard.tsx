/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import { isRevealPartnersDistrict, RevealPartnersDistrictsView } from "@gamepark/brigands/moves/RevealPartnersDistricts";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { useAnimation } from "@gamepark/react-client";
import { FC } from "react";
import Images from "../utils/Images";

type Props = {
    district?:DistrictName
    color:PlayerRole
}

const DistrictCard : FC<Props> = ({district, color}) => {

    const revealPartnersAnimation = useAnimation<RevealPartnersDistrictsView>(animation => isRevealPartnersDistrict(animation.move))

        return(
        <div css={[cardSize]}>
            <div css = {[back, districtCardBackStyle(getCardBG(undefined), getSeal(color)), revealPartnersAnimation && rotateCardBackAnimation(revealPartnersAnimation.duration)]}></div>
            <div css = {[front, districtCardFrontStyle(getCardBG(district), getSeal(color)), revealPartnersAnimation && rotateCardFrontAnimation(revealPartnersAnimation.duration)]}></div>
        </div>
    )
}

const rotateCardFrontKeyFrames = keyframes`
    from{}
    25%{transform:translateY(-10em) translateZ(0em) rotateY(-180deg)}
    50%{transform:translateY(-10em) translateZ(0em) rotateY(0deg);}
    75%{transform:translateY(0em) rotateY(0deg);}
    to{transform:translateY(0em) rotateY(0deg);}
`

const rotateCardBackKeyFrames = keyframes`
    from{}
    25%{transform:translateY(-10em) translateZ(0em)}
    50%{transform:translateY(-10em) translateZ(0em) rotateY(180deg);}
    75%{transform:translateY(0em)  rotateY(180deg);}
    to{transform:translateY(0em)  rotateY(180deg);}
`

const rotateCardFrontAnimation = (duration:number) => css`
animation:${rotateCardFrontKeyFrames} ${duration}s ease-in-out;
`

const rotateCardBackAnimation = (duration:number) => css`
animation:${rotateCardBackKeyFrames} ${duration}s ease-in-out;
`

const front = css`
transform:rotateY(-180deg);
backface-visibility:hidden;
position: relative;
top: -100%;
`

const back = css`
backface-visibility:hidden;
`

const districtCardBackStyle = (back:string, seal:string) => css`
background: center / 50% no-repeat url(${seal}),center / contain no-repeat url(${back});
width:100%;
height:100%;
box-shadow: 0 0 1em 0.2em black;
`

const districtCardFrontStyle = (front:string, seal:string) => css`
background: center 10% / 40% no-repeat url(${seal}),center / contain no-repeat url(${front});
width:100%;
height:100%;
box-shadow: 0 0 1em 0.2em black;
`

const cardSize = css`
width:31%;
height:100%;
`

function getCardBG(district?:DistrictName):string{

    if (district === undefined){
        return Images.cardBack
    } 

    switch (district){
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

function getSeal(color:PlayerRole):string{
    switch (color){
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