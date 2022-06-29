import React from 'react'
import styles from './Palavras.module.css'

const Palavras = ({ dica, letras, letrasCertas }) => {
    return (
        <div className={styles.caixaPrincipal}>
            <p className={styles.caixaDica}>{dica}</p>
            <div className={styles.caixaPalavra}>
                {letras.map((letra, i) => (
                    letrasCertas.includes(letra) ?
                        <>
                            <span key={i} className={styles.caixaBranca}>
                                {letra}
                            </span>
                        </>
                        :
                        <>
                            {(letra === '-' || letra === ' ') ?
                                <span key={i} className={styles.caixaBranca}>  -   </span> :
                                <span className={styles.caixaBranca}>_</span>
                            }
                        </>
                ))}
            </div>
        </div>
    )
}

export default Palavras