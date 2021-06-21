import { css } from "@emotion/react"
import MoveType from "@gamepark/brigands/moves/MoveType"
import { PrinceState } from "@gamepark/brigands/PlayerState"
import District from "@gamepark/brigands/types/District"
import DistrictName from "@gamepark/brigands/types/DistrictName"
import Phase from "@gamepark/brigands/types/Phase"
import PlayerRole from "@gamepark/brigands/types/PlayerRole"
import { usePlayerId } from "@gamepark/react-client"
import { FC, HTMLAttributes } from "react"
import { useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"
import PartnerInHand from "../utils/PartnerInHand"
import PatrolInHand, { isPatrolInHand } from "../utils/PatrolInHand"
import Images from "../utils/Images"
import {decomposeGold, getCoin} from './PrincePanel'

/** @jsxImportSource @emotion/react */

type Props = {
    district:District
    prince:PrinceState
    phase:Phase | undefined

} & HTMLAttributes<HTMLDivElement>

const DistrictTile : FC<Props> = ({district, prince, phase, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const {t} = useTranslation()

    const [{canDrop, isOver}, dropRef] = useDrop({
        accept: ["PartnerInHand","PatrolInHand"],
        canDrop: (item: PartnerInHand | PatrolInHand) => {
            if(isPatrolInHand(item)){
                return !prince.patrols.includes(district.name)
            } else {
                return district.name !== DistrictName.Jail
            }
            
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        }),
        drop: (item: PartnerInHand | PatrolInHand) => {
            if (isPatrolInHand(item)){
                return {type:MoveType.PlacePatrol,patrolNumber:item.patrolNumber, district:district.name}
            } else {
                return {type:MoveType.PlacePartner, playerId, district:district.name, partnerNumber:item.partnerNumber}
            }
        }
      })

    return(

        <div {...props} ref={dropRef} css={[districtStyle(getDistrictImage(district.name)), canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>

            {district.gold !== undefined 
            && <div css={goldOnTreasureDisplay}> 
                
                    {            
                        decomposeGold(district.gold).map((coin, index) =>
                        [...Array(coin)].map((_, index2) => <img key={index2+"_"+index} alt={t('Coin')} src={getCoin(index)} css={coinPosition(index, index2)} draggable={false} />)
                    )}

               </div>
            }
            
        </div>

    )

}

const canDropStyle = css`
border:0.5em gold solid;
transition : border 0.5s linear;
`

const isOverStyle = css`
border:1em gold solid;
transition : border 0.5s linear;
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
`

const districtStyle = (image:string) => css`
    position:relative;

    background-image: url(${image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
`

function getDistrictImage(district:number):string{
    switch (district){
        // case 1 :
        //     return Images.districtJail
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
            return Images.districtPalace
        default :
            return 'error : no BG'
    }
}

export default DistrictTile