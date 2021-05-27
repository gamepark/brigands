/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getPlayerName } from "@gamepark/brigands/BrigandsOptions";
import PlayerState, {ThiefState} from "@gamepark/brigands/PlayerState";
import DistrictName from "@gamepark/brigands/types/DistrictName";
import Phase from "@gamepark/brigands/types/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
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
    player:ThiefState
    phase:Phase | undefined
} & HTMLAttributes<HTMLDivElement>

const PanelPlayer : FC<Props> = ({player, phase, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const playerInfo = usePlayer(player.role)
    const {t} = useTranslation()

    console.log("Phase :", phase)

    return(

        <div {...props} css={[panelPlayerStyle(getPlayerColor(player.role))]}>


            <AvatarPanel playerInfo={playerInfo} role={player.role} />
            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
            <div css={tempoTimer}> 00:00 </div>            {/*<PlayerTimer playerId={player.role} css={[timerStyle]}/>*/}
            <div css={partnerZonePosition}>

                <div css={goldPanel}><p>Gold : {player.gold}</p></div>

                {player.partner.map((partner,index) => 
                    <div css={partnerSize} key={index}>
                        {partner.position === -1 && <PartnerComponent key={index}
                                                                      role={player.role} />}
                    </div>
                )}
                

            </div>

            <div css={tokenDivPosition}>
                {player.tokens.kick.map((token, index) => 
                    token === 0 && <div key={index} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    role={player.role}
                        />
                    </div>
                )}
                {player.tokens.move.map((token, index) => 
                    token === 0 && <div key={index} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    role={player.role}
                        />
                    </div>
                )}
                {player.tokens.steal.map((token, index) => 
                    token === 0 && <div key={index} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    role={player.role}
                        />
                    </div>
                )}
            </div>

            {(phase === Phase.Planning || phase === Phase.Patrolling) && <div css={cardsPanelPosition}>

                {player.partner.some(p => p.position === DistrictName.CityHall) 
                && <DistrictCard color={player.role}
                                 district={DistrictName.CityHall}
                                 nbPartner={player.partner.filter(p => p.position === DistrictName.CityHall).length}
                                 tokens={getTokenActionArray(player.tokens, DistrictName.CityHall)}
                />}

                {player.partner.some(p => p.position === DistrictName.Harbor) 
                && <DistrictCard color={player.role}
                                 district={DistrictName.Harbor}
                                 nbPartner={player.partner.filter(p => p.position === DistrictName.Harbor).length}
                                 tokens={getTokenActionArray(player.tokens, DistrictName.Harbor)}
                />}

                {player.partner.some(p => p.position === DistrictName.Market) 
                && <DistrictCard color={player.role}
                                 district={DistrictName.Market}
                                 nbPartner={player.partner.filter(p => p.position === DistrictName.Market).length}
                                 tokens={getTokenActionArray(player.tokens, DistrictName.Market)}
                />}

                {player.partner.some(p => p.position === DistrictName.Palace) 
                && <DistrictCard color={player.role}
                                 district={DistrictName.Palace}
                                 nbPartner={player.partner.filter(p => p.position === DistrictName.Palace).length}
                                 tokens={getTokenActionArray(player.tokens, DistrictName.Palace)}
                />}

                {player.partner.some(p => p.position === DistrictName.Treasure) 
                && <DistrictCard color={player.role}
                                 district={DistrictName.Treasure}
                                 nbPartner={player.partner.filter(p => p.position === DistrictName.Treasure).length}
                                 tokens={getTokenActionArray(player.tokens, DistrictName.Treasure)}
                />}

                {player.partner.some(p => p.position === DistrictName.Tavern) 
                && <DistrictCard color={player.role}
                                 district={DistrictName.Tavern}
                                 nbPartner={player.partner.filter(p => p.position === DistrictName.Tavern).length}
                                 tokens={getTokenActionArray(player.tokens, DistrictName.Tavern)}
                />}

            </div>}

        </div>

    )

}

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
width:20%;
height:100%;
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