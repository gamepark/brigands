import ArrestPartners, {isArrestPartners} from '@gamepark/brigands/moves/ArrestPartners'
import DrawEvent, {isDrawEvent} from '@gamepark/brigands/moves/DrawEvent'
import GainGold, {isGainGold} from '@gamepark/brigands/moves/GainGold'
import RevealPartnersDistricts, {isRevealPartnersDistrict} from '@gamepark/brigands/moves/RevealPartnersDistricts'
import ThrowDices, {isThrowDice} from '@gamepark/brigands/moves/PlayThrowDicesResult'
import Phase from '@gamepark/brigands/phases/Phase'
import {useAnimation} from '@gamepark/react-client'
import {FC, useEffect} from 'react'
import {AudioLoader} from '../utils/AudioLoader'
import CardFlip from './cardFlip.mp3'
import DiceShake from './diceShake.mp3'

import GoldCoinSound from './gold1.mp3'
import GoldBagSound from './goldBag.mp3'
import PrisonDoor from './prisonDoor.mp3'
import EndSound from './trumpet.mp3'

type Props = {
  audioLoader: AudioLoader
  phase?: Phase
}

const BrigandsSounds: FC<Props> = ({audioLoader, phase}) => {

  const gainGoldAnimation = useAnimation<GainGold>(animation => isGainGold(animation.move))
  const drawEventAnimation = useAnimation<DrawEvent>(animation => isDrawEvent(animation.move))
  const revealCardsAnimation = useAnimation<RevealPartnersDistricts>(animation => isRevealPartnersDistrict(animation.move))
  const diceRollAnimation = useAnimation<ThrowDices>(animation => isThrowDice(animation.move))
  const arrestPartnersAnimation = useAnimation<ArrestPartners>(animation => isArrestPartners(animation.move))


  useEffect(() => {
    if (gainGoldAnimation && gainGoldAnimation.move.gold > 0) {
      gainGoldAnimation.move.gold > 5 ? audioLoader.play(GoldBagSound, false, 0.6) : audioLoader.play(GoldCoinSound, false, 0.4)
    }
  }, [gainGoldAnimation?.move])

  useEffect(() => {
    if (drawEventAnimation || revealCardsAnimation) {
      audioLoader.play(CardFlip, false, 0.4)
    }
  }, [drawEventAnimation?.move, revealCardsAnimation?.move])

  useEffect(() => {
    if (diceRollAnimation) {
      audioLoader.play(DiceShake, false, 0.4)
    }
  }, [diceRollAnimation?.move])

  useEffect(() => {
    if (arrestPartnersAnimation) {
      audioLoader.play(PrisonDoor, false, 0.4)
    }
  }, [arrestPartnersAnimation?.move])

  useEffect(() => {
    if (phase === undefined) {
      audioLoader.play(EndSound, false, 0.4)
    }
  }, [phase])

  return null
}

export default BrigandsSounds