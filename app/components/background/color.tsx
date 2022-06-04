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
}

class GameBackground extends Component {

    state: IState = {
        gameState: RootStore.getState().gameState
    }

    componentDidMount() {
        console.log(RootStore.getState().gameState)
        RootStore.subscribe(()=>{
            this.setState({
                gameState: RootStore.getState().gameState
            })
        })
    }

    render() {

        const { gameState } = this.state
        console.log(gameState)
        return (
            <motion.div style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                zIndex: -1,
                opacity: .5
            }}
            initial={{
                background: '#00000000'
            }}
            animate={{
                background: gameState.style.background || '#00000000',
                transition: {
                    duration: 1,
                    ease: 'easeInOut'
                }
            }}
            >

            </motion.div>
        )
    }
}

export default GameBackground