// Dependencies
import Head from 'next/head'
import { Component } from 'react'
import Router from 'next/router'
import { motion } from 'framer-motion'
import { AnimateSharedLayout, AnimatePresence } from "framer-motion";

/* Global State */
import { IGameState } from '../store/GameState'
import RootStore from '../store/index'

// Components
import { DButton, LoadingIcon, withWalletHook } from '../components/common'

interface IRecipeProps {
    wallet: any,
    siteTitle: string,
    OGImage?: string,
    description?: string,
    children?: any
}

interface IState {
    isMounted: boolean
    gameState: IGameState
}

class Layout extends Component<IRecipeProps> {
    state: IState = {
        isMounted: false,
        gameState: RootStore.getState().gameState
    }

    componentDidMount() {
        this.setState({
            isMounted: true
        })
        const wallet = this.props.wallet
        const {pathname} = Router
        if(wallet.status === 'disconnected' || wallet.status === 'error') {
            if(pathname != '/' ){
                Router.push('/')
            }
        }

        console.log(RootStore.getState().gameState)
        RootStore.subscribe(()=>{
            this.setState({
                gameState: RootStore.getState().gameState
            })
        })
        
    }

    componentDidUpdate() {
        const wallet = this.props.wallet
        const {pathname} = Router
        if(wallet.status === 'disconnected' || wallet.status === 'error') {
            if(pathname != '/' ){
                Router.push('/')
            }
        }
    }

    render() {
        
        let siteInfo = {
            title: this.props.siteTitle + ' - DumpBlock',
            description: this.props.description ? this.props.description :
                "Just DumpBlock, i'm not gonna lie",
        }

        const { gameState } = this.state

        return <>
            <Head>
                <title>{ siteInfo.title }</title>
                {/* <link rel="icon" href="/img/logo/favicon.png" type="image/png" sizes="64x64"></link> */}
                <meta name="description" content={ siteInfo.description }/>
                
                <meta property="og:type" content="article" />
                <meta property="og:title" content={ siteInfo.title } />
                <meta property="og:description" content={ siteInfo.description } />
                {/* <meta property="og:image"
                    content={this.props.OGImage ? this.props.OGImage : `${siteDomain}/img/og-image.png`}
                /> */}
            </Head>
             <motion.div
                    style={{
                        display: gameState.loadingStatus && gameState.loadingStatus.isLoading ? 'block' : 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 99999
                    }}
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            duration: .5
                        }
                    }}
                >
                    <div className='container center'>
                        <LoadingIcon/>
                        <br/>
                        <p style={{color: 'white'}}>{gameState.loadingStatus.message}</p>
                    </div>
                    
                </motion.div>
            
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: 'calc(100vh - 130px)',
                    zIndex: 1
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: .5 }}}
            >
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                }}>
                    { this.props.children }
                </div>
            </motion.div>
        </>
    }
}


export default withWalletHook(Layout);