import { Component } from 'react'

import { NextPageContext } from 'next'
import Head from 'next/head'
import bsc, { useWallet } from '@binance-chain/bsc-use-wallet'
import { motion } from 'framer-motion'

/* Global State */
import { IGameState } from '../store/GameState'
import RootStore from '../store/index'

// Components
import { DButton, LoadingIcon, withWalletHook } from '../components/common'
import Layout from '../components/Layout'
import UserInfo from '../components/HUD/UserInfo'
import MainMenu from '../components/HUD/MainMenu'
import { transform } from 'lodash'


interface IRecipeProps {
    wallet: any
}

class Lobby extends Component<IRecipeProps> {
    backgroundImage: String = 'url(/main-screen.jpg)'

    componentDidMount() {
        const wallet = this.props.wallet;
        RootStore.dispatch({
            type: 'SET_STYLE',
            data: {
                background: 'rgb(41 41 50)',
                backgroundImage: this.backgroundImage
            }
        });

        
    }
    
    render() {
        
        return <Layout {...this.props} siteTitle="Lobby">
            <UserInfo/>
            <MainMenu/>
        </Layout>
    }
}

export default withWalletHook(Lobby);