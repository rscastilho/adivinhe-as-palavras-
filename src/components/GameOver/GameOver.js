import React, { useEffect } from 'react';
import styles from './GameOver.module.css'

const GameOver = ({recomecar, pontuacao}) => {
    


    return (
    <div className={styles.boxPrincipal}>
        <h2 className={styles.pontuacaoFinal}>Sua pontuação foi {pontuacao}pts.</h2>
        <h1 className={styles.gameOver}>  Game Over! </h1>
        <button
        className={styles.botao}
        
        onClick={recomecar}>Jogar novamente</button>
        </div>
  )
}

export default GameOver