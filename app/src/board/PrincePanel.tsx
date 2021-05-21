/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerState from "@gamepark/brigands/PlayerState";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    player:PlayerState
}  & HTMLAttributes<HTMLDivElement>

const PrincePanel : FC<Props> = ({player, ...props}) => {

    return(

        <div {...props} css={princePanelStyle}>

        </div>

    )

}

const princePanelStyle = css`
background-image: url(${Images.princePanel});
background-size: contain;
background-repeat: no-repeat;
background-position: top;

border:1px solid white;
`

export default PrincePanel