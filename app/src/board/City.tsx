/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { PrinceState } from "@gamepark/brigands/PlayerState";
import District from "@gamepark/brigands/types/District";
import DistrictName from "@gamepark/brigands/types/DistrictName";
import Phase from "@gamepark/brigands/types/Phase";
import { FC, HTMLAttributes } from "react";
import DistrictTile from "./DistrictTile";


type Props = {
    city:District[]
    phase:Phase | undefined
    prince:PrinceState
    districtResolved:number|undefined

} & HTMLAttributes<HTMLDivElement>

const City : FC<Props> = ({city, phase, prince, districtResolved, ...props}) => {

    return(

        <div {...props} css={cityStyle}>

            {city.map((district, index) => 
            
                <DistrictTile key={index}
                              css={[districtSize(district.name === DistrictName.Jail), index === districtResolved && resolvingStyle]}
                              district={district}
                              phase={phase}
                              prince={prince}                         
                />
            
            )}

        </div>

    )

}

const resolvingStyle = css`
outline:red 0.5em solid;
`

const districtSize = (isJail:boolean) => css`
width:${isJail ? 17.6 : 12.6}%;
height:100%;
box-shadow: 0em 0em 0.2em 0.1em black;
`


const cityStyle = css`
display:flex;
flex-direction:row;
justify-content:center;
`

export default City