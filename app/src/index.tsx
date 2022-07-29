import {css, Global} from '@emotion/react'
import Brigands from '@gamepark/brigands/Brigands'
import {BrigandsOptionsSpec} from '@gamepark/brigands/BrigandsOptions'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import normalize from 'emotion-normalize'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import brigandsAnimations from './BrigandsAnimations'
import BrigandsView from './BrigandsView'
import translations from './translations.json'
import BrigandsTutorial from './tutorial/Tutorial'
import Images from './images/Images'

setupTranslation(translations)

const style = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-image: url(${Images.background});
    background-color: white;
    background-size: cover;
    background-position: center top;
    color: #eee;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
`

ReactDOM.render(
  <StrictMode>
    <GameProvider game="brigands"
                  Rules={Brigands}
                  RulesView={BrigandsView}
                  optionsSpec={BrigandsOptionsSpec}
                  animations={brigandsAnimations}
                  tutorial={BrigandsTutorial}
    >
      <App/>
    </GameProvider>
    <Global styles={[normalize, style]}/>
  </StrictMode>,
  document.getElementById('root')
)
