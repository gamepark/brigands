/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ButtonHTMLAttributes} from 'react'

type Props = {
  color: PlayerRole
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>

export default function HeaderButton({children, color, ...props}: Props) {
  return <button css={[style, buttonColor(color)]} {...props}>{children}</button>
}


const style = css`
  padding: 0 0.4em;
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
  outline: 0;
  border-style: none;
  border-radius: 0.5em;
`

const buttonColor = (color: PlayerRole) => css`
  background-color: ${buttonBackgroundColor[color]};
  color: ${color === PlayerRole.PurpleThief || color === PlayerRole.RedThief || color === PlayerRole.BlueThief ? 'white' : 'black'};
`

const buttonBackgroundColor: Record<PlayerRole, string> = {
  [PlayerRole.Prince]: '#f0c89b',
  [PlayerRole.GreenThief]: '#61a420',
  [PlayerRole.BlueThief]: '#0090ff',
  [PlayerRole.RedThief]: '#fe0000',
  [PlayerRole.PurpleThief]: '#a100fe',
  [PlayerRole.YellowThief]: '#fea500'
}