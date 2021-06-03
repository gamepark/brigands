/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {ButtonHTMLAttributes, FC} from 'react'

const Button : FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => {
    return <button css={style} {...props}><span/><span/><span/><span/> {children}</button>

}

const animateHKeyFrames = keyframes`
  0% {
  transform:scaleX(0);
  transform-origin: left;
  }
  50%
  {
    transform:scaleX(1);
  transform-origin: left;
  }
  50.1%
  {
    transform:scaleX(1);
  transform-origin: right;
    
  }
  
  100%
  {
    transform:scaleX(0);
  transform-origin: right;
    
  } 
`

const animateVKeyFrames = keyframes`
  0% {
  transform:scaleY(0);
  transform-origin: top;
  }
  50%
  {
    transform:scaleY(1);
  transform-origin: top;
  }
  50.1%
  {
    transform:scaleY(1);
  transform-origin: bottom;
    
  }
  
  100%
  {
    transform:scaleY(0);
  transform-origin: bottom;
    
  } 
`

const style = css`
  background: linear-gradient(-60deg, #d8d8d8 50%, #bfbebe 50%);
  padding: 0.2em 0.4em;
  margin: 0;
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
  -webkit-box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  outline: 0;
  border-style: none;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0;
    -webkit-transition: .2s opacity ease-in-out;
    transition: .2s opacity ease-in-out;
  }

  &:hover:before {
    opacity: 0.4;
  }

  & > span {
    position: absolute;
  }

  & > span:before
  {
    content: '';
    background: #000000;
    
  }

  & > span:nth-of-type(1) {
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    transform:rotate(0deg);
  }

  & > span:nth-of-type(1):before{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height: 2px;
    animation: ${animateHKeyFrames} 8s linear infinite;
  }

  & > span:nth-of-type(2) {
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    transform:rotate(0deg);
  }

  & > span:nth-of-type(2):before{
    position: absolute;
    top: 0;
    right: 0;
    width:2px;
    height: 100%;
    animation: ${animateVKeyFrames} 8s linear infinite;
  }

  & > span:nth-of-type(3) {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    transform:rotate(180deg);
  }

  & > span:nth-of-type(3):before{
    position: absolute;
    bottom: 0;
    left: 0;
    width:100%;
    height: 2px;
    animation: ${animateHKeyFrames} 8s linear infinite;
  }

  & > span:nth-of-type(4) {
    top: 0%;
    left: 0%;
    width: 2px;
    height: 100%;
    transform:rotate(180deg);
  }

  & > span:nth-of-type(4):before{
    position: absolute;
    top: 0%;
    left: 0%;
    width:2px;
    height: 100%;
    animation: ${animateVKeyFrames} 8s linear infinite;
  }

`

export default Button