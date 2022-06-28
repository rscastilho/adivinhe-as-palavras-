import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <span>
                Desenvolvido por <strong style={{color:'yellow'}}> rCastilho</strong>
            </span>
        </div>
    )
}

export default Footer