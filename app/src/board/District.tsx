import { css } from "@emotion/react"
import { FC, HTMLAttributes } from "react"

import JailBG from '../images/DistrictJail.jpg'
import CityHallBG from '../images/DistrictCityHall.jpg'
import HarborBG from '../images/DistrictHarbor.jpg'
import MarketBG from '../images/DistrictMarket.jpg'
import PalaceBG from '../images/DistrictPalace.jpg'
import TavernBG from '../images/DistrictTavern.jpg'
import TreasureBG from '../images/DistrictTreasure.jpg'

/** @jsxImportSource @emotion/react */

type Props = {
    district:number
} & HTMLAttributes<HTMLDivElement>

const District : FC<Props> = ({district, ...props}) => {

    return(

        <div {...props} css={districtStyle(getDistrictImage(district))}></div>

    )

}

const districtStyle = (image:string) => css`
    background-image: url(${image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
`

function getDistrictImage(district:number):string{
    switch (district){
        case 0 :
            return JailBG
        case 1 : 
            return TavernBG
        case 2 :
            return MarketBG
        case 3 :
            return HarborBG
        case 4 : 
            return CityHallBG
        case 5 : 
            return TreasureBG
        case 6 : 
            return PalaceBG
        default :
            return 'error : no BG'
    }
}

export default District