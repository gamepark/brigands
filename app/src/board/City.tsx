/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import {placeMeepleMove} from '@gamepark/brigands/moves/PlaceMeeple'
import Phase from '@gamepark/brigands/phases/Phase'
import {PrinceState} from '@gamepark/brigands/PlayerState'
import Partner from '@gamepark/brigands/types/Partner'
import PatrolInHand from '@gamepark/brigands/types/PatrolInHand'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import ThiefTokenInHand from '@gamepark/brigands/types/ThiefTokenInHand'
import {usePlay, usePlayerId, useSound} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC} from 'react'
import Images from '../images/Images'
import {ResetSelectedHeadStart, resetSelectedHeadStartMove} from '../localMoves/SetSelectedHeadStart'
import {ResetSelectedPartner, resetSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import {ResetSelectedTokenInHand, resetSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import MoveTokenSound from '../sounds/moveToken.mp3'
import DistrictTile, {districtImageRatio, districtWidth} from './DistrictTile'
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
  districtsCanPlaceToken: DistrictName[]
  open: (district: DistrictName) => void

}

const City: FC<Props> = ({
                           city, phase, prince, currentDistrict, partnersOfPlayerId, isPlayerReady, selectedPartner, selectedTokenInHand,
                           selectedPatrol, selectedHeadStart, districtsCanPlaceToken, open
                         }) => {

  const play = usePlay<Move>()
  const playResetSelectPartner = usePlay<ResetSelectedPartner>()
  const playResetSelectHeadStart = usePlay<ResetSelectedHeadStart>()
  const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()
  const playerId = usePlayerId<PlayerRole>()

  const moveSound = useSound(MoveTokenSound)


  function playPlacePartner(selectedPartner: number | undefined, district: DistrictName) {
    if (selectedPartner !== undefined && playerId !== undefined) {
      moveSound.play()
      play(placeMeepleMove(playerId, district, selectedPartner))
      playResetSelectPartner(resetSelectedPartnerMove(), {local: true})
      /*selectedTokenInHand !== undefined && play({
        type: MoveType.PlaceToken,
        partnerNumber: selectedPartner,
        role: playerId,
        tokenAction: selectedTokenInHand.tokenAction
      })*/
      playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
    }
  }

  function playPlaceHeadStart(district: DistrictName) {
    moveSound.play()
    play({type: MoveType.PlayHeadStart, district})
    playResetSelectHeadStart(resetSelectedHeadStartMove(), {local: true})
  }

  return (
    <>
      <Picture src={Images.districtStart} css={[districtSize, districtPosition]}/>
      <JailTile prince={prince} selectedPatrol={selectedPatrol} selectedHeadStart={selectedHeadStart}/>
      {city.slice(0, -1 /* TODO: remove Jail */).map((district, index) =>
        <DistrictTile key={district.name}
                      css={[districtPosition, districtRotation(index), phase === Phase.Solving && currentDistrict !== index && reduceBrightness]}
                      district={district}
                      phase={phase}
                      prince={prince}
                      nbPartners={partnersOfPlayerId ? partnersOfPlayerId.filter(part => part.district === district.name).length : undefined}
                      isPlayerReady={isPlayerReady}
                      selectedPartner={selectedPartner}
                      selectedPatrol={selectedPatrol}
                      selectedHeadStart={selectedHeadStart}
                      canPlaceToken={districtsCanPlaceToken.includes(district.name)}
                      onClick={() => playerId === PlayerRole.Prince
                        ? selectedPatrol === undefined && selectedHeadStart === undefined
                          ? open(district.name)
                          : selectedHeadStart === true && district.name !== DistrictName.Jail && prince.patrols.includes(district.name) && playPlaceHeadStart(district.name)

                        : selectedPartner === undefined && selectedTokenInHand === undefined
                          ? open(district.name)
                          : playerId !== undefined && district.name !== DistrictName.Jail && playPlacePartner(selectedPartner, district.name)}

        />
      )}
    </>
  )
}

const districtSize = css`
  width: ${districtWidth}em;
  height: ${districtWidth * districtImageRatio}em;
`

const districtPosition = css`
  position: absolute;
  top: 68em;
  left: 32em;
`

const districtRotation = (index: number) => css`
  transform-origin: center -46%;
  transform: rotate(${(index + 1) * 45}deg);
`

const reduceBrightness = css`
  filter: brightness(50%);
`

export default City