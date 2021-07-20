/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tutorial, useActions, useFailures, usePlayerId} from "@gamepark/react-client";
import {TFunction} from "i18next";
import {FC, useEffect, useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import Arrow from "../tutorial/tutorial-arrow-grey.png"
import GameView from "@gamepark/brigands/GameView";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import Move from "@gamepark/brigands/moves/Move";
import Button from "../utils/Button";


const TutorialPopup : FC<{game:GameView, tutorial:Tutorial}> = ({game, tutorial}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerRole>()
    const actions = useActions<Move, PlayerRole>()
    const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
    const previousActionNumber = useRef(actionsNumber)
    const [tutorialIndex, setTutorialIndex] = useState(0)
    const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
    const [failures] = useFailures()
    const [hideLastTurnInfo, setHideLastTurnInfo] = useState(false)
    const [hideThirdTurnInfo, setHideThirdTurnInfo] = useState(false)
    const [hideEndInfo, setHideEndInfo] = useState(false)

    const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
    const discordUri = 'https://discord.gg/nMSDRag'

    const moveTutorial = (deltaMessage: number) => {
      setTutorialIndex(tutorialIndex + deltaMessage)
      setTutorialDisplay(true)
    }


    
    const resetTutorialDisplay = () => {
      if (game.phase !== undefined){
        if (game.eventDeck === 2){
          setHideThirdTurnInfo(false)
        } else if (game.eventDeck === 0){
          setHideLastTurnInfo(false)
        } else {
          setTutorialIndex(0)
          setTutorialDisplay(true)
        }

      } else {
        setHideEndInfo(false)
      }

    }

    const tutorialMessage = (index: number) => {
        let currentStep = actionsNumber
        while (!tutorialDescription[currentStep]) {
          currentStep--
        }
        return tutorialDescription[currentStep][index]
      }

      useEffect(() => {
        if (previousActionNumber.current > actionsNumber) {
          setTutorialDisplay(false)
        } else if (tutorialDescription[actionsNumber]) {
          resetTutorialDisplay()
        }
        previousActionNumber.current = actionsNumber
      }, [actionsNumber])

    useEffect(() => {
      if (failures.length) {
        setTutorialIndex(tutorialDescription[actionsNumber].length - 1)  
        setTutorialDisplay(true)
        }
    }, [actionsNumber, failures])


    useEffect(() => {
        console.log("actionNumber : ", actionsNumber)
        if (actionsNumber === 4){
            console.log("dans le useEffect")
            tutorial.playNextMoves(3)
        }
    }, [actionsNumber])

    const currentMessage = tutorialMessage(tutorialIndex)

    const displayPopup = tutorialDisplay && currentMessage && !failures.length

    return (
        <>

        <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90), style]}
            onClick={() => setTutorialDisplay(false)}>

            <div css={[popupStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
                onClick={event => event.stopPropagation()}>

              <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>

              {currentMessage && <h2>{currentMessage.title(t)}</h2>}
              {currentMessage && <p> <Trans defaults={currentMessage.text} components={[<strong/>]} /> </p>}
              {tutorialIndex > 0 && <Button css={buttonTutoStyle} pRole={PlayerRole.YellowThief} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
              <Button css={buttonTutoStyle} pRole={PlayerRole.YellowThief} onClick={() => moveTutorial(1)}>{t('OK')}</Button>

            </div>

        </div>

        {
        !displayPopup && 
        <Button css={[buttonTutoStyle, resetStyle]} pRole={PlayerRole.YellowThief} onClick={() => resetTutorialDisplay()}>{t('Show Tutorial')}</Button>
      }

        {
          currentMessage && currentMessage.arrow &&
          <img alt='Arrow pointing toward current tutorial interest' src={Arrow} draggable="false"
               css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
        }

        {
          game.phase === undefined && !hideEndInfo &&
          <div css={[popupStyle, endStyle, popupPosition(tutorialEndGame)]}>
            <div css={closePopupStyle} onClick={() => setHideEndInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
            <h2 css={textEndStyle} >{tutorialEndGame.title(t)}</h2>
            <p css={textEndStyle} >{t(tutorialEndGame.text)}</p>
            <Button css={buttonTutoStyle} onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
            <Button css={buttonTutoStyle} onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
            <Button onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
          </div>
        }

        </>
    )

}

export function resetTutorial() {
  localStorage.removeItem('brigands')
  window.location.reload()
}

export const hidePopupStyle = css`
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`

export const hidePopupOverlayStyle = (boxTop: number, boxLeft: number) => css`
  top: ${boxTop}%;
  left: ${boxLeft}%;
  width: 0;
  height: 0;
  overflow: hidden;
`

const buttonTutoStyle = css`
width:5em;
height:1.5em;
margin-right: 1em;
`

const endStyle = css`
background: url();
`

const textEndStyle = css`
color: white;
`

const popupOverlayStyle = css`
  position: absolute;
  transform: translateZ(30em);
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  transition: all .5s ease;
`
const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const popupStyle = css`
  position: absolute;
  text-align: center;
  z-index : 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border:1em black solid;
  background: url();
  background-color: rgba(254,165,0,0.8);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
  color:black;
  font-family: 'Mulish', sans-serif;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%; 
    border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:hover{
      box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,0.5);
    }
  & > h2 {
    position:relative;
    font-size: 5em;
    margin:0 1em;
  }
  & > p {
    position:relative;
    text-align: center;
    font-size: 3.5em;
    white-space: break-spaces;

    strong {
      font-weight:bold;
    }

  }
  & > button {
    font-size: 3.5em;
  }
`

const style = css`
  background-color: transparent;
`

const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;
  color:white;
  &:hover{
    cursor: pointer;
    color: black;
  }
`

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  width: ${boxWidth}%;
  top: ${boxTop}%;
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'}) translateZ(30em);
`

const arrowStyle = (angle: number) => css`
  position: absolute;
  transform: rotate(${angle}deg) translateZ(30em);
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
`

const showArrowStyle = (top: number, left: number) => css`
  top: ${top}%;
  left: ${left}%;
  width: 20%;
`

const hideArrowStyle = css`
  top: 90%;
  left: 90%;
  width: 0;
`

const resetStyle = css`
  position: absolute;
  text-align: center;
  bottom: 36.5%;
  right: 1%;
  font-size: 3em;
`

type TutorialStepDescription = {
    title: (t: TFunction) => string
    text: string
    boxTop: number
    boxLeft: number
    boxWidth: number
    arrow?: {
      angle: number
      top: number
      left: number
    }
  }

const tutorialDescription:TutorialStepDescription[][] = [
    [
        {
          title: (t: TFunction) => t('title.welcome'),
          text: 'tuto.welcome',
          boxTop: 40,
          boxLeft: 50,
          boxWidth: 60
        },
        {
          title: (t: TFunction) => t('title.your.thief'),
          text: 'tuto.your.thief',
          boxTop: 78,
          boxLeft: 42,
          boxWidth: 50,
          arrow: {
            angle: 270,
            top: 72,
            left: 5
          }
        },
        {
            title: (t: TFunction) => t('title.opponents'),
            text: 'tuto.your.opponents',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50
        },
        {
            title: (t: TFunction) => t('title.asymetric.game'),
            text: 'tuto.asymetric.game',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50
        },
        {
            title: (t: TFunction) => t('title.wincon.thief'),
            text: 'tuto.wincon.thief',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
              }
        },
        {
            title: (t: TFunction) => t('title.planning.phase'),
            text: 'tuto.planning.phase',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50
        },
        {
            title: (t: TFunction) => t('title.place.partner'),
            text: 'tuto.place.partner',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
              }
        }   
    ],
    [

        {
            title: (t: TFunction) => t('title.explain.district'),
            text: 'tuto.explain.district',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
              }
        },
        {
            title: (t: TFunction) => t('title.explain.shadow'),
            text: 'tuto.explain.shadow',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
              }
        }, 
        {
            title: (t: TFunction) => t('title.explain.card'),
            text: 'tuto.explain.card',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
              }
        },
        {
            title: (t: TFunction) => t('title.place.second.partner'),
            text: 'tuto.place.second.partner',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
              }
        }
      
    ],
    [
        {
            title: (t: TFunction) => t('title.place.third.partner'),
            text: 'tuto.place.third.partner',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 72,
                left: 5
            }
        }
    ],
    [
        {
            title: (t: TFunction) => t('title.place.explain.third.partner'),
            text: 'tuto.place.explain.third.partner',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50
        },
        {
            title: (t: TFunction) => t('title.validate'),
            text: 'tuto.validate',
            boxTop: 78,
            boxLeft: 42,
            boxWidth: 50
        },


    ]
]

const thirdTurnInfo = {
  title: (t: TFunction) => t('Two player game'),
  text: 'tuto.2.players',
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 70
}

const lastTurnInfo = {
  title: (t: TFunction) => t('Last Season'),
  text: "tuto.last.season",
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 70
}

const tutorialEndGame = {
  title: (t: TFunction) => t('Congratulations'),
  text: 'You have finished your first game! You can now play with your friends, or meet other players via our chat room on Discord.',
  boxTop: 29,
  boxLeft: 50,
  boxWidth: 80
}


export default TutorialPopup