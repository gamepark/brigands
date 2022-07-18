/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import Phase from '@gamepark/brigands/phases/Phase'
import {PrinceState} from '@gamepark/brigands/PlayerState'
import Partner from '@gamepark/brigands/types/Partner'
import PatrolInHand from '@gamepark/brigands/types/PatrolInHand'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import ThiefTokenInHand from '@gamepark/brigands/types/ThiefTokenInHand'
import {usePlay, usePlayerId, useSound} from '@gamepark/react-client'
import {FC} from 'react'
import {ResetSelectedHeadStart, resetSelectedHeadStartMove} from '../localMoves/SetSelectedHeadStart'
import {ResetSelectedPartner, resetSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import {ResetSelectedPatrol, resetSelectedPatrolMove} from '../localMoves/SetSelectedPatrol'
import {ResetSelectedTokenInHand, resetSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import MoveTokenSound from '../sounds/moveToken.mp3'
import DistrictTile from './DistrictTile'
import JailTile from './JailTile'

type Props = {
  city: District[]
  phase: Phase | undefined
  prince: PrinceState
  currentDistrict: number | undefined
  partnersOfPlayerId?: Partner[]
  isPlayerReady?: boolean
  selectedPartner?: number
  selectedTokenInHand?: ThiefTokenInHand
  selectedPatrol?: PatrolInHand
  selectedHeadStart?: boolean
  open: (district: DistrictName) => void

}

const City: FC<Props> = ({
                           city, phase, prince, currentDistrict, partnersOfPlayerId, isPlayerReady, selectedPartner, selectedTokenInHand,
                           selectedPatrol, selectedHeadStart, open
                         }) => {

  const play = usePlay<Move>()
  const playResetSelectPartner = usePlay<ResetSelectedPartner>()
  const playResetSelectPatrol = usePlay<ResetSelectedPatrol>()
  const playResetSelectHeadStart = usePlay<ResetSelectedHeadStart>()
  const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()
  const playerId = usePlayerId<PlayerRole>()

  const moveSound = useSound(MoveTokenSound)


  function playPlacePartner(selectedPartner: number | undefined, district: DistrictName) {
    if (selectedPartner !== undefined && playerId !== undefined) {
      moveSound.play()
      play({
        type: MoveType.PlacePartner,
        district,
        partnerNumber: selectedPartner,
        playerId
      })
      playResetSelectPartner(resetSelectedPartnerMove(), {local: true})
      selectedTokenInHand !== undefined && play({
        type: MoveType.PlaceToken,
        partnerNumber: selectedPartner,
        role: playerId,
        tokenAction: selectedTokenInHand.tokenAction
      })
      playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
    }
  }

  function playPlacePatrol(district: DistrictName) {
    if (selectedPatrol !== undefined && selectedPatrol.index !== undefined) {
      moveSound.play()
      play({
        type: MoveType.PlacePatrol,
        district,
        patrolNumber: selectedPatrol.index
      })
      playResetSelectPatrol(resetSelectedPatrolMove(), {local: true})
    }
  }

  function playPlaceHeadStart(district: DistrictName) {
    moveSound.play()
    play({type: MoveType.PlayHeadStart, district})
    playResetSelectHeadStart(resetSelectedHeadStartMove(), {local: true})
  }

  return (
    <>
      <JailTile prince={prince} selectedPatrol={selectedPatrol} selectedHeadStart={selectedHeadStart}/>
      {city.slice(0, -1 /* TODO: remove Jail */).map((district, index) =>
        <DistrictTile key={district.name}
                      css={[districtPosition(index), phase === Phase.Solving && currentDistrict !== index && reduceBrightness]}
                      district={district}
                      phase={phase}
                      prince={prince}
                      nbPartners={partnersOfPlayerId ? partnersOfPlayerId.filter(part => part.district === district.name).length : undefined}
                      isPlayerReady={isPlayerReady}
                      selectedPartner={selectedPartner}
                      selectedPatrol={selectedPatrol}
                      selectedHeadStart={selectedHeadStart}
                      onClick={() => playerId === PlayerRole.Prince
                        ? selectedPatrol === undefined && selectedHeadStart === undefined
                          ? open(district.name)
                          : phase === Phase.Patrolling && !prince.patrols.includes(district.name) && selectedPatrol !== undefined
                            ? playPlacePatrol(district.name)
                            : selectedHeadStart === true && district.name !== DistrictName.Jail && prince.patrols.includes(district.name) && playPlaceHeadStart(district.name)

                        : selectedPartner === undefined && selectedTokenInHand === undefined
                          ? open(district.name)
                          : playerId !== undefined && district.name !== DistrictName.Jail && playPlacePartner(selectedPartner, district.name)}

        />
      )}
    </>
  )
}

const districtPosition = (index: number) => css`
  position: absolute;
  top: 68em;
  left: 32em;
  transform-origin: center -46%;
  transform: rotate(${(index + 1) * 45}deg);
`

const reduceBrightness = css`
  filter: brightness(50%);
`

export default City