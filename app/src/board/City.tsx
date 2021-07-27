/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { PrinceState } from "@gamepark/brigands/PlayerState";
import District from "@gamepark/brigands/districts/District";
import Partner from "@gamepark/brigands/types/Partner";
import Phase from "@gamepark/brigands/phases/Phase";
import { FC, HTMLAttributes } from "react";
import DistrictTile from "./DistrictTile";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { ResetSelectedPartner, resetSelectedPartnerMove } from "../localMoves/SetSelectedPartner";


type Props = {
    city:District[]
    phase:Phase | undefined
    prince:PrinceState
    districtResolved:number|undefined
    nbPlayers:number
    partnersOfPlayerId?:Partner[]
    isPlayerReady?:boolean
    selectedPartner?:number

} & HTMLAttributes<HTMLDivElement>

const City : FC<Props> = ({city, phase, prince, districtResolved, nbPlayers, partnersOfPlayerId, isPlayerReady, selectedPartner, ...props}) => {

    const play = usePlay<Move>()
    const playResetSelectPartner = usePlay<ResetSelectedPartner>()
    const playerId = usePlayerId<PlayerRole>()


    function playPlacePartner(selectedPartner:number | undefined, district:DistrictName){
        if (selectedPartner !== undefined && playerId){
            play({
                type:MoveType.PlacePartner,
                district,
                partnerNumber:selectedPartner,
                playerId
            })
            playResetSelectPartner(resetSelectedPartnerMove(), {local:true})
        }
    }

    return(

        <div {...props} css={cityStyle}>

            {city.map((district, index) => 
            
                <DistrictTile key={index}
                              css={[districtSize]}
                              district={district}
                              phase={phase}
                              prince={prince}   
                              nbPlayers={nbPlayers}
                              nbPartners={partnersOfPlayerId ? partnersOfPlayerId.filter(part => part.district === district.name).length : undefined}
                              isPlayerReady={isPlayerReady}
                              isDistrictNotResolved = {districtResolved !== undefined ? districtResolved !== index : undefined}
                              
                              selectedPartner={selectedPartner}
                              onClick={() => district.name !== DistrictName.Jail && playPlacePartner(selectedPartner, district.name)}
                />
            
            )}

        </div>

    )

}

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