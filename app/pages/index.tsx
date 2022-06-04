import { Component } from 'react'

import { NextPageContext } from 'next'
import Head from 'next/head'

// Components
import Layout from '../components/Layout'
import TitleScreen from '../components/scene/title-screen'

/* Global State */
import { IGameState } from '../store/GameState'
import RootStore from '../store/index'

interface IRecipeProps {
    
}

class Home extends Component<IRecipeProps> {

    backgroundImage: String = 'url(/bg.jpg)'
    
    componentDidMount() {
        console.log(123123)
        setTimeout(() => {
            RootStore.dispatch({
                type: 'SET_STYLE',
                data: {
                    background: '#00000000',
                    backgroundImage: this.backgroundImage
                }
            })
        }, 100);
    }

    render() {
        return <Layout {...this.props} siteTitle="Welcome">
            <TitleScreen />
        </Layout>
    }
}


export default Home;