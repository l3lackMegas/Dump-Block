import {
    motion,
    useMotionValue,
    useTransform,
} from "framer-motion"
import { Component } from "react"

/* Global State */
import { IGameState } from '../../store/GameState'
import RootStore from '../../store/index'

interface IState {
    gameState: IGameState
    crrBackground: string
    isChanging: boolean
    counting: number
}

class GameBackgroundImage extends Component {

    constructor(props: any) {
        super(props);
        this.setBGTransition = this.setBGTransition.bind(this)
    }

    state: IState = {
        gameState: RootStore.getState().gameState,
        crrBackground: '',
        isChanging: false,
        counting: 0
    }

    componentDidMount() {
        console.log(RootStore.getState().gameState)
        RootStore.subscribe(()=>{
            let gameState: IGameState = RootStore.getState().gameState;
            if(this.state.crrBackground != gameState.style.backgroundImage){
                this.setBGTransition(gameState.style.backgroundImage);
            }
            this.setState({
                gameState: RootStore.getState().gameState
            })
        })
    }

    setBGTransition(img: string) {
        this.setState({
            isChanging: true,
            counting: this.state.counting + 1
        })
        setTimeout(() => {
            this.setState({
                crrBackground: img,
                isChanging: false
            })
            console.log(this.state.counting)
        }, this.state.counting == 1 ? 1 : 2000)
    }

    render() {

        const { counting, gameState, isChanging, crrBackground } = this.state
        console.log(gameState)
        return (
            <motion.div style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                zIndex: -3,
                opacity: .5,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            initial={{
                backgroundImage: '#00000000',
                opacity: 0,
                scale: 1.8
            }}
            animate={{
                backgroundImage: crrBackground || '#00000000',
                opacity: isChanging ? 0 : .25,
                scale: counting === 1 && isChanging ? 1.8 : 1,
                transition: counting === 1 ? {
                    duration: 2,
                    ease: [0.5, 0.025, 0, 1]
                } : {
                    duration: .5
                }
            }}
            >

            </motion.div>
        )
    }
}

export default GameBackgroundImage