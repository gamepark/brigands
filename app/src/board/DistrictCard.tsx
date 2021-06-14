/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import DistrictName from "@gamepark/brigands/types/DistrictName";
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
        switch(color){
            case PlayerRole.BlueThief :
                return Images.cardBackBlue
            case PlayerRole.GreenThief :
                return Images.cardBackGreen
            case PlayerRole.PurpleThief :
                return Images.cardBackPurple
            case PlayerRole.RedThief :
                return Images.cardBackRed
            case PlayerRole.YellowThief :
                return Images.cardBackYellow
            default :
                return 'error : prince detected'
        }
    }

    switch (district){
        case DistrictName.CityHall :
            switch(color){
                case PlayerRole.BlueThief :
                    return Images.cardCityHallBlue
                case PlayerRole.GreenThief :
                    return Images.cardCityHallGreen
                case PlayerRole.PurpleThief :
                    return Images.cardCityHallPurple
                case PlayerRole.RedThief :
                    return Images.cardCityHallRed
                case PlayerRole.YellowThief :
                    return Images.cardCityHallYellow
                default :
                    return 'error : prince detected'
            }
        case DistrictName.Harbor :
            switch(color){
                case PlayerRole.BlueThief :
                    return Images.cardHarborBlue
                case PlayerRole.GreenThief :
                    return Images.cardHarborGreen
                case PlayerRole.PurpleThief :
                    return Images.cardHarborPurple
                case PlayerRole.RedThief :
                    return Images.cardHarborRed
                case PlayerRole.YellowThief :
                    return Images.cardHarborYellow
                default :
                    return 'error : prince detected'
            }
        case DistrictName.Market :
            switch(color){
                case PlayerRole.BlueThief :
                    return Images.cardMarketBlue
                case PlayerRole.GreenThief :
                    return Images.cardMarketGreen
                case PlayerRole.PurpleThief :
                    return Images.cardMarketPurple
                case PlayerRole.RedThief :
                    return Images.cardMarketRed
                case PlayerRole.YellowThief :
                    return Images.cardMarketYellow
                default :
                    return 'error : prince detected'
            }
        case DistrictName.Palace :
            switch(color){
                case PlayerRole.BlueThief :
                    return Images.cardPalaceBlue
                case PlayerRole.GreenThief :
                    return Images.cardPalaceGreen
                case PlayerRole.PurpleThief :
                    return Images.cardPalacePurple
                case PlayerRole.RedThief :
                    return Images.cardPalaceRed
                case PlayerRole.YellowThief :
                    return Images.cardPalaceYellow
                default :
                    return 'error : prince detected'
            }
        case DistrictName.Tavern :
            switch(color){
                case PlayerRole.BlueThief :
                    return Images.cardTavernBlue
                case PlayerRole.GreenThief :
                    return Images.cardTavernGreen
                case PlayerRole.PurpleThief :
                    return Images.cardTavernPurple
                case PlayerRole.RedThief :
                    return Images.cardTavernRed
                case PlayerRole.YellowThief :
                    return Images.cardTavernYellow
                default :
                    return 'error : prince detected'
            }
        case DistrictName.Treasure :
            switch(color){
                case PlayerRole.BlueThief :
                    return Images.cardTreasureBlue
                case PlayerRole.GreenThief :
                    return Images.cardTreasureGreen
                case PlayerRole.PurpleThief :
                    return Images.cardTreasurePurple
                case PlayerRole.RedThief :
                    return Images.cardTreasureRed
                case PlayerRole.YellowThief :
                    return Images.cardTreasureYellow
                default :
                    return 'error : prince detected'
            }
        default :
            return 'error : jail detected'
        
    }
}

export default DistrictCard