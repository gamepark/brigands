/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tutorial, useActions, useFailures, usePlay, usePlayerId} from "@gamepark/react-client";
import {TFunction} from "i18next";
import {FC, useEffect, useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import Arrow from "../tutorial/tutorial-arrow-grey.png"
import GameView from "@gamepark/brigands/GameView";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import Move from "@gamepark/brigands/moves/Move";
import Button from "../utils/Button";
import MoveType from "@gamepark/brigands/moves/MoveType";


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
    const [hideFifthTurnInfo, setHideFifthTurnInfo] = useState(false)
    const [hideEndInfo, setHideEndInfo] = useState(false)

    const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
    const discordUri = 'https://discord.gg/nMSDRag'

    const play = usePlay<Move>()

    const moveTutorial = (deltaMessage: number) => {
      console.log("tutoIndex : ", tutorialIndex)
      console.log("AC : ", actions?.length)
      setTutorialIndex(tutorialIndex + deltaMessage)
      setTutorialDisplay(true)
      playMoves()
    }

    function playMoves():void{
      if (actions && actions.length === 47 && tutorialIndex === 0){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:7})
      }
      if (actions && actions.length === 46 && tutorialIndex === 0){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:6})
      }
      if (actions && actions.length === 45 && tutorialIndex === 0){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:5})
      }
      if (actions && actions.length === 40 && tutorialIndex === 1){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:3})
      }
      if (actions && actions.length === 39 && tutorialIndex === 6){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:2})
      }
      if (actions && actions.length === 38){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:1})
      }
      if (actions && actions.length === 37){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:0})
      }
      if (actions && actions.length === 36 && tutorialIndex === 6){
        tutorial.playNextMoves(1)
      }
      if (actions && actions.length === 34 && tutorialIndex === 3){
        tutorial.playNextMoves(2)
      }
      if (actions && actions.length === 33 && tutorialIndex === 2){
        tutorial.playNextMoves(1)
      }
      if (actions && actions.length === 22 && tutorialIndex === 1){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:7})
      }
      if (actions && actions.length === 20 && tutorialIndex === 4){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:6})
        tutorial.playNextMoves(1)
      }
      if (actions && actions.length === 19 && tutorialIndex === 1){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:5})
      }
      if (actions && actions.length === 18){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:4})
      }
      if (actions && actions.length === 17){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:3})
      }
      if (actions && actions.length === 16){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:2})
      }
      if (actions && actions.length === 12){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:1})
      }
      if (actions && actions.length === 11 && tutorialIndex === 6){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:0})
      }
      if (actions && actions.length === 10 && tutorialIndex === 4){
        tutorial.playNextMoves(1)
      } else if (actions && actions.length === 8){
        tutorial.playNextMoves(2)
      } else if (actions && actions.length === 7){
        tutorial.playNextMoves(1)
      } 
        
    }
    
    const resetTutorialDisplay = () => {
      if (game.phase !== undefined){
        if (game.eventDeck === 2){
          setHideFifthTurnInfo(false)
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
      if (game.eventDeck <=3){
        tutorial.setOpponentsPlayAutomatically(true)
      }

      if (actionsNumber === 27){
        play({type:MoveType.MoveOnDistrictResolved, districtResolved:4})
      }
      if (actionsNumber === 22){
        tutorial.playNextMoves(3)
      }
      if (actionsNumber === 4){
        tutorial.playNextMoves(3)
      }
    }, [actionsNumber, game.eventDeck])


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

        {game.eventDeck === 1 && !hideFifthTurnInfo &&
          <div css={[popupStyle, popupPosition(fifthTurnInfo)]}>
            <div css={closePopupStyle} onClick={() => setHideFifthTurnInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
            <h2>{fifthTurnInfo.title(t)}</h2>
            <p>{t(fifthTurnInfo.text)}</p>
            <Button css={buttonTutoStyle} pRole={PlayerRole.YellowThief} onClick={() => setHideFifthTurnInfo(true)}>{t('OK')}</Button>
          </div>
        }

        {
          game.eventDeck === 0 && !hideLastTurnInfo &&
          <div css={[popupStyle, popupPosition(lastTurnInfo)]}>
            <div css={closePopupStyle} onClick={() => setHideLastTurnInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
            <h2>{lastTurnInfo.title(t)}</h2>
            <p>{t(lastTurnInfo.text)}</p>
            <Button css={buttonTutoStyle} pRole={PlayerRole.YellowThief} onClick={() => setHideLastTurnInfo(true)}>{t('OK')}</Button>
          </div>
        }

        {
          game.phase === undefined && !hideEndInfo &&
          <div css={[popupStyle, popupPosition(tutorialEndGame)]}>
            <div css={closePopupStyle} onClick={() => setHideEndInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
            <h2 css={textEndStyle} >{tutorialEndGame.title(t)}</h2>
            <p css={textEndStyle} >{t(tutorialEndGame.text)}</p>
            <Button css={[buttonTutoStyle, endSize]} pRole={PlayerRole.YellowThief} onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
            <Button css={[buttonTutoStyle, endSize]} pRole={PlayerRole.YellowThief} onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
            <Button css={[buttonTutoStyle, endSize]} pRole={PlayerRole.YellowThief} onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
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

const endSize = css`
width:auto;

`

const textEndStyle = css`
color: black;
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
          boxTop: 53,
          boxLeft: 35,
          boxWidth: 50,
          arrow: {
            angle: 180,
            top: 53,
            left: 15
          }
        },
        {
            title: (t: TFunction) => t('title.opponents'),
            text: 'tuto.your.opponents',
            boxTop: 60,
            boxLeft: 25,
            boxWidth: 30
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
        }

    ],
    [
        {
            title: (t: TFunction) => t('title.opponent.played'),
            text: 'tuto.opponent.played',
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
            title: (t: TFunction) => t('title.patrolling.phase'),
            text: 'tuto.patrolling.phase',
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
          title: (t: TFunction) => t('title.prince.placed.patrols'),
          text: 'tuto.prince.placed.patrols',
          boxTop: 78,
          boxLeft: 42,
          boxWidth: 50,
          arrow: {
              angle: 0,
              top: 72,
              left: 5
          }
        },
        {
          title: (t: TFunction) => t('title.start.solving'),
          text: 'tuto.start.solving',
          boxTop: 78,
          boxLeft: 42,
          boxWidth: 50
        },
        {
          title: (t: TFunction) => t('title.market'),
          text: 'tuto.market',
          boxTop: 78,
          boxLeft: 42,
          boxWidth: 50,
          arrow: {
              angle: 0,
              top: 72,
              left: 5
          }
        },
        {
          title: (t: TFunction) => t('title.cityhall1'),
          text: 'tuto.cityhall1',
          boxTop: 78,
          boxLeft: 42,
          boxWidth: 50,
          arrow: {
              angle: 0,
              top: 72,
              left: 5
          }
        },
        {
          title: (t: TFunction) => t('title.cityhall2'),
          text: 'tuto.cityhall2',
          boxTop: 78,
          boxLeft: 42,
          boxWidth: 50,
          arrow: {
              angle: 0,
              top: 72,
              left: 5
          }
        } 
  ],
  [
    {
      title: (t: TFunction) => t('title.harbor'),
      text: 'tuto.harbor',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.types.of.token'),
      text: 'tuto.types.of.tokens',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
    },
    {
      title: (t: TFunction) => t('title.harbor.event'),
      text: 'tuto.harbor.event',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.take.steal.token'),
      text: 'tuto.take.steal.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.take.kick.token'),
      text: 'tuto.take.kick.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],[
    {
      title: (t: TFunction) => t('title.take.move.token'),
      text: 'tuto.take.move.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.convoy.no.arrest'),
      text: 'tuto.convoy.no.arrest',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.palace.no.arrest'),
      text: 'tuto.palace.no.arrest',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.tavern.no.action'),
      text: 'tuto.tavern.no.arrest',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.treasure.effect'),
      text: 'tuto.treasure.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.treasure.arrest'),
      text: 'tuto.treasure.arrest',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.jail.passive.effect'),
      text: 'tuto.jail.passive.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.jail.active.effect'),
      text: 'tuto.jail.active.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.jail.active.effect.four'),
      text: 'tuto.jail.active.effect.four',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.jail.active.effect.not.four'),
      text: 'tuto.jail.active.effect.not.four',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.wincon.prince'),
      text: 'tuto.wincon.prince',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.end.solving'),
      text: 'tuto.end.solving',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.start.new.turn'),
      text: 'tuto.start.new.turn',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.place.convoy'),
      text: 'tuto.place.convoy',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.tokens.placing.rules'),
      text: 'tuto.tokens.placing.rules',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.steal.token.effect'),
      text: 'tuto.steal.token.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.place.steal.token'),
      text: 'tuto.place.steal.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.place.palace'),
      text: 'tuto.place.palace',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.move.token.effect'),
      text: 'tuto.move.token.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
    },
    {
      title: (t: TFunction) => t('title.place.move.token'),
      text: 'tuto.place.move',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.place.tavern'),
      text: 'tuto.place.tavern',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.kick.token.effect'),
      text: 'tuto.kick.token.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.place.kick.token'),
      text: 'tuto.place.kick.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
  ],
  [
    {
      title: (t: TFunction) => t('title.validate'),
      text: 'tuto.validate',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.prince.turn'),
      text: 'tuto.prince.turn',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.prince.abilities'),
      text: 'tuto.prince.abilities',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.prince.abilities.judge'),
      text: 'tuto.prince.abilities.judge',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.prince.abilities.captain'),
      text: 'tuto.prince.abilities.captain',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.prince.abilities.fast.arrest'),
      text: 'tuto.prince.abilities.fast.arrest',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.start.solving.phase'),
      text: 'tuto.start.solving.phase',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.solving.market.t2'),
      text: 'tuto.solving.market.t2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.solving.cityhall.t2'),
      text: 'tuto.solving.cityhall.t2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.solving.harbor.t2'),
      text: 'tuto.solving.harbor.t2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.solving.token.rules'),
      text: 'tuto.solving.token.rules',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
    },
    {
      title: (t: TFunction) => t('title.solving.steal.token1'),
      text: 'tuto.solving.steal.token1',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.solving.steal.token2'),
      text: 'tuto.solving.steal.token2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.convoy.effect'),
      text: 'tuto.convoy.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.convoy.condition'),
      text: 'tuto.convoy.condition',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.convoy.solving'),
      text: 'tuto.convoy.solving',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
  ],
  [
    {
      title: (t: TFunction) => t('title.solving.move.token'),
      text: 'tuto.solving.move.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.solving.move.token.dont.use1'),
      text: 'tuto.solving.move.token.dont.use1',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
  ],
  [
    {
      title: (t: TFunction) => t('title.palace.effect'),
      text: 'tuto.palace.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.palace.condition'),
      text: 'tuto.palace.condition',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.solving.move.token.dont.use2'),
      text: 'tuto.solving.move.token.dont.use2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
  ],
  [],
  [
    {
      title: (t: TFunction) => t('title.solving.kick.token'),
      text: 'tuto.solving.kick.token',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 0,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.solving.kick.opponent'),
      text: 'tuto.solving.kick.opponent',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('title.tavern.effect'),
      text: 'tuto.tavern.effect',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.tavern.results'),
      text: 'tuto.tavern.results',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    },
    {
      title: (t: TFunction) => t('title.tavern.bet'),
      text: 'tuto.tavern.bet',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    }
  ],
  [    
    {
      title: (t: TFunction) => t('title.result.kick'),
      text: 'tuto.result.kick',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    }
  ],
  [    
    {
      title: (t: TFunction) => t('title.prison.t2'),
      text: 'tuto.prison.t2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    }
  ],
  [    
    {
      title: (t: TFunction) => t('title.end.t2'),
      text: 'tuto.end.t2',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    }
  ],
  [    
    {
      title: (t: TFunction) => t('title.end.tuto?'),
      text: 'tuto.end.tuto?',
      boxTop: 78,
      boxLeft: 42,
      boxWidth: 50,
      arrow: {
          angle: 180,
          top: 72,
          left: 5
      }
    }
  ],
]

const fifthTurnInfo = {
  title: (t: TFunction) => t('Two player game'),
  text: 'tuto.2.players',
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 70
}

const lastTurnInfo = {
  title: (t: TFunction) => t('Last Turn'),
  text: "tuto.last.turn",
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