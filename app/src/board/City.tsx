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
import { ResetSelectedPatrol, resetSelectedPatrolMove } from "../localMoves/SetSelectedPatrol";
import PatrolInHand from "@gamepark/brigands/types/PatrolInHand";


type Props = {
    city:District[]
    phase:Phase | undefined
    prince:PrinceState
    districtResolved:number|undefined
    nbPlayers:number
    partnersOfPlayerId?:Partner[]
    isPlayerReady?:boolean
    selectedPartner?:number
    selectedPatrol?:PatrolInHand

} & HTMLAttributes<HTMLDivElement>

const City : FC<Props> = ({city, phase, prince, districtResolved, nbPlayers, partnersOfPlayerId, isPlayerReady, selectedPartner, selectedPatrol, ...props}) => {

    const play = usePlay<Move>()
    const playResetSelectPartner = usePlay<ResetSelectedPartner>()
    const playResetSelectPatrol = usePlay<ResetSelectedPatrol>()
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

    function playPlacePatrol(district:DistrictName){
        if (selectedPatrol !== undefined && selectedPatrol.index !== undefined){
            if (district === DistrictName.Jail){
                play({
                    type:MoveType.JudgePrisoners                    
                })
            } else {
                play({
                    type:MoveType.PlacePatrol,
                    district,
                    patrolNumber:selectedPatrol.index,
                })
            }
            playResetSelectPatrol(resetSelectedPatrolMove(), {local:true})
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
                              selectedPatrol={selectedPatrol}
                              onClick={() => playerId === PlayerRole.Prince 
                                ? phase === Phase.Patrolling && selectedPatrol !== undefined && !prince.patrols.includes(district.name) && (selectedPatrol.index === 2 ? district.name !== DistrictName.Jail : true ) && playPlacePatrol(district.name) 
                                : playerId !== undefined && district.name !== DistrictName.Jail && playPlacePartner(selectedPartner, district.name)}
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