/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import Partner, { PartnerView } from "@gamepark/brigands/types/Partner";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import { FC } from "react";
import { useDrop } from "react-dnd";
import ThiefTokenInHand from "src/utils/ThiefTokenInHand";
import Images from "../utils/Images";

type Props = {
    district?:DistrictName
    color:PlayerRole
}

const DistrictCard : FC<Props> = ({district, color}) => {

    return(
        <div css = {[districtCardStyle(getCardBG(color, district))]}>

        </div>
    )
}

const districtCardStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: bottom;

width:30%;
height:100%;

display:flex;
flex-direction:row;
justify-content:space-evenly;
`

function getCardBG(color:PlayerRole, district?:DistrictName):string{

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

export default DistrictCard