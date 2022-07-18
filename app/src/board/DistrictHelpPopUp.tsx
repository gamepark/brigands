/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Picture} from '@gamepark/react-components'
import {TFunction} from 'i18next'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import Button from '../utils/Button'
import {getDistrictImage} from './DistrictTile'

const DistrictHelpPopUp: FC<{ district: DistrictName, nbPlayers: number, color: PlayerRole, close: () => void }> = ({district, nbPlayers, color, close}) => {
  const {t} = useTranslation()
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle]} onClick={close}>
      <div css={popupStyle} onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={close}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{getDistrictName(district, t)}</h2>
        <Picture src={getDistrictImage(district, nbPlayers)}/>
        <p> {getDistrictHelpText(district, nbPlayers, t)} </p>
        <Button pRole={color} css={buttonPosition} onClick={close}>{t('OK')}</Button>
      </div>
    </div>
  )
}

function getDistrictName(district: DistrictName, t: TFunction): string {
  switch (district) {
    case DistrictName.CityHall:
      return t('The Cityhall')
    case DistrictName.Convoy:
      return t('The Convoy')
    case DistrictName.Harbor:
      return t('The Harbor')
    case DistrictName.Jail:
      return t('The Jail')
    case DistrictName.Market:
      return t('The Market')
    case DistrictName.Palace:
      return t('The Palace')
    case DistrictName.Tavern:
      return t('The Tavern')
    case DistrictName.Treasure:
      return t('The Treasure')
  }
}

function getDistrictHelpText(district: DistrictName, nbPlayers: number, t: TFunction): string {
  switch (district) {
    case DistrictName.CityHall:
      return t('cityhall.help.text')
    case DistrictName.Convoy:
      return nbPlayers < 5 ? t('convoy.help.text1') : t('convoy.help.text2')
    case DistrictName.Harbor:
      return t('harbor.help.text')
    case DistrictName.Jail:
      return t('jail.help.text')
    case DistrictName.Market:
      return t('market.help.text')
    case DistrictName.Palace:
      return nbPlayers < 4 ? t('palace.help.text1') : t('palace.help.text2')
    case DistrictName.Tavern:
      return t('tavern.help.text')
    case DistrictName.Treasure:
      return t('treasure.help.text')
  }
}

const buttonPosition = css`
  position: relative;
`

const popupOverlayStyle = css`
  background: rgba(0, 0, 0, 0.8);
  transform: translateZ(0.1em);

  z-index: 99;
  transition: all .5s ease;
`
const showPopupOverlayStyle = css`
  width: 100%;
  height: 100%;
`

const popupStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  height: auto;
  width: 40%;
  z-index: 102;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  color: white;

  & > h2 {
    position: relative;
    font-size: 5em;
    margin: 0.5em auto;
    text-align: center;
    width: 60%;
  }

  & > p {
    position: relative;
    text-align: center;
    font-size: 3em;
    margin: 0.8em auto;
    width: 80%;

  }

  & > button {
    font-size: 3.5em;
  }
`

const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;

  &:hover {
    cursor: pointer;
    color: white;
  }
`

export default DistrictHelpPopUp