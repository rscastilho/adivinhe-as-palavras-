import React, { useEffect } from 'react';
import styles from './GameOver.module.css'

const GameOver = ({recomecar}) => {
    


    return (
    <div className={styles.boxPrincipal}>
        <h1 className={styles.gameOver}>  Game Over! </h1>
        <button
        className={styles.botao}
        
        onClick={recomecar}>Jogar novamente</button>
        </div>
  )
}

export default GameOver