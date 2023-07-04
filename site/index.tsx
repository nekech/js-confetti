import ReactDOM from 'react-dom'
import React, { useCallback, useEffect, useRef } from 'react'

import JSConfetti from '../src/index'
import { generateRandomArrayElement  } from '../src/generateRandomArrayElement'
import { IAddConfettiConfig, IAddRainConfig } from '../src/types'


const CONFETTI_ARGS: IAddConfettiConfig[] = [
  {},
  //{ confettiRadius: 12, confettiNumber: 100 },
  { emojis: ['🌽', '🍇', '🍌', '🍒', '🐸', '🐳', '🎃', '🎾', '🌈', '🍦', '💁', '🔥', '😁', '😱', '🌴', '👏', '💃'] },
  { emojis: ['🍕', '🍷', '🍭', '💖', '💩', '🐷'] },
  //{ emojis: ['🦄',  '🌈', '🍭'], confettiRadius: 100, confettiNumber: 30 },
  {
    confettiColors: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'],
    confettiRadius: 10,
    confettiNumber: 150,
  },
  {
    confettiColors: ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4'],
    confettiRadius: 6,
    confettiNumber: 300,
  },
]

const RAIN_ARGS: IAddRainConfig[] = [
  {},
  { emojis: ['🌽', '🍇', '🍌', '🍒', '🐸', '🐳', '🎃', '🎾', '🌈', '🍦', '💁', '🔥', '😁', '😱', '🌴', '👏', '💃'], velocityY : 0.2 },
  { emojis: ['🍕', '🍷', '🍭', '💖', '💩', '🐷'], velocityY : 0.2 },
  {
    confettiColors: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'],
    confettiRadius: 10,
    confettiNumber: 150,
    velocityY : 0.2
  },
  {
    confettiColors: ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4'],
    confettiRadius: 6,
    confettiNumber: 300,
    velocityY : 0.2
  },
]

function App(): JSX.Element {
  const jsConfettiRef = useRef<JSConfetti>()
  jsConfettiRef.current = new JSConfetti()

  /*
  useEffect(() => {
    jsConfettiRef.current = new JSConfetti()

    const timeoutId = setTimeout(() => {
      if (jsConfettiRef.current) {
        jsConfettiRef.current.addConfetti(generateRandomArrayElement(CONFETTI_ARGS)).then(() => console.log("Initial batch completed"))
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])
*/


  const onButtonClick = useCallback(() => {
    if (jsConfettiRef.current) {
      jsConfettiRef.current.addRain(generateRandomArrayElement(RAIN_ARGS)).then(() => console.log("Manual batch completed"))
    }
  }, [jsConfettiRef])

  return (
    <>
      <button className="button" onClick={onButtonClick}>Click me!</button>
    </>
  )
}


const appContainer = document.getElementById('app')
ReactDOM.render(<App />, appContainer)
