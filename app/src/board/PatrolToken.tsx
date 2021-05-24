/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    isMercenary:boolean
} & HTMLAttributes<HTMLDivElement>

const PatrolToken : FC<Props> = ({isMercenary, ...props}) => {
    return(
        <div {...props} css={patrolTokenStyle(isMercenary === true ? Images.mercenary : Images.patrol)}>

            
        </div>
    )
}

const patrolTokenStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
width:100%;
height:100%;
`

export default PatrolToken