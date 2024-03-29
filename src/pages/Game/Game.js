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

    //carrega palavras do arquivo data e seleciona randomicamente a palavra secreta e dicas. retornando a dicaaleatoria e palavraaleatoria para utilizacao em outro compomente;

    const mostrarDica = useCallback(() => {
        let selecionaDica = Object.keys(palavras);
        let dicaAleatoria = selecionaDica[Math.floor(Math.random() * Object.keys(selecionaDica).length)]
        let palavraAleatoria = palavras[dicaAleatoria][Math.floor(Math.random() * palavras[dicaAleatoria].length)];
        return { dicaAleatoria, palavraAleatoria }
    }, [palavras])

    //converte a palavra randomica para minuscula para um array. setando as letras no estado
    const gerarforca = useCallback(() => {
        const { palavraAleatoria, dicaAleatoria } = mostrarDica();
        let letras = palavraAleatoria.toLowerCase().split("");
        letras = letras.map((x) => x.toLowerCase());
        setLetras(letras);
        setDica(dicaAleatoria);
    }, []);

    //verifica se a letra ja foi digitada
    //se estiver certa e nao foi digitada inclui no estado e acrestanta a pontuacao, o mesmo para letras erradas

    const verificaLetra = (letraDigitada) => {
        let digitoMin = letraDigitada.toLowerCase();
        if (letrasCertas.includes(letraDigitada) || letrasErradas.includes(letraDigitada)) {
            return;
        }
        if (letras.includes(digitoMin)) {
            setLetrasCertas((x) => [...x, digitoMin]);
            setPontuacao((x) => x + 100);
        } else {
            setLetrasErradas((x) => [...x, digitoMin]);
            setVidas((x) => x - 1);
            setPontuacao((x) => x - 100);
            window.navigator.vibrate(500);

        }
    }

    //cria dinamicamente a quantidade de coracoes de acordo com a quantidade de vidas
    const coracoes = useCallback(() => {
        let qtd = [];
        for (let i = 0; i < vidas; i++) {
            qtd[i] = { i }
            setCoracao(qtd)
        }
    }, [vidas])

    //aciona a funcao verificar letras
    const handleSubmit = (e) => {
        e.preventDefault()
        if (letra.trim() === '' || letra === null) {
            toast.warning("Digite uma letra para continuar", { position: "bottom-center", autoClose: 1000 });
            inputLetra.current.focus();
            return;
        } else {
            inputLetra.current.focus();
            verificaLetra(letra)
            setLetra('')
        }
    }

    //utilizado para recomecar o jogo, pegando as principais funcionalidaes e zerando.

    const recomecar = useCallback(() => {
        setVidas(5);
        setLetra('');
        setLetrasCertas('');
        setLetrasErradas('');
        mostrarDica();
        gerarforca();
        setPontuacao(0);
        inputLetra.current.focus();
        }, [gerarforca, mostrarDica])

        //pula a palavra, tira uma vida e mantem a pontuacao.

    const pular = useCallback(() => {
        setVidas((x) => x - 1);
        setLetra('');
        setLetrasCertas('');
        setLetrasErradas('');
        mostrarDica();
        gerarforca();
        setPontuacao(pontuacao);
        inputLetra.current.focus();
    }, [gerarforca, mostrarDica, pontuacao])


    //invocada quando a palavra esta certa e completa

    const proximaPalavra = useCallback(() => {
        mostrarDica();
        gerarforca();
        setLetrasCertas('');
        setLetrasErradas('');
    }, [gerarforca, mostrarDica])

    //valida se a palavra esta certa para passar para a proxima

    useMemo(() => {
        const unicaletra = [...new Set(letras)]
        if (letrasCertas.length === unicaletra.length) {
            proximaPalavra();
        }
    }, [letras, letrasCertas, proximaPalavra])
    
    
    //focus no input
    useEffect(()=>{
        inputLetra.current.focus();
    },[])



    useEffect(() => {
        inputLetra.current.focus();
        recomecar();
    }, [recomecar])

    //monitora os coracoes

    useMemo(() => {
        coracoes()
    }, [coracoes])

    return (
        <div className={styles.caixaPrincipal}>
            {!vidas ?
                <GameOver
                    recomecar={recomecar}
                    pontuacao={pontuacao}
                />
                :
                <>
                    <div className={styles.barraTitulo}>
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
                                Sua pontuação: <strong>{pontuacao}</strong>
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
                            pattern={'[a-zÃ-úA-Z-]{1}'}
                            required
                        />
                        <button
                            className={styles.botao}
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
                        <button
                            type='button'
                            className={styles.botao}
                            onClick={pular}
                        >
                            Pular
                        </button>
                    </form>
                    {letrasErradas &&
                        <div className={styles.letrasErradasTitulo}>
                            <span> Letras erradas:</span>
                            <div className={styles.letrasErradas}>
                                {letrasErradas.map((erradas, i) => (
                                    <span key={i} className={styles.letrasErradas}> {erradas}, </span>
                                ))}
                            </div>
                        </div>
                    }
                    <ToastContainer />
                </>
            }
        </div>
    )
}

export default Game