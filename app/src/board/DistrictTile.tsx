import { css } from "@emotion/react"
import { PrinceState, ThiefState } from "@gamepark/brigands/PlayerState"
import District from "@gamepark/brigands/types/District"
import DistrictName from "@gamepark/brigands/types/DistrictName"
import Phase from "@gamepark/brigands/types/Phase"
import TokenAction from "@gamepark/brigands/types/TokenAction"
import { FC, HTMLAttributes } from "react"
import { useTranslation } from "react-i18next"
import Images from "../utils/Images"
import PartnerComponent from "./PartnerComponent"
import PatrolToken from "./PatrolToken"
import {decomposeGold, getCoin} from './PrincePanel'
import ThiefToken from "./ThiefToken"

/** @jsxImportSource @emotion/react */

type Props = {
    district:District
    prince:PrinceState
    thieves:ThiefState[]
    phase:Phase | undefined
} & HTMLAttributes<HTMLDivElement>

const DistrictTile : FC<Props> = ({district, prince, thieves, phase, ...props}) => {

    const {t} = useTranslation()

    return(

        <div {...props} css={districtStyle(getDistrictImage(district.name))}>

            {district.gold !== undefined 
            && <div css={goldOnTreasureDisplay}>
                
                    {            
                        decomposeGold(district.gold).map((coin, index) =>
                        [...Array(coin)].map((c, index2) => <img key={index2+"_"+index} alt={t('Coin')} src={getCoin(index)} css={coinPosition(index, index2)} draggable={false} />)
                    )}

               </div>
            }

            {(phase === Phase.Patrolling || phase === Phase.ThiefArrival || phase === Phase.Solving) 
                && prince.patrols.findIndex(d => d === district.name) !== -1 && <PatrolToken css={patrolPosition} isMercenary = {prince.patrols.findIndex(d => d === district.name) === 2} />
            }

            {(phase === Phase.ThiefArrival || phase === Phase.Solving) 
                && <div css={partnerDisplay}>
                    
                    {thieves.map((thief, indexT) => 
                        thief.partner.map((partner, indexP) =>
                            partner.position === district.name && 
                                <PartnerComponent key={indexT+'_'+indexP}
                                                css = {partnerSize}
                                                role={thief.role}
                                />
                        )    
                    )}
                    
                    </div>
            }

            {(phase === Phase.ThiefArrival || phase === Phase.Solving) && district.name !== DistrictName.Jail
                && <div css={thiefTokensDisplay}>
                    
                    {thieves.map((thief, indexTh) => 
                        thief.tokens.steal.map((token, indexTo) => 
                            token === district.name && <ThiefToken key={indexTh+'_'+indexTo} 
                                                        css={tokenSize}
                                                        action = {TokenAction.Stealing}
                                                        role = {thief.role}     
                            />
                        )
                    )}

                    {thieves.map((thief, indexTh) => 
                        thief.tokens.kick.map((token, indexTo) => 
                            token === district.name && <ThiefToken key={indexTh+'_'+indexTo} 
                                                        css={tokenSize}
                                                        action = {TokenAction.Kicking}
                                                        role = {thief.role}     
                            />
                        )
                    )}

                    {thieves.map((thief, indexTh) => 
                        thief.tokens.move.map((token, indexTo) => 
                            token === district.name && <ThiefToken key={indexTh+'_'+indexTo} 
                                                        css={tokenSize}
                                                        action = {TokenAction.Fleeing}
                                                        role = {thief.role}     
                            />
                        )
                    )}
                    
                    </div>
            }

            

        </div>

    )

}

const tokenSize = css`
width:50%;
height:100%;
margin:0em -1.8em;
`

const thiefTokensDisplay = css`
position:absolute;
width:55%;
height:20%;
top:75%;
left:40%;

display:flex;
flex-direction:row;
justify-content:center;
`

const partnerDisplay = css`
position:relative;
width:90%;
height:60%;
top:15%;
left:5%;

display:flex;
flex-direction:row;
justify-content:center;
flex-wrap:wrap;
`

const partnerSize = css`
width:16%;
height:25%;
`

const patrolPosition = css`
position:relative;
top:70%;
left:0%;
width:30%;
height:30%;
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
            return Images.districtPalace
        default :
            return 'error : no BG'
    }
}

export default DistrictTile