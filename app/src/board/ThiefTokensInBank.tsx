/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ThiefState } from "@gamepark/brigands/PlayerState";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import ThiefToken from "./ThiefToken";

type Props = {
    players:ThiefState[]
} & HTMLAttributes<HTMLDivElement>

const ThiefTokensInBank : FC<Props> = ({players, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()

    return(

        <div {...props} css={bankFlex}>

        {players.map((player,indexP) =>

            <div css={[tokenPlayerDivPosition(indexP), playerId === undefined || playerId === PlayerRole.Prince ? swapJustifyContentToStart : swapJustifyContentToEnd]} key={indexP}>
                {getArray(player.tokens.kick).map((token, indexT) => 
                    <div key={indexT} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Kicking}
                                    role={player.role}
                        />
                    </div>
                )}
                {getArray(player.tokens.move).map((token, indexT) => 
                    <div key={indexT} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Fleeing}
                                    role={player.role}
                        />
                    </div>
                )}
                {getArray(player.tokens.steal).map((token, indexT) => 
                    <div key={indexT} css={tokenSize}> 
                        <ThiefToken action={TokenAction.Stealing}
                                    role={player.role}
                        />
                    </div>
                )}
            </div>
            
        )}

        </div>

    )
}

const bankFlex = css`
display:flex;
flex-direction:row;
`

const tokenSize = css`
height:15%;
width:100%;
`

const tokenPlayerDivPosition = (player:number) => css`
margin : 0.5em 1em;
height:100%;
width:10%;
display:flex;
flex-direction:column;
justify-content:start;
`

const swapJustifyContentToEnd = css`
justify-content:end;
`

const swapJustifyContentToStart = css`
justify-content:start;
`

function getArray(array:number[]):number[]{
    if (array.length === 0){
        return [0,0]
    } else if (array.length === 1){
        return [0]
    } else {
        return []
    }
}

export default ThiefTokensInBank