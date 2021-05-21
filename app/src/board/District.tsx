import { css } from "@emotion/react"
import { FC, HTMLAttributes } from "react"
import Images from "../utils/Images"

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
            return Images.districtJail
        case 1 : 
            return Images.districtTavern
        case 2 :
            return Images.districtMarket
        case 3 :
            return Images.districtHarbor
        case 4 : 
            return Images.districtCityHall
        case 5 : 
            return Images.districtTreasure
        case 6 : 
            return Images.districtPalace
        default :
            return 'error : no BG'
    }
}

export default District