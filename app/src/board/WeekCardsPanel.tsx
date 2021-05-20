/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";

type Props = {
    event:number
    eventDeck:number
} & HTMLAttributes<HTMLDivElement>

const WeekCardsPanel : FC<Props> = ({event, eventDeck, ...props}) => {

    return (

        <div {...props} css={weekCardsPanelStyle}>

            <div css={[]}></div>

            <div></div>

        </div>

    )

}
const weekCardsPanelStyle = css`
background-color:blue;
`

export default WeekCardsPanel