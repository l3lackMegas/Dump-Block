import { Component } from 'react'

import { NextPageContext } from 'next'
import Head from 'next/head'
import bsc, { useWallet } from '@binance-chain/bsc-use-wallet'
import { motion } from 'framer-motion'
import { withRouter } from "next/router"

/* Global State */
import { IGameState } from '../../store/GameState'
import RootStore from '../../store/index'

// Components
import { DButton, LoadingIcon, withWalletHook } from '../../components/common'
import Layout from '../../components/Layout'
import UserInfo from '../../components/HUD/UserInfo'
import PlayMenu from '../../components/HUD/PlayMenu'
import { transform } from 'lodash'
import { WithRouterProps } from 'next/dist/client/with-router'


interface IRecipeProps extends WithRouterProps {
    wallet: any
}

class PlayScene extends Component<IRecipeProps> {
    backgroundImage: String = 'url(/main-screen.jpg)'

    state = {
        heroId: 0
    }

    componentDidMount() {
        
        
        const wallet = this.props.wallet;

        this.setState({
            heroId: this.props.router.query.id
        })
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
            <PlayMenu heroId={this.state.heroId}/>
        </Layout>
    }
}

export default withWalletHook(withRouter(PlayScene));