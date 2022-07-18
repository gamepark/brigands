/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import ThrowDice, {isThrowDice} from '@gamepark/brigands/moves/ThrowDice'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {useAnimation, usePlayerId} from '@gamepark/react-client'
import {FC, HTMLAttributes} from 'react'
import Images from '../utils/Images'

type Props = {
  dice?: number[]
} & HTMLAttributes<HTMLDivElement>

const DicePopUp: FC<Props> = ({dice, ...props}) => {

  const playerId = usePlayerId<PlayerRole>()

  const diceAnimation = useAnimation<ThrowDice>(animation => isThrowDice(animation.move))

  return (

    <div {...props} css={[dicePopUpPosition(playerId === PlayerRole.Prince || playerId === undefined), dicePopUpSize]}>

      {dice !== undefined && dice.map((die, index) =>
        <div key={index} css={[dieSize, dieRotation, diceAnimation && dieRotationAnimation(getRandomRotation(), diceAnimation.duration)]}>
          <div css={[dieStyle(getDiceFaceTop(die)), topOrientation]}/>
          <div css={[dieStyle(getDiceFaceBottom(die)), bottomOrientation]}/>
          <div css={[dieStyle(getDiceFaceBehind(die)), behindOrientation]}/>
          <div css={[dieStyle(getDiceFaceFront(die)), frontOrientation]}/>
          <div css={[dieStyle(getDiceFaceLeft(die)), leftOrientation]}/>
          <div css={[dieStyle(getDiceFaceRight(die)), rightOrientation]}/>
        </div>
      )}

    </div>

  )

}

const dicePopUpSize = css`
  width: 29%;
  height: 6%;
`

const dicePopUpPosition = (isPrinceView: boolean) => css`
  position: absolute;
  transform-style: preserve-3d;
  top: ${isPrinceView ? 90 : 32}%;
  left: 63%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const dieSize = css`
  position: relative;
  transform-style: preserve-3d;
  width: 10%;
  height: 90%;
`

const dieRotationKeyFrames = (rotationVector: number[]) => keyframes`
  from {
    transform: rotate3d(${rotationVector[0]}, ${rotationVector[1]}, ${rotationVector[2]}, ${rotationVector[3]}deg);
  }
  80% {
    transform: rotate3d(0, 0, 0, 0deg);
  }
  to {
    transform: rotate3d(0, 0, 0, 0deg);
  }
`

const dieRotationAnimation = (rotationVector: number[], duration: number) => css`
  animation: ${dieRotationKeyFrames(rotationVector)} ${duration}s ease-out;
`

const dieRotation = css`
  transform-origin: center center 2.7em;
  transform: rotate3d(0, 0, 0, 0deg);
`

const dieStyle = (face: string) => css`
  position: absolute;
  backface-visibility: visible;
  background-image: url(${face});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;

  width: 100%;
  height: 100%;
`

const topOrientation = css`
  transform: translateZ(5.3em);
`

const bottomOrientation = css`
  transform: rotateX(180deg);
`

const leftOrientation = css`
  transform: rotateY(-90deg);
  transform-origin: left;
`

const rightOrientation = css`
  transform: rotateY(90deg);
  transform-origin: right;
`

const behindOrientation = css`
  transform: rotateX(90deg);
  transform-origin: top;
`

const frontOrientation = css`
  transform: rotateX(-90deg);
  transform-origin: bottom;
`

function getDiceFaceTop(face: number): string {
  switch (face) {
    case 2:
      return Images.dice2
    case 3:
      return Images.dice3
    case 4:
      return Images.dice4
    default:
      return 'error : not a dice face'
  }
}

function getDiceFaceBottom(face: number): string {
  switch (face) {
    case 2:
      return Images.dice4
    case 3:
      return Images.dice3
    case 4:
      return Images.dice2
    default:
      return 'error : not a dice face'
  }
}

function getDiceFaceFront(face: number): string {
  switch (face) {
    case 2:
      return Images.dice3
    case 3:
      return Images.dice2
    case 4:
      return Images.dice3
    default:
      return 'error : not a dice face'
  }
}

function getDiceFaceBehind(face: number): string {
  switch (face) {
    case 2:
      return Images.dice3
    case 3:
      return Images.dice4
    case 4:
      return Images.dice3
    default:
      return 'error : not a dice face'
  }
}

function getDiceFaceRight(face: number): string {
  switch (face) {
    case 2:
      return Images.dice4
    case 3:
      return Images.dice4
    case 4:
      return Images.dice4
    default:
      return 'error : not a dice face'
  }
}

function getDiceFaceLeft(face: number): string {
  switch (face) {
    case 2:
      return Images.dice2
    case 3:
      return Images.dice2
    case 4:
      return Images.dice2
    default:
      return 'error : not a dice face'
  }
}

function getRandomRotation(): number[] {
  const maxvector: number = 10
  const minVector: number = -10

  return [Math.floor(Math.random() * (maxvector - minVector + 1)) + minVector,
    Math.floor(Math.random() * (maxvector - minVector + 1)) + minVector,
    Math.floor(Math.random() * (maxvector - minVector + 1)) + minVector,
    Math.floor(Math.random() * (3000 + 3000 + 1)) - 3000
  ]

}

export default DicePopUp