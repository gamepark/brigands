/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getPlayerName } from "@gamepark/brigands/BrigandsOptions";
import PlayerState, {ThiefState} from "@gamepark/brigands/PlayerState";
import DistrictName from "@gamepark/brigands/types/DistrictName";
import Partner, { getPartnersView, isPartnerView, PartnerView } from "@gamepark/brigands/types/Partner";
import Phase from "@gamepark/brigands/types/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { ThiefView , isNotThiefView} from "@gamepark/brigands/types/Thief";
import Token from "@gamepark/brigands/types/Token";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { Player, PlayerTimer, usePlayer, usePlayerId } from "@gamepark/react-client";
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
} & HTMLAttributes<HTMLDivElement>

const PanelPlayer : FC<Props> = ({player, phase, positionForPartners, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const playerInfo = usePlayer(player.role)
    const {t} = useTranslation()

    console.log("Phase :", phase)
    console.log('getPartnerView de', player.role, " : ", player.partner)

    const partnersView = isNotThiefView(player) ? getPartnersView(player.partner) : player.partner 
    const cardsPlayed = Math.max(...partnersView.filter(isPartnerView).map(partner => partner.card))+1

    return(

        <>

        <div {...props} css={[panelPlayerStyle(getPlayerColor(player.role))]}>


            <AvatarPanel playerInfo={playerInfo} role={player.role} />
            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
            <div css={tempoTimer}> 00:00 </div>            {/*<PlayerTimer playerId={player.role} css={[timerStyle]}/>*/}
            <div css={partnerZonePosition}>

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
                                    isPartnerView(partner) 
                                        ? cardsPlayed === 1 
                                            ? partnerOnOnlyCard(positionForPartners, index)
                                            : cardsPlayed === 2
                                                ? partnerOnOneOfTwoCards(positionForPartners, index, partner.card)
                                                : partnerOnOneOfThreeCards(positionForPartners, index, partner.card)
                                        : partnerHandPosition(positionForPartners, index)           // Precise if Jail or Hand with partner.district
                                  ]}
                              role={player.role}
                              
            />
        )}   
                
        </>

        

    )

}

const test = css``

const partnerOnOneOfThreeCards = (positionForPartners:number, index:number, card:number) => css`
top:${76+index*15}%;
left:${2.5+card*5.2+positionForPartners*20}%;
`

const partnerOnOneOfTwoCards = (positionForPartners:number, index:number, card:number) => css`
top:${76+index*15}%;
left:${4.2+card*7+positionForPartners*20}%;
`

const partnerOnOnlyCard = (positionForPartners:number, index:number) => css`
top:${76+index*15}%;
left:${7.8+positionForPartners*20}%;
`

const partnerHandPosition = (positionForPartners:number, index:number) => css`
    top:${10+index*5}%;
    left:${positionForPartners*20+index*7.5}%;
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
width:40%;

p{
    font-size:2.5em;
    margin: 0.2em 0em;
    text-align:center;
}
`

const partnerZonePosition = css`
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