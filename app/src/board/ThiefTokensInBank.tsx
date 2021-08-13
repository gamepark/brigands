/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { isThiefState, PrinceState, ThiefState } from "@gamepark/brigands/PlayerState";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import Phase from "@gamepark/brigands/phases/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { ThiefView } from "@gamepark/brigands/types/Thief";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import ThiefToken from "./ThiefToken";
import { getGlowingPlayerColor, glowingBrigand } from "./PanelPlayer";
import { isPartner, isPartnerView } from "@gamepark/brigands/types/Partner";
import { EventArray } from "@gamepark/brigands/material/Events";
import { isThisPartnerHasAnyToken } from "@gamepark/brigands/Brigands";
import SetSelectedTokensInBank, { setSelectedTokensInBankMove } from "../localMoves/SetSelectedTokensInBank";
import ThiefTokenInBank from "@gamepark/brigands/types/ThiefTokenInBank";

type Props = {
    players:(ThiefState | ThiefView)[]
    prince:PrinceState
    phase?:Phase
    resolvedDistrict?:DistrictName
    event:number
    selectedTokensInBank?:ThiefTokenInBank[]
} & HTMLAttributes<HTMLDivElement>

const ThiefTokensInBank : FC<Props> = ({players, prince, phase, resolvedDistrict, event, selectedTokensInBank, ...props}) => {

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

    function tokenCanBeClicked(districtResolved:DistrictName|undefined, player:ThiefState|ThiefView, event:number, selectedTokens:ThiefTokenInBank[] | undefined, tokenClicked:TokenAction, indexToken:number, players:(ThiefState | ThiefView)[]):boolean{
        if(districtResolved === undefined || (districtResolved !== DistrictName.Harbor && districtResolved !== DistrictName.Jail)) return false
        else {
            if (districtResolved === DistrictName.Harbor){
                const maxToken = EventArray[event].district === DistrictName.Harbor ? 3 : 2
                const firstPartner = player.partners.find(part => isPartner(part) && part.district === resolvedDistrict)
                if (firstPartner !== undefined){
                    if (selectedTokens === undefined) return true
                    else {
                        const tokensAlreadyTaken = firstPartner.tokensTaken === undefined ? 0 : firstPartner.tokensTaken
                        if (selectedTokens.length === maxToken - tokensAlreadyTaken){
                            return selectedTokens.find(tok => tok.tokenAction === tokenClicked && tok.index === indexToken) !== undefined
                        } else if (selectedTokens.length < maxToken - tokensAlreadyTaken){
                            return true
                        } else {
                            return false
                        }
                    }

                } else return false

            } else {
                const partnersJailed = player.partners.filter(part => isPartner(part) && part.district === DistrictName.Jail)
                const tokensToTake = partnersJailed.length
                if (partnersJailed.some(part => part.solvingDone !== true)) return false
                else {
                    if (partnersJailed.filter(part => part.tokensTaken === 1).length === tokensToTake){
                        return selectedTokens !== undefined && selectedTokens.find(tok => tok.tokenAction === tokenClicked && tok.index === indexToken) !== undefined
                    } else if (partnersJailed.filter(part => part.tokensTaken === 1).length < tokensToTake){
                        const tokensAlreadyTaken = partnersJailed.filter(part => part.tokensTaken === 1).length
                        const tokensAlreadySelected = selectedTokensInBank === undefined ? 0 : selectedTokensInBank.length
                        if (tokensAlreadyTaken + tokensAlreadySelected < tokensToTake){
                            return isThiefState(player) && canTakeTokenInJail(player, players)
                        } else {
                            return selectedTokensInBank !== undefined && selectedTokensInBank.find(tok => tok.tokenAction === tokenClicked && tok.index === indexToken) !== undefined

                        }
                    } 
                    else return false
                }
            }
        }
    }

    const playSelectToken = usePlay<SetSelectedTokensInBank>()

    return(

        <div {...props} css={bankFlex}>

        {players.map((player,indexP) =>

            <div css={[tokenPlayerDivPosition(indexP), playerId === undefined || playerId === PlayerRole.Prince ? swapJustifyContentToStart : swapJustifyContentToStart]} key={indexP}>
                {getArray(player.tokens.kick).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, player.role === playerId && selectedTokensInBank !== undefined && selectedTokensInBank.find(tok => tok.tokenAction === TokenAction.Kicking && tok.index === indexT) && isSelected , isDraggable(phase,resolvedDistrict, player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    css={preserve}
                                    role={player.role}
                                    draggable={isDraggable(phase,resolvedDistrict, player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Kicking}}
                                    onClick = {() => phase === Phase.Solving && player.role === playerId && tokenCanBeClicked(resolvedDistrict, player, event, selectedTokensInBank, TokenAction.Kicking, indexT, players) && playSelectToken(setSelectedTokensInBankMove(TokenAction.Kicking, indexT), {local:true})}

                        />
                        
                    </div>
                )}
                {getArray(player.tokens.move).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, player.role === playerId && selectedTokensInBank !== undefined && selectedTokensInBank.find(tok => tok.tokenAction === TokenAction.Fleeing && tok.index === indexT) && isSelected , isDraggable(phase,resolvedDistrict, player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    css={preserve}
                                    role={player.role}
                                    draggable={isDraggable(phase, resolvedDistrict, player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Fleeing}}
                                    onClick = {() => phase === Phase.Solving && player.role === playerId && tokenCanBeClicked(resolvedDistrict, player, event, selectedTokensInBank, TokenAction.Fleeing, indexT, players) && playSelectToken(setSelectedTokensInBankMove(TokenAction.Fleeing, indexT), {local:true})}

                        />
                    </div>
                )}
                {getArray(player.tokens.steal).map((_, indexT) => 
                    <div key={indexT} css={[tokenSize, player.role === playerId && selectedTokensInBank !== undefined && selectedTokensInBank.find(tok => tok.tokenAction === TokenAction.Stealing && tok.index === indexT) && isSelected ,isDraggable(phase,resolvedDistrict, player.role, players) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    css={preserve}
                                    role={player.role}
                                    draggable={isDraggable(phase, resolvedDistrict, player.role, players)}
                                    type={'ThiefTokenInBank'}
                                    draggableItem={{tokenAction:TokenAction.Stealing}}
                                    onClick = {() => phase === Phase.Solving && player.role === playerId && tokenCanBeClicked(resolvedDistrict, player, event, selectedTokensInBank, TokenAction.Stealing, indexT, players) && playSelectToken(setSelectedTokensInBankMove(TokenAction.Stealing, indexT), {local:true})}
                        />
                    </div>
                )}
            </div>
            
        )}

        </div>

    )
}

const preserve = css`
transform-style:preserve-3d;
transform:translateZ(0em);
`

const isSelected = css`
transform:translateZ(2em) translateX(-4em);
transition:transform 0.2s linear;
`

const bankFlex = css`
display:flex;
flex-direction:row;
justify-content:start;
transform-style:preserve-3d;

`

const tokenSize = css`
height:15%;
width:100%;
margin:-0.4em 0em;
transition:transform 0.2s linear;
transform-style:preserve-3d;

`

const tokenPlayerDivPosition = (player:number) => css`
margin : 0.5em 1em;
height:100%;
width:10%;
display:flex;
flex-direction:column;
justify-content:start;
transform-style:preserve-3d;

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