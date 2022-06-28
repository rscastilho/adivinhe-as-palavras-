import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import GameOver from '../../components/GameOver/GameOver';
import Palavras from '../../components/Palavras/Palavras';
import { listaPalavras } from '../../Data/data';
import styles from './Game.module.css'
import { FaHeart } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';



const Game = () => {
    const [palavras] = useState(listaPalavras)
    const [dica, setDica] = useState('');
    const [letra, setLetra] = useState('');
    const [letras, setLetras] = useState([]);
    const [letrasCertas, setLetrasCertas] = useState([]);
    const [letrasErradas, setLetrasErradas] = useState([]);
    const [vidas, setVidas] = useState(5);
    const [coracao, setCoracao] = useState([]);
    const [pontuacao, setPontuacao] = useState(0);
    const inputLetra = useRef();
    
    
    const mostrarDica = useCallback(() => {
        let selecionaDica = Object.keys(palavras);
        let dicaAleatoria = selecionaDica[Math.floor(Math.random() * Object.keys(selecionaDica).length)]
        let palavraAleatoria = palavras[dicaAleatoria][Math.floor(Math.random() * palavras[dicaAleatoria].length)];
        return { dicaAleatoria, palavraAleatoria }
    }, [palavras])
    
    const gerarforca = useCallback(() => {
        const { palavraAleatoria, dicaAleatoria } = mostrarDica();
        let letras = palavraAleatoria.toLowerCase().split("");
        letras = letras.map((x) => x.toLowerCase());
        setLetras(letras);
        setDica(dicaAleatoria);
        
    }, []);
    
    const verificaLetra = (letraDigitada) => {
        let digitoMin = letraDigitada.toLowerCase();
        if (letrasCertas.includes(letraDigitada) || letrasErradas.includes(letraDigitada)) {
            return;
        }
        if (letras.includes(letraDigitada)) {
            setLetrasCertas((x) => [...x, digitoMin])
            setPontuacao((x) => x + 100)
        } else {
            setLetrasErradas((x) => [...x, digitoMin])
            setVidas((x) => x - 1);
            setPontuacao((x) => x - 100)
        }
    }
    
    const coracoes = useCallback(() => {
        let qtd = [];
        for (let i = 0; i < vidas; i++) {
            qtd[i] = { i }
            setCoracao(qtd)
        }
    }, [vidas])
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (letra.trim() === '' || letra === null){
            toast.warning("Digite uma letra para continuar", {position:"bottom-center", autoClose:1000});
            inputLetra.current.focus();
            return;
        } else{
            inputLetra.current.focus();
            verificaLetra(letra)
            setLetra('')
        }
    }

    const recomecar = useCallback(() => {
        setVidas(5);
        setLetra('');
        setLetrasCertas('');
        setLetrasErradas('');
        mostrarDica();
        gerarforca();
        setPontuacao(0);
    }, [gerarforca, mostrarDica])

    const proximaPalavra = useCallback(() => {
        mostrarDica();
        gerarforca();
        setLetrasCertas('');
        setLetrasErradas('');
    }, [gerarforca, mostrarDica])

    useEffect(() => {
        const unicaletra = [...new Set(letras)]
        if (letrasCertas.length === unicaletra.length) {
            proximaPalavra();
        }
    }, [letras, letrasCertas])

    useEffect(() => {
        inputLetra.current.focus();
        recomecar();
    }, [recomecar])

    useMemo(() => {
        coracoes()
    }, [coracoes])

    return (
        <div className={styles.caixaPrincipal}>


            {!vidas ?
                <GameOver
                    setVidas={setVidas}
                    setLetrasCertas={setLetrasCertas}
                    setLetrasErradas={setLetrasErradas}
                    recomecar={recomecar}
                />
                :
                <>
                    <div className={styles.barraTitulo}>
                        <div className={styles.barraVidas}>
                        </div>
                        <div className={styles.barraVidas}>
                            <p className={styles.vidas}> Você tem  {vidas} vidas!</p>
                        </div>

                        <div className={styles.barraVidas}>
                            {coracao.map((x, i) => (
                                <p key={i}>
                                    <FaHeart
                                        className={styles.coracaoImg}
                                        color={'red'}
                                        size={25} />
                                </p>
                            ))}
                        </div>
                        <div className={styles.barraVidas}>
                            <p className={styles.pontuacao}>
                                Pontuação: {pontuacao}
                            </p>
                        </div>
                    </div>
                    <Palavras
                        dica={dica}
                        letras={letras}
                        letra={letra}
                        letrasCertas={letrasCertas}
                    />

                    <form
                        onSubmit={handleSubmit}
                        className={styles.form}
                    >
                        <input
                            type="text"
                            className={styles.inputLetra}
                            maxLength={1}
                            ref={inputLetra}
                            value={letra}
                            onChange={(e) => setLetra(e.target.value.toLocaleLowerCase())}
                        />
                        <button
                            className={styles.botao}
                            // disabled={letra ? false : true}
                        >
                            Verificar
                        </button>
                        <button
                            type='button'
                            className={styles.botao}
                            onClick={recomecar}
                        >
                            Resetar
                        </button>
                    </form>
                    {letrasErradas &&
                        <div className={styles.letrasErradas}>
                            <span className={styles.letrasErradas}> Letras erradas:</span>
                            {letrasErradas.map((erradas, i) => (
                                <span key={i} className={styles.letrasErradas}> {erradas}, </span>
                            ))}
                        </div>
                    }
                <ToastContainer/>
                </>
            }

        </div>
    )
}

export default Game