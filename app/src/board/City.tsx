/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { PrinceState } from "@gamepark/brigands/PlayerState";
import District from "@gamepark/brigands/districts/District";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import Partner from "@gamepark/brigands/types/Partner";
import Phase from "@gamepark/brigands/phases/Phase";
import { FC, HTMLAttributes } from "react";
import DistrictTile from "./DistrictTile";


type Props = {
    city:District[]
    phase:Phase | undefined
    prince:PrinceState
    districtResolved:number|undefined
    nbPlayers:number
    partnersOfPlayerId?:Partner[]

} & HTMLAttributes<HTMLDivElement>

const City : FC<Props> = ({city, phase, prince, districtResolved, nbPlayers, partnersOfPlayerId, ...props}) => {

    return(

        <div {...props} css={cityStyle}>

            {city.map((district, index) => 
            
                <DistrictTile key={index}
                              css={[districtSize, index === districtResolved && resolvingStyle]}
                              district={district}
                              phase={phase}
                              prince={prince}   
                              nbPlayers={nbPlayers}
                              nbPartners={partnersOfPlayerId ? partnersOfPlayerId.filter(part => part.district === district.name).length : undefined}

                />
            
            )}

        </div>

    )

}

const resolvingStyle = css`
outline:red 0.5em solid;
`

const districtSize = css`
width:11.3%;
height:100%;
margin: 0 0.25em;
box-shadow: 0em 0em 0.3em 0.15em black;
`


const cityStyle = css`
display:flex;
flex-direction:row;
justify-content:center;
`

export default City