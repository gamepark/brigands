import { css } from "@emotion/react"
import MoveType from "@gamepark/brigands/moves/MoveType"
import { PrinceState } from "@gamepark/brigands/PlayerState"
import District from "@gamepark/brigands/districts/District"
import DistrictName from "@gamepark/brigands/districts/DistrictName"
import Phase from "@gamepark/brigands/phases/Phase"
import PlayerRole from "@gamepark/brigands/types/PlayerRole"
import { usePlayerId } from "@gamepark/react-client"
import { FC, HTMLAttributes } from "react"
import { useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"
import PartnerInHand, { isPartnerInHand } from "../utils/PartnerInHand"
import PatrolInHand, { isPatrolInHand } from "../utils/PatrolInHand"
import Images from "../utils/Images"
import {decomposeGold, getCoin} from './PrincePanel'
import HeadStartToken from "src/utils/HeadStartToken"

/** @jsxImportSource @emotion/react */

type Props = {
    district:District
    prince:PrinceState
    phase:Phase | undefined
    nbPlayers:number
    nbPartners?:number
    isPlayerReady?:boolean

} & HTMLAttributes<HTMLDivElement>

const DistrictTile : FC<Props> = ({district, prince, phase, nbPlayers, nbPartners, isPlayerReady, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const {t} = useTranslation()

    const [{canDrop, isOver}, dropRef] = useDrop({
        accept: ["PartnerInHand","PatrolInHand", "HeadStartToken"],
        canDrop: (item: PartnerInHand | PatrolInHand | HeadStartToken) => {
            if(isPatrolInHand(item)){
                if (item.patrolNumber !== 2){
                    return !prince.patrols.includes(district.name)
                } else {
                    return district.name !== DistrictName.Jail && !prince.patrols.includes(district.name)
                }
                
            } else if (isPartnerInHand(item)){
                return district.name !== DistrictName.Jail
            } else {
                return prince.patrols.includes(district.name) && district.name !== DistrictName.Jail
            }
            
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        }),
        drop: (item: PartnerInHand | PatrolInHand | HeadStartToken) => {
            if (isPatrolInHand(item)){
                return district.name === DistrictName.Jail ? {type:MoveType.JudgePrisoners} : {type:MoveType.PlacePatrol,patrolNumber:item.patrolNumber, district:district.name}
            } else if (isPartnerInHand(item)){
                return {type:MoveType.PlacePartner, playerId, district:district.name, partnerNumber:item.partnerNumber}
            } else {
                return {type:MoveType.PlayHeadStart, district:district.name}
            }
        }
      })

    return(

        <div {...props} ref={dropRef} css={[districtStyle(getDistrictImage(district.name, nbPlayers))]}>

            <div css={[dropSize, canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>

                {phase === Phase.Planning && district.name !== DistrictName.Jail && playerId !== PlayerRole.Prince && playerId !== undefined &&
                    [...Array(nbPartners)].map((_,i) => <img key={i} alt={t('temporary partner')} src={Images.partnerGrey} draggable={false} css={[temporaryPartnerPosition(i), isPlayerReady === true && blurEffect]} /> )
                }

                {district.gold !== undefined 
                && <div css={goldOnTreasureDisplay}> 
                    
                        {            
                            decomposeGold(district.gold).map((coin, index) =>
                            [...Array(coin)].map((_, index2) => <img key={index2+"_"+index} alt={t('Coin')} src={getCoin(index)} css={coinPosition(index, index2)} draggable={false} />)
                        )}

                </div>
                }

            </div>
            
        </div>

    )

}

const blurEffect = css`
filter:blur(10em);
transition:filter 1s ease-in;
`

const temporaryPartnerPosition = (index:number) => css`
position:absolute;
top:20%;
left:${20+index*20}%;
height:20%;
transition:filter 1s ease-in;
z-index:1;
`

const dropSize = css`
width:100%;
height:100%;
position:absolute;
`

const titleDistrictStyle = css`
text-align:center;
font-size:2.5em;
margin:0.2em 0 ;
color:black;
`

const canDropStyle = css`
background-color:rgba(255,255,255,0.2);
`

const isOverStyle = css`
background-color:rgba(255,255,255,0.5);
`

const goldOnTreasureDisplay = css`
position:relative;
width:90%;
height:50%;
top:5%;
left:5%;
`

const coinPosition = (firstI:number, secondI:number) => css`
position:absolute;
top:${25+25*firstI}%;
left:${10+10*secondI}%;
width:${30-firstI*2.75}%;
height:${55-firstI*5}%;

border-radius: 100%;
box-shadow: 0 0 1em 0.2em black;
`

const districtStyle = (image:string) => css`
    position:relative;

    background-image: url(${image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
`

function getDistrictImage(district:number, nbPlayers:number):string{
    switch (district){
        case 1 :
             return Images.districtJail
        case 2 : 
            return Images.districtTavern
        case 3 :
            return Images.districtMarket
        case 4 :
            return Images.districtHarbor
        case 5 : 
            return Images.districtCityHall
        case 6 : 
            return Images.districtTreasure
        case 7 : 
            return nbPlayers < 4 ? Images.districtPalace1 : Images.districtPalace2
        case 8 : 
            return nbPlayers < 5 ? Images.districtConvoy1 : Images.districtConvoy2
        default :
            return 'error : no BG'
    }
}

function getDistrictName(district:number):string{
    switch(district){
        case 1:
            return "Jail"
        case 2:
            return "Tavern"
        case 3:
            return "Market"
        case 4:
            return "Harbor"
        case 5:
            return "CityHall"
        case 6:
            return "Treasure"
        case 7:
            return "Palace"
        case 8:
            return "Convoy"
        default:
            return 'error:no District Name !'
    }
}

export default DistrictTile