/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {isThisPartnerHasKickToken, isThisPartnerHasMoveToken} from '@gamepark/brigands/Brigands'
import {getPlayerName} from '@gamepark/brigands/BrigandsOptions'
import BetGold, {isBetGold} from '@gamepark/brigands/moves/BetGold'
import GainGold, {isGainGold} from '@gamepark/brigands/moves/GainGold'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import {isThief, isThiefState, ThiefState} from '@gamepark/brigands/PlayerState'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import Partner, {getPartnersView, isPartnerView} from '@gamepark/brigands/types/Partner'
import Phase from '@gamepark/brigands/phases/Phase'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ThiefView} from '@gamepark/brigands/types/Thief'
import TokenAction from '@gamepark/brigands/types/TokenAction'
import {useAnimation, usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {FC, HTMLAttributes} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import Button from '../utils/Button'
import Images from '../utils/Images'
import ThiefTokenInBank from '../utils/ThiefTokenInBank'
import AvatarPanel from './AvatarPanel'
import DistrictCard from './DistrictCard'
import PartnerComponent from './PartnerComponent'
import {decomposeGold, getCoin} from './PrincePanel'
import ThiefToken from './ThiefToken'

type Props = {
    player:ThiefState | ThiefView
    thieves:(ThiefState | ThiefView)[] 
    phase:Phase | undefined
    positionForPartners:number
    city:District[]
    numberOfThieves:number
    districtResolved?:District
    partnersForCards?:Partner[]

} & HTMLAttributes<HTMLDivElement>

const PanelPlayer : FC<Props> = ({player, phase, positionForPartners, city, numberOfThieves, districtResolved, thieves, partnersForCards, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const thiefId = playerId !== PlayerRole.Prince && thieves.find(p => p.role === playerId)!
    const playerInfo = usePlayer(player.role)
    const {t} = useTranslation()

    const animationBetGold = useAnimation<BetGold>(animation => isBetGold(animation.move))
    const animationGainGold = useAnimation<GainGold>(animation => isGainGold(animation.move))

    const partnersView = isThiefState(player) ? phase !== Phase.Solving ? getPartnersView(player.partners) : player.partners : player.partners
    const cardsPlayed = partnersView.filter(isPartnerView).length === 0 ? 0 : Math.max(...partnersView.filter(isPartnerView).map(partner => partner.card))+1

    function isPartnerDraggable(phase:Phase | undefined, role:PlayerRole):boolean{
        return phase === Phase.Planning && role === playerId && player.isReady !== true
    }

    function isTokenDraggable(phase:Phase | undefined, role:PlayerRole):boolean{
        return phase === Phase.Planning && role === playerId && player.isReady !== true
    }

    const play = usePlay<Move>()

    const [{canDrop, isOver}, dropRef] = useDrop({
        accept: ["ThiefTokenInBank"],
        canDrop: (item: ThiefTokenInBank) => {
            return playerId === player.role   
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        }),
        drop: (item: ThiefTokenInBank) => {
            return {type:MoveType.TakeToken,role:playerId, token:item.tokenAction}
        }
      })

    return(

        <>

        <div {...props} ref={dropRef} css={[panelPlayerStyle(getPlayerColor(player.role)), canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>

            

            <AvatarPanel playerInfo={playerInfo} role={player.role} />
            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
            <div css={tempoTimer}> 00:00 </div>            {/*<PlayerTimer playerId={player.role} css={[timerStyle]}/>*/}
            <div css={goldZonePosition}>

                {isThiefState(player) && <div css={goldPanel}><p> Gold : {player.gold}</p></div>}

            </div>

            <div css={tokenDivPosition}>
                {player.tokens.kick.map((token, index) => 
                    token === -1 && <div key={index} css={[tokenSize, isTokenDraggable(phase, player.role) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    role={player.role}
                                    draggable={isTokenDraggable(phase, player.role)}
                                    type={"ThiefTokenInHand"}
                                    draggableItem={{tokenAction:TokenAction.Kicking}}
                        />
                    </div>
                )}
                {player.tokens.move.map((token, index) => 
                    token === -1 && <div key={index} css={[tokenSize, isTokenDraggable(phase, player.role) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    role={player.role}
                                    draggable={isTokenDraggable(phase, player.role)}
                                    type={"ThiefTokenInHand"}
                                    draggableItem={{tokenAction:TokenAction.Fleeing}}
                        />
                    </div>
                )}
                {player.tokens.steal.map((token, index) => 
                    token === -1 && <div key={index} css={[tokenSize, isTokenDraggable(phase, player.role) && glowingBrigand(getGlowingPlayerColor(player.role))]}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    role={player.role}
                                    draggable={isTokenDraggable(phase, player.role)}
                                    type={"ThiefTokenInHand"}
                                    draggableItem={{tokenAction:TokenAction.Stealing}}
                        />
                    </div>
                )}
            </div>

            {phase === Phase.Solving && thiefId !== false && isThiefState(thiefId) && thiefId.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasKickToken(thiefId, index) && part.kickOrNot === undefined)
            && (player.partners as Partner[]).some(part => part.district === districtResolved!.name && player.role !== playerId)
            && <Button css={[kickThisPlayerButtonPosition]} onClick={() => play({type:MoveType.KickOrNot, kickerRole:thiefId.role, playerToKick:player.role})}>{t("Kick")}</Button>
            }  

            {(phase === Phase.Planning || phase === Phase.Patrolling) && <div css={cardsPanelPosition}>

                {[...Array(cardsPlayed)].map((_,index) => <DistrictCard key={index}
                                                                        color={player.role}
                                                                        district={partnersForCards && getUniquePartnersDistrict(partnersForCards)[index]}
                />)}

            </div>}

        {animationGainGold && (animationGainGold.move.thief === player.role)
            && decomposeGold(animationGainGold.move.gold).map((coin, index) =>
                [...Array(coin)].map((_, index2) => <img key={index2+"_"+index} alt={t('Coin')} src={getCoin(index)} css={[coinPosition(index, index2), gainGoldAnimation(animationGainGold.duration)]} draggable={false} />))
        }

        </div>

        {partnersView.map((partner, index) => 
            <PartnerComponent key={index}
                              css={[partnerSize,
                                (!isPartnerView(partner) ? partner.district !== DistrictName.Jail && isPartnerDraggable(phase,player.role) : isPartnerDraggable(phase,player.role)) && glowingBrigand(getGlowingPlayerColor(player.role)),
                                    phase !== Phase.Solving 
                                        ? isPartnerView(partner) 
                                            ? cardsPlayed === 1 
                                                ? partnerOnOnlyCard(positionForPartners, index, numberOfThieves)
                                                : cardsPlayed === 2
                                                    ? partnerOnOneOfTwoCards(positionForPartners, index, partner.card, numberOfThieves)
                                                    : partnerOnOneOfThreeCards(positionForPartners, index, partner.card, numberOfThieves)
                                            : partner.district === DistrictName.Jail
                                                ? onCity(positionForPartners, index, city.findIndex(d => d.name === partner.district), (playerId === PlayerRole.Prince || playerId === undefined) ? -1.32 : 1)
                                                : partnerHandPosition(positionForPartners, index, numberOfThieves)        
                                        : isPartnerView(partner)
                                            ? test
                                            : partner.district === undefined
                                                ? partnerHandPosition(positionForPartners, index, numberOfThieves)
                                                : onCity(positionForPartners, index, city.findIndex(d => d.name === partner.district), (playerId === PlayerRole.Prince || playerId == undefined) ? -1.32 : 1)
                                     
                                            ]}
                              role={player.role}
                              partners = {player.partners}
                              partnerNumber={index}
                              tokens={player.tokens}
                              phase={phase}

                              draggable={!isPartnerView(partner) ? partner.district !== DistrictName.Jail && isPartnerDraggable(phase,player.role) : isPartnerDraggable(phase,player.role)}
                              type={"PartnerInHand"}
                              draggableItem={{partnerNumber:index}}
                              
            />
        )}

        {player.role === playerId && phase === Phase.Planning && player.isReady === false && player.partners.every(part => !isPartnerView(part) && part.district !== undefined)
        && <Button css={[validationButtonPosition]} onClick={() => play({type:MoveType.TellYouAreReady, playerId:player.role})}>{t('Validate')}</Button>
        }   

        {player.role === playerId && phase === Phase.Solving && isThiefState(player) && player.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasMoveToken(player, index))
        && thieves.every(p => isThief(p) && p.partners.every((part, index) => !isPartnerView(part) && part.district !== districtResolved!.name || !isThisPartnerHasKickToken(p, index)))
        &&  <div>
                <Button css={[moveButtonPosition]} onClick={() => play({type:MoveType.MovePartner, role:player.role, runner:player.role})}>{t('Move')}</Button>
                <Button css={[dontMoveButtonPosition]} onClick={() => play({type:MoveType.MovePartner, role:false, runner:player.role})}>{t("Don't Move")}</Button>
            </div>
        }  

        {player.role === playerId && thiefId !== false && phase === Phase.Solving && isThiefState(player) && player.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasKickToken(player, index) && part.kickOrNot === undefined)
        &&  <div>
                <Button css={[dontMoveButtonPosition]} onClick={() => play({type:MoveType.KickOrNot, kickerRole:thiefId.role, playerToKick:false})}>{t("Don't Kick")}</Button>
            </div>
        }  

        {animationBetGold && (animationBetGold.move.role === player.role
        && <div css={[betStyle(animationBetGold.move.gold), betSize, betPositionPlayer(positionForPartners), betGoldAnimation(animationBetGold.duration)]}> </div>)
        } 

        </>

    )

}

function getUniquePartnersDistrict(partnersForCards:Partner[]):DistrictName[]{
    const result:DistrictName[] = []
    for(const elem of partnersForCards){
        if(elem.district){result.push(elem.district)} 
    }
    return [...new Set(result)].filter(d => d !==DistrictName.Jail)
}

export const glowingColoredKeyframes = (color:string) => keyframes`
    0% {
        filter:drop-shadow(0 0 0.8em ${color});
    }
    80%, 100% {
        filter:drop-shadow(0 0 0.2em ${color});
    }
`

export const glowingBrigand = (color:string) => css`
    animation: ${glowingColoredKeyframes(color)} 1s infinite alternate;
`

const gainGoldKeyFrames = keyframes`
from{opacity:1; transform:translateZ(200em);}
80%{opacity:1; transform:translateZ(0em);}
to{opacity:0; transform:translateZ(0em);}
`

const gainGoldAnimation = (duration:number) => css`
animation: ${gainGoldKeyFrames} ${duration}s ;
`

const coinPosition = (index1:number, index2:number) => css`
position:relative;
top:${-30+index2}%;
left:${15+index1*-10}%;
width:25%;
height:30%;
border-radius: 100%;
box-shadow: 0 0 1em 0.2em black;

`

const betGoldKeyFrames = keyframes`
from{opacity:1;
}
80%{
    top:-165%;
    left:88%; 
    opacity:1;
}
to {
    top:-165%;
    left:88%;
    opacity:0;
}
`

const betGoldAnimation = (duration:number) => css`
animation: ${betGoldKeyFrames} ${duration}s ease-in;
`

const betStyle = (gold:number) => css`
${gold === 1 && `
background: center center / 70% no-repeat url(${Images.coin1})`}
${gold === 2 && `
background: center bottom / 70% no-repeat url(${Images.coin1}), center top / 70% no-repeat url(${Images.coin1})`}
${gold === 3 && `
background: center bottom / 70% no-repeat url(${Images.coin1}), center top / 85% no-repeat url(${Images.coin2})`}
${gold === 4 && `
background: center bottom / 85% no-repeat url(${Images.coin2}), center top / 85% no-repeat url(${Images.coin2})`}
${gold === 5 && `
background: center center / 100% no-repeat url(${Images.coin5})`}
`

const betPositionPlayer = (position:number) => css`
position:absolute;
top:50%;
left:${13+position*20}%;
`

const betPositionDice = css`
position:absolute;
top:-165%;
left:88%;
`

const betSize = css`
width:5%;
height:40%;
`

const transitionPartner = css`
transition:top 1s ease-in-out, left 1s ease-in-out;
`

const kickThisPlayerButtonPosition = css`
font-size:3em;
text-align:center;
margin:0 3em;
`

const canDropStyle = css`
background-color:rgba(0,0,0,0.5);
transition : background-color 0.5s linear;
`

const isOverStyle = css`
background-color:rgba(0,0,0,0.8);
transition : background-color 0.5s linear;
`

const moveButtonPosition = css`
    position:absolute;
    width:15%;
    height:25%;
    top:-137%;
    right:20%;
    font-size:3em;
`

const dontMoveButtonPosition = css`
    position:absolute;
    width:15%;
    height:25%;
    top:-137%;
    right:4%;
    font-size:3em;
`

const validationButtonPosition = css`
    position:absolute;
    width:15%;
    height:25%;
    top:-136%;
    right:17.5%;
    font-size:4em;
`

const onCity = (positionForPartners:number, index:number, district:number, prince:number) => css`
top:${prince*(-100)+index*8}%;
left:${1.0+district*12.5+positionForPartners*2}%;

${transitionPartner};
`

const test = css`top:-50%;`

const partnerOnOneOfThreeCards = (positionForPartners:number, index:number, card:number, nbThieves:number) => css`
top:${76}%;
${nbThieves === 5 && `left:${2.5+card*5.2+positionForPartners*20}%;`}
${nbThieves === 4 && `left:${5.1+card*5.2+positionForPartners*25}%;`}
${nbThieves === 3 && `left:${9.2+card*5.2+positionForPartners*33.4}%;`}
${nbThieves === 2 && `left:${17.6+card*5.2+positionForPartners*50}%;`}

${transitionPartner};
`

const partnerOnOneOfTwoCards = (positionForPartners:number, index:number, card:number, nbThieves:number) => css`
top:${76+index*15}%;
${nbThieves === 5 && `left:${4.2+card*7+positionForPartners*20}%;`} 
${nbThieves === 4 && `left:${6.7+card*7+positionForPartners*25}%;`} 
${nbThieves === 3 && `left:${10.8+card*7+positionForPartners*33.4}%;`} 
${nbThieves === 2 && `left:${19.3+card*7+positionForPartners*50}%;`}

${transitionPartner};
`

const partnerOnOnlyCard = (positionForPartners:number, index:number, nbThieves:number) => css`
top:${76+index*15}%;
${nbThieves === 5 && `left:${7.8+positionForPartners*20}%;`} 
${nbThieves === 4 && `left:${10.3+positionForPartners*25}%;`} 
${nbThieves === 3 && `left:${14.4+positionForPartners*33.4}%;`} 
${nbThieves === 2 && `left:${22.8+positionForPartners*50}%;`} 

${transitionPartner};
`

const partnerHandPosition = (positionForPartners:number, index:number, nbThieves:number) => css`
    top:${18}%;
    ${nbThieves === 5 && `left:${10.5+positionForPartners*20+index*2.5}%;`}
    ${nbThieves === 4 && `left:${12.5+positionForPartners*25+index*2.5}%;`}
    ${nbThieves === 3 && `left:${16.5+positionForPartners*33.5+index*2.5}%;`}
    ${nbThieves === 2 && `left:${25+positionForPartners*50+index*2.5}%;`}

    ${transitionPartner};
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
width:60%;

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
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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

export function getGlowingPlayerColor(role:PlayerRole):string{
    switch(role){
        case PlayerRole.BlueThief :
            return '#00c5e3'
        case PlayerRole.GreenThief :
            return '#5dff05'
        case PlayerRole.PurpleThief :
            return '#ff00ff'
        case PlayerRole.RedThief :
            return '#ff2626'
        case PlayerRole.YellowThief :
            return '#fef100'
        default :
            return '#FFFFFF'
    }
}

export default PanelPlayer