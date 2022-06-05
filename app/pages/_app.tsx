import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import bsc from '@binance-chain/bsc-use-wallet'
import { AnimateSharedLayout, AnimatePresence, MotionConfig } from "framer-motion";
import Head from 'next/head';
import App from 'next/app';
import { motion } from 'framer-motion'
import GameBackground from '../components/background/color'
import Bubbles from '../components/background/bubble'
import GameBackgroundImage from '../components/background/background'


/* Global State */
import { IGameState } from '../store/GameState'
import RootStore from '../store/index'
import { LoadingIcon } from '../components/common';

import store from "../store";

interface IState {
    isFinishIntro: boolean
    warningVisible: boolean
}
class MyApp extends App<AppProps> {
    state: IState = {
        isFinishIntro: false,
        warningVisible: true
    }

    componentDidMount() {
        
    }

    render() {
        const { Component, pageProps, router } = this.props;
        
        
        return (
            <Provider store={store}>
                <AnimateSharedLayout>
                    <motion.div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 1,
                                delay: .5
                            }
                        }}
                    >
                        <Bubbles/>
                        <GameBackground/>
                        <GameBackgroundImage/>
                    </motion.div>
                    <UseWalletProvider chainId={97}>
                        <AnimatePresence exitBeforeEnter>
                            <Component {...pageProps} key={router.pathname} />
                        </AnimatePresence>
                    </UseWalletProvider>
                </AnimateSharedLayout>
            </Provider>
        )
    }
}
 
export default MyApp
