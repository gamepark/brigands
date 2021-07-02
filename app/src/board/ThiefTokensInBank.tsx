/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ThiefState } from "@gamepark/brigands/PlayerState";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import Phase from "@gamepark/brigands/phases/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { ThiefView } from "@gamepark/brigands/types/Thief";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import ThiefToken from "./ThiefToken";
import { getGlowingPlayerColor, glowingBrigand } from "./PanelPlayer";
import { isPartnerView } from "@gamepark/brigands/types/Partner";
import { EventArray } from "@gamepark/brigands/material/Events";

type Props = {
    players:(ThiefState | ThiefView)[]
    phase?:Phase
    resolvedDistrict?:DistrictName
    event:number
} & HTMLAttributes<HTMLDivElement>

const ThiefTokensInBank : FC<Props> = ({players, phase, resolvedDistrict, event, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()

    function isDraggable(phase:Phase | undefined, isHarborOrJail:boolean, playerRole:PlayerRole, players:(ThiefState|ThiefView)[]):boolean{

        return phase === Phase.Solving && isHarborOrJail && playerRole === playerId && (players.find(p => p.role === playerRole)! as ThiefState).partners.some(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[event].district === DistrictName.Harbor ? 3 : 2)) || (p.district === DistrictName.Jail && p.tokensTaken === 0 && p.solvingDone === true && players.every(player => player.partners.filter(part => !isPartnerView(part) && part.district === DistrictName.Jail).every(part => part.solvingDone === true))))

    }

    return(

        <div {...props} css={bankFlex}>

        {players.map((player,indexP) =>

            <div css={[tokenPlayerDivPosition(indexP), playerId === undefined || playerId === PlayerRole.Prince ? swapJustifyContentToStart : swapJustifyContentToStart]} key={indexP}>
                {getArray(player.tokens.kick).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, isDraggable(phase,(resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail), player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    role={player.role}
                                    draggable={isDraggable(phase,(resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail), player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Kicking}}

                        />
                    </div>
                )}
                {getArray(player.tokens.move).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, isDraggable(phase,(resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail), player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    role={player.role}
                                    draggable={isDraggable(phase, (resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail), player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Fleeing}}
                        />
                    </div>
                )}
                {getArray(player.tokens.steal).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, isDraggable(phase,(resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail), player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    role={player.role}
                                    draggable={isDraggable(phase, (resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail), player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Stealing}}
                        />
                    </div>
                )}
            </div>
            
        )}

        </div>

    )
}

const bankFlex = css`
display:flex;
flex-direction:row;
justify-content:start;
`

const tokenSize = css`
height:15%;
width:100%;
margin:-0.4em 0em;
`

const tokenPlayerDivPosition = (player:number) => css`
margin : 0.5em 1em;
height:100%;
width:10%;
display:flex;
flex-direction:column;
justify-content:start;
`

const swapJustifyContentToEnd = css`
justify-content:end;
`

const swapJustifyContentToStart = css`
justify-content:start;
`

function getArray(array:number[]):number[]{
    if (array.length === 0){
        return [0,0]
    } else if (array.length === 1){
        return [0]
    } else {
        return []
    }
}

export default ThiefTokensInBank