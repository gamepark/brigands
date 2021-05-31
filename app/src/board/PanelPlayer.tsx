/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getPlayerName } from "@gamepark/brigands/BrigandsOptions";
import {ThiefState} from "@gamepark/brigands/PlayerState";
import District from "@gamepark/brigands/types/District";
import DistrictName from "@gamepark/brigands/types/DistrictName";
import { getPartnersView, isPartnerView } from "@gamepark/brigands/types/Partner";
import Phase from "@gamepark/brigands/types/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { ThiefView , isNotThiefView} from "@gamepark/brigands/types/Thief";
import Token from "@gamepark/brigands/types/Token";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { usePlayer, usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import AvatarPanel from "./AvatarPanel";
import DistrictCard from "./DistrictCard";
import PartnerComponent from "./PartnerComponent";
import ThiefToken from "./ThiefToken";

type Props = {
    player:ThiefState | ThiefView
    phase:Phase | undefined
    positionForPartners:number
    city:District[]
    numberOfThieves:number
} & HTMLAttributes<HTMLDivElement>

const PanelPlayer : FC<Props> = ({player, phase, positionForPartners, city, numberOfThieves, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const playerInfo = usePlayer(player.role)
    const {t} = useTranslation()

    console.log('getPartnerView de', player.role, " : ", player.partner)

    const partnersView = isNotThiefView(player) ? phase !== Phase.Solving ? getPartnersView(player.partner) : player.partner : player.partner 
    const cardsPlayed = partnersView.filter(isPartnerView).length === 0 ? 0 : Math.max(...partnersView.filter(isPartnerView).map(partner => partner.card))+1

    console.log(cardsPlayed)

    return(

        <>

        <div {...props} css={[panelPlayerStyle(getPlayerColor(player.role))]}>


            <AvatarPanel playerInfo={playerInfo} role={player.role} />
            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
            <div css={tempoTimer}> 00:00 </div>            {/*<PlayerTimer playerId={player.role} css={[timerStyle]}/>*/}
            <div css={goldZonePosition}>

                {isNotThiefView(player) && <div css={goldPanel}><p> Gold : {player.gold}</p></div>}

            </div>

            <div css={tokenDivPosition}>
                {player.tokens.kick.map((token, index) => 
                    token === -1 && <div key={index} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    role={player.role}
                        />
                    </div>
                )}
                {player.tokens.move.map((token, index) => 
                    token === -1 && <div key={index} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    role={player.role}
                        />
                    </div>
                )}
                {player.tokens.steal.map((token, index) => 
                    token === -1 && <div key={index} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    role={player.role}
                        />
                    </div>
                )}
            </div>

            {(phase === Phase.Planning || phase === Phase.Patrolling) && <div css={cardsPanelPosition}>

                {[...Array(cardsPlayed)].map((_,index) => <DistrictCard key={index}
                                                                        color={player.role}
                />)}

              

            </div>}

        </div>

        {partnersView.map((partner, index) => 
            <PartnerComponent key={index}
                              css={[partnerSize,
                                    phase !== Phase.Solving 
                                        ? isPartnerView(partner) 
                                            ? cardsPlayed === 1 
                                                ? partnerOnOnlyCard(positionForPartners, index, numberOfThieves)
                                                : cardsPlayed === 2
                                                    ? partnerOnOneOfTwoCards(positionForPartners, index, partner.card, numberOfThieves)
                                                    : partnerOnOneOfThreeCards(positionForPartners, index, partner.card, numberOfThieves)
                                            : partnerHandPosition(positionForPartners, index, numberOfThieves)           // Precise if Jail or Hand with partner.district
                                        : !isPartnerView(partner)
                                            ? partner.district === undefined
                                                ? partnerHandPosition(positionForPartners, index, numberOfThieves)
                                                : onCity(positionForPartners, index, city.findIndex(d => d.name === partner.district), playerId === PlayerRole.Prince ? -1.85 : 1)
                                            : test
                                ]}
                              role={player.role}
                              partnerNumber={index}
                              tokens={player.tokens}
                              phase={phase}
                              
            />
        )}   
                
        </>

        

    )

}

const onCity = (positionForPartners:number, index:number, district:number, prince:number) => css`
top:${prince*(-80)+index*8}%;
left:${9.5+district*12.6+positionForPartners*2}%;
`

const test = css`top:-50%;`

const partnerOnOneOfThreeCards = (positionForPartners:number, index:number, card:number, nbThieves:number) => css`
top:${76}%;
${nbThieves === 5 && `left:${2.5+card*5.2+positionForPartners*20}%;`}
${nbThieves === 4 && `left:${5.1+card*5.2+positionForPartners*25}%;`}
${nbThieves === 3 && `left:${9.2+card*5.2+positionForPartners*33.4}%;`}
${nbThieves === 2 && `left:${17.6+card*5.2+positionForPartners*50}%;`}
`

const partnerOnOneOfTwoCards = (positionForPartners:number, index:number, card:number, nbThieves:number) => css`
top:${76+index*15}%;
${nbThieves === 5 && `left:${4.2+card*7+positionForPartners*20}%;`} 
${nbThieves === 4 && `left:${6.7+card*7+positionForPartners*25}%;`} 
${nbThieves === 3 && `left:${10.8+card*7+positionForPartners*33.4}%;`} 
${nbThieves === 2 && `left:${19.3+card*7+positionForPartners*50}%;`} 
`

const partnerOnOnlyCard = (positionForPartners:number, index:number, nbThieves:number) => css`
top:${76+index*15}%;
${nbThieves === 5 && `left:${7.8+positionForPartners*20}%;`} 
${nbThieves === 4 && `left:${10.3+positionForPartners*25}%;`} 
${nbThieves === 3 && `left:${14.4+positionForPartners*33.4}%;`} 
${nbThieves === 2 && `left:${22.8+positionForPartners*50}%;`} 
`

const partnerHandPosition = (positionForPartners:number, index:number, nbThieves:number) => css`
    top:${18}%;
    ${nbThieves === 5 && `left:${10.5+positionForPartners*20+index*2.5}%;`}
    ${nbThieves === 4 && `left:${12.5+positionForPartners*25+index*2.5}%;`}
    ${nbThieves === 3 && `left:${16.5+positionForPartners*33.5+index*2.5}%;`}
    ${nbThieves === 2 && `left:${25+positionForPartners*50+index*2.5}%;`}
`

const cardsPanelPosition = css`
position:relative;
top:0%;
left:5%;
width:90%;
height:50%;
display:flex;
flex-direction:row;
justify-content:space-evenly;

`

const goldPanel = css`
height:100%;
width:50%;

p{
    font-size:2.5em;
    margin: 0.2em 0.5em;
    text-align:center;
}
`

const goldZonePosition = css`
height:15%;
margin: 1em 0.2em 0.2em 0.2em;
display:flex;
flex-direction:row;
justify-content:center;
`

const partnerSize = css`
position:absolute;
width:3.5em;
height:3.5em;
`

const nameStyle = css`
    font-size:2.5em;
    font-family:'Mulish', sans-serif;
    margin : 0.2em 1em;
`

const timerStyle = css`
    display: block;
    font-size: 2.5em;
    padding-top: 0.2em;
`

const tempoTimer = css`
    display: block;
    font-size: 2.4em;
    padding-top: 0.2em;
`

const tokenDivPosition = css`
    margin : 1em 0.5em 0.5em 0.7em;
    height:20%;
    display:flex;
    flex-direction:row;
    justify-content:space-around;
`

const tokenSize = css`
height:100%;
width:15%;
`


const panelPlayerStyle = (color:string) => css`
border:0.5em solid ${color};
border-radius:10%;
`

function getTokenActionArray(tokens:Token, district:DistrictName):TokenAction[]{
    const result:TokenAction[] = []
    tokens.steal.forEach(token => {
        if (token === district){result.push(TokenAction.Stealing)}
    })
    tokens.kick.forEach(token => {
        if (token === district){result.push(TokenAction.Kicking)}
    })
    tokens.move.forEach(token => {
        if (token === district){result.push(TokenAction.Fleeing)}
    })
    return result
}

export function getPlayerColor(role:PlayerRole):string{
    switch(role){
        case PlayerRole.BlueThief :
            return '#0090ff'
        case PlayerRole.GreenThief :
            return '#49cf00'
        case PlayerRole.PurpleThief :
            return '#a100fe'
        case PlayerRole.RedThief :
            return '#fe0000'
        case PlayerRole.YellowThief :
            return '#fea500'
        default :
            return '#FFFFFF'
    }
}

export default PanelPlayer