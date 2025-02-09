import React from 'react'
import { TypeAnimation } from 'react-type-animation'

function TyppingAnim() {
  return (
    <TypeAnimation
      sequence={[

        'Welcome to the swamp!!',
        1000,
        'We are Gator Nation',
        1000,
        'This is GatorAI',
        1000,
        'Built with Chatgpt API by Pavan',
        3000
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '60px', display: 'inline-block', color: 'white', textShadow: '1px 1px 20px #000' }}
      repeat={Infinity}
    />
  )
}

export default TyppingAnim