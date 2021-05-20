/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";
import District from "./District";

type Props = {
    city:number[]
} & HTMLAttributes<HTMLDivElement>

const City : FC<Props> = ({city, ...props}) => {

    return(

        <div {...props} css={cityStyle}>

            {city.map((district, index) => 
            
                <District key={index}
                          css={districtSize(district === 0)}
                          district={district}/>
            
            )}

        </div>

    )

}

const districtSize = (isJail:boolean) => css`
width:${isJail ? 17.6 : 12.6}%;
height:100%;
box-shadow: 0em 0em 0.2em 0.1em black;
`


const cityStyle = css`
display:flex;
flex-direction:row;
justify-content:center;
`

export default City