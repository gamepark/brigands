/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { isThisPartnerHasAnyToken } from "@gamepark/brigands/Brigands";
import DistrictName from "@gamepark/brigands/districts/DistrictName";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import { isRevealPartnersDistrict, RevealPartnersDistrictsView } from "@gamepark/brigands/moves/RevealPartnersDistricts";
import { ThiefState } from "@gamepark/brigands/PlayerState";
import Partner from "@gamepark/brigands/types/Partner";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { ThiefView } from "@gamepark/brigands/types/Thief";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { useAnimation, usePlay, usePlayerId } from "@gamepark/react-client";
import { FC } from "react";
import { useDrop } from "react-dnd";
import { ResetSelectedTokenInHand, resetSelectedTokenInHandMove } from "../localMoves/SetSelectedTokenInHand";
import ThiefTokenInHand from "../utils/ThiefTokenInHand";
import Images from "../utils/Images";

type Props = {
    district?:DistrictName
    thief:ThiefState | ThiefView
    color:PlayerRole
    partners?:Partner[]
    selectedTokenInHand?:ThiefTokenInHand
}

const DistrictCard : FC<Props> = ({district, thief, color, partners, selectedTokenInHand}) => {

    const playerId = usePlayerId<PlayerRole>()
    const play = usePlay<Move>()
    const indexOfFirstPartnerOnDistrict:number | undefined = partners !== undefined ? partners.findIndex((part, index) => part.district === district && !isThisPartnerHasAnyToken(thief, index)) : undefined

    const [{canDrop, isOver}, dropRef] = useDrop({
        accept: ["ThiefTokenInHand"],
        canDrop: (item: ThiefTokenInHand) => {
            return playerId === color 
            && partners !== undefined 
            && indexOfFirstPartnerOnDistrict !== undefined && indexOfFirstPartnerOnDistrict !== -1
            && Object.keys(partners[indexOfFirstPartnerOnDistrict]).length !== 0 
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        }),
        drop: (item: ThiefTokenInHand) => {
            return {type:MoveType.PlaceToken,role:playerId, tokenAction:item.tokenAction, partnerNumber:indexOfFirstPartnerOnDistrict}
        }
      })

    const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()

    function playPlaceToken(partnerNumber:number, role:PlayerRole, tokenAction:TokenAction){
            play({
                type:MoveType.PlaceToken,
                partnerNumber,
                role,
                tokenAction
            })
            playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local:true})
    }

    function canDropSelected():boolean{
        return playerId === color 
        && partners !== undefined 
        && indexOfFirstPartnerOnDistrict !== undefined && indexOfFirstPartnerOnDistrict !== -1
        && Object.keys(partners[indexOfFirstPartnerOnDistrict]).length !== 0 
        && selectedTokenInHand !== undefined

    }

    const revealPartnersAnimation = useAnimation<RevealPartnersDistrictsView>(animation => isRevealPartnersDistrict(animation.move))

        return(
        <div css={[cardSize]}>

        {(canDrop || canDropSelected()) && color === playerId && <div 
            ref={dropRef} 
            css={[fullSize, canDropSelected() && canDropSelectedStyle, canDrop && canDropStyle , canDrop && isOver && isOverStyle]}
            onClick={() => thief.role === playerId && selectedTokenInHand !== undefined && indexOfFirstPartnerOnDistrict !== undefined && indexOfFirstPartnerOnDistrict !== -1 && playPlaceToken(indexOfFirstPartnerOnDistrict, thief.role, selectedTokenInHand.tokenAction)} >↓</div>}

            <div css = {[back, districtCardBackStyle(getCardBG(undefined), getSeal(color)), revealPartnersAnimation && rotateCardBackAnimation(revealPartnersAnimation.duration)]}></div>
            <div css = {[front, districtCardFrontStyle(getCardBG(district), getSeal(color)), revealPartnersAnimation && rotateCardFrontAnimation(revealPartnersAnimation.duration)]}></div>
        </div>
    )
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

const fullSize = css`
width:31%;
height:100%;
font-size:7em;
text-align:center;
position:absolute;
`

const canDropStyle = css`
border:white solid 0.08em;
background-color:rgba(0,0,0,0.0);
transition : background-color 0.5s ease-in-out, border 0.5s ease-in-out;
`

const canDropSelectedStyle = css`
border:white solid 0.08em;
background-color:rgba(0,0,0,0.0);
transition : background-color 0.5s ease-in-out, border 0.5s ease-in-out;
cursor:pointer;
:hover{
    border:white solid 0.08em;
    background-color:rgba(0,0,0,0.7);
    transition : background-color 0.5s ease-in-out, border 0.5s ease-in-out;
}
`

const isOverStyle = css`
border:white solid 0.08em;
background-color:rgba(0,0,0,0.7);
transition : background-color 0.5s ease-in-out, border 0.5s ease-in-out;
;
`

const rotateCardFrontKeyFrames = keyframes`
    from{}
    25%{transform:translateY(-10em) translateZ(0em) rotateY(-180deg)}
    50%{transform:translateY(-10em) translateZ(0em) rotateY(0deg);}
    75%{transform:translateY(0em) rotateY(0deg);}
    to{transform:translateY(0em) rotateY(0deg);}
`

const rotateCardBackKeyFrames = keyframes`
    from{}
    25%{transform:translateY(-10em) translateZ(0em)}
    50%{transform:translateY(-10em) translateZ(0em) rotateY(180deg);}
    75%{transform:translateY(0em)  rotateY(180deg);}
    to{transform:translateY(0em)  rotateY(180deg);}
`

const rotateCardFrontAnimation = (duration:number) => css`
animation:${rotateCardFrontKeyFrames} ${duration}s ease-in-out;
`

const rotateCardBackAnimation = (duration:number) => css`
animation:${rotateCardBackKeyFrames} ${duration}s ease-in-out;
`

const front = css`
transform:rotateY(-180deg);
backface-visibility:hidden;
position: relative;
top: -100%;
`

const back = css`
backface-visibility:hidden;
`

const districtCardBackStyle = (back:string, seal:string) => css`
background: center / 50% no-repeat url(${seal}),center / contain no-repeat url(${back});
width:100%;
height:100%;
box-shadow: 0 0 1em 0.2em black;
`

const districtCardFrontStyle = (front:string, seal:string) => css`
background: center 10% / 40% no-repeat url(${seal}),center / contain no-repeat url(${front});
width:100%;
height:100%;
box-shadow: 0 0 1em 0.2em black;
`

const cardSize = css`
width:31%;
height:100%;
`

function getCardBG(district?:DistrictName):string{

    if (district === undefined){
        return Images.cardBack
    } 

    switch (district){
        case DistrictName.CityHall :
            return Images.cardCityHall
        case DistrictName.Harbor :
            return Images.cardHarbor
        case DistrictName.Market :
            return Images.cardMarket
        case DistrictName.Palace :
            return Images.cardPalace
        case DistrictName.Tavern :
            return Images.cardTavern
        case DistrictName.Treasure :
            return Images.cardTreasure
        case DistrictName.Convoy :
            return Images.cardConvoy
        default :
            return 'error : jail detected'  
    }
}

function getSeal(color:PlayerRole):string{
    switch (color){
        case PlayerRole.GreenThief:
            return Images.sealGreen
        case PlayerRole.BlueThief:
            return Images.sealBlue
        case PlayerRole.RedThief:
            return Images.sealRed
        case PlayerRole.PurpleThief:
            return Images.sealPurple
        case PlayerRole.YellowThief:
            return Images.sealYellow
        default:
            return 'error : no seal'
    }    
}

export default DistrictCard