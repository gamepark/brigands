/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { PrinceState, ThiefState } from "@gamepark/brigands/PlayerState";
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
import { isThisPartnerHasAnyToken } from "@gamepark/brigands/Brigands";

type Props = {
    players:(ThiefState | ThiefView)[]
    prince:PrinceState
    phase?:Phase
    resolvedDistrict?:DistrictName
    event:number
} & HTMLAttributes<HTMLDivElement>

const ThiefTokensInBank : FC<Props> = ({players, prince, phase, resolvedDistrict, event, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()

    function isDraggable(phase:Phase | undefined, resolvedDistrict:DistrictName|undefined, playerRole:PlayerRole, players:(ThiefState|ThiefView)[]):boolean{

        return phase === Phase.Solving 
        && (resolvedDistrict === DistrictName.Harbor || resolvedDistrict === DistrictName.Jail) 
        && playerRole === playerId 
        && (canTakeTokenInHarbor(findThiefState(players, playerRole)) || canTakeTokenInJail(findThiefState(players, playerRole), players))
        && noTokenOnDistrict(players, resolvedDistrict)
        && noPatrolOnDistrict(resolvedDistrict, prince)

    }

    function noPatrolOnDistrict(district:DistrictName, prince:PrinceState):boolean{
        return prince.patrols.every(pat => pat !== district)
    }

    function noTokenOnDistrict(players:(ThiefState | ThiefView)[], district:DistrictName):boolean{
        return players.every(p => p.partners.every((part, index) => !isPartnerView(part) && (part.district !== district || !isThisPartnerHasAnyToken(p, index))))
    }

    function findThiefState(players:(ThiefState | ThiefView)[] , role:PlayerRole):ThiefState{
        return (players.find(p => p.role === role)! as ThiefState)
    }


    function canTakeTokenInHarbor(thief:ThiefState):boolean{
        return thief.partners.some(p => p.district === DistrictName.Harbor && (!p.tokensTaken || p.tokensTaken < (EventArray[event].district === DistrictName.Harbor ? 3 : 2)))
    }

    function canTakeTokenInJail(thief:ThiefState, players:(ThiefState | ThiefView)[]):boolean{
        return thief.partners.some(p => p.district === DistrictName.Jail 
                && p.tokensTaken === 0 && p.solvingDone === true 
                && players.every(player => player.partners.filter(part => !isPartnerView(part) 
                    && part.district === DistrictName.Jail).every(part => part.solvingDone === true))
            )
    }

    return(

        <div {...props} css={bankFlex}>

        {players.map((player,indexP) =>

            <div css={[tokenPlayerDivPosition(indexP), playerId === undefined || playerId === PlayerRole.Prince ? swapJustifyContentToStart : swapJustifyContentToStart]} key={indexP}>
                {getArray(player.tokens.kick).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, isDraggable(phase,resolvedDistrict, player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    role={player.role}
                                    draggable={isDraggable(phase,resolvedDistrict, player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Kicking}}

                        />
                    </div>
                )}
                {getArray(player.tokens.move).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, isDraggable(phase,resolvedDistrict, player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    role={player.role}
                                    draggable={isDraggable(phase, resolvedDistrict, player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Fleeing}}
                        />
                    </div>
                )}
                {getArray(player.tokens.steal).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, isDraggable(phase,resolvedDistrict, player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    role={player.role}
                                    draggable={isDraggable(phase, resolvedDistrict, player.role, players)}
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