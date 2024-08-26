import React from 'react'
import styles from './GameCanvas.module.css'

const GameCanvas = ({canvasRef}) => { 
    return (
    <canvas className={styles.canvas} ref={canvasRef}/>
  )
}

export default GameCanvas