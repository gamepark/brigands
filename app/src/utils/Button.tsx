/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ButtonHTMLAttributes, FC} from 'react'
import {getPlayerColor} from '../board/ThiefPanel'

type Props = {
  pRole?: PlayerRole
}

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & Props> = ({children, pRole, ...props}) => {
  return <button css={style(getPlayerColor(pRole === undefined ? PlayerRole.Prince : pRole))} {...props}><span
    css={spanBorder(pRole || PlayerRole.Prince)}> {children}</span></button>
}


const style = (color: string) => css`
  ${color === '#FFFFFF' ? ` background-color: #f0c89b` : `background-color: ${color !== '#49cf00' ? color : '#61a420'};`}
  padding: 0.2em 0.4em;
  display: inline-block;
  -webkit-transform: translate(0%, 0%);
  transform: translate(0%, 0%);
  cursor: pointer;
  overflow: hidden;
  color: black;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  ${color === '#FFFFFF' ? `box-shadow: 0 0 0.1em rgba(0,0,0,0.8) inset, 0em 0.2em 0.1em rgba(0, 0, 0, 1);` : `box-shadow: 0 0 0.1em rgba(255,255,255,0.8) inset, 0em 0.2em 0.1em rgba(0, 0, 0, 1);`};
  outline: 0;
  border-style: none;
  border-radius: 0.5em;

  &:active {
    box-shadow: 0 0 0.1em white inset;
    margin-top: 0.15em;
  }

`

const spanBorder = (color: PlayerRole) => css`
  ${isDarkColor(color) ? `color:white;` : `color:black;`};
  margin: 0 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${color === PlayerRole.Prince ? `border-top:0.1em solid black;` : `border-top:0.1em solid rgba(255,255,255,0.7);`};
  border-radius: 10%;
`

function isDarkColor(color: PlayerRole): boolean {
  return color === PlayerRole.PurpleThief || color === PlayerRole.RedThief || color === PlayerRole.BlueThief;
}

export default Button