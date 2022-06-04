import { Component } from 'react'

// Dependencies
import { AnimatePresence, motion } from 'framer-motion'
import Web3 from 'web3'
import Router from 'next/router'

// Components
import { DButton, LoadingIcon, withWalletHook } from '../../common'

// Styles
import styles from './styles.module.scss'

/* Global State */
import { IGameState } from '../../../store/GameState'
import RootStore from '../../../store/index'

// Contracts
import * as ContractToken from "../../../../solidity/build/contracts/DumpBlockToken.json";
import * as ContractAccount from "../../../../solidity/build/contracts/DumpBlockAccount.json";

interface IRecipeProps {
    wallet: any
}

class TitleScreen extends Component<IRecipeProps> {

    constructor(props: IRecipeProps | Readonly<IRecipeProps>) {
        super(props);
        
    }

    backgroundImage: String = 'url(/bg.jpg)'

    state = {
        isLoading: false,
    }

    componentDidMount() {
        const wallet = this.props.wallet;
        let blockNumber: number = wallet.getBlockNumber();
    }

    render() {

        const wallet = this.props.wallet
        const { isLoading } = this.state

        if(wallet.status === 'disconnected' || wallet.status === 'error') {
            RootStore.dispatch({
                type: 'SET_STYLE',
                data: {
                    background: '#00000000',
                    backgroundImage: this.backgroundImage
                }
            })
        } else if(wallet.status === 'connecting' || isLoading) {
            RootStore.dispatch({
                type: 'SET_STYLE',
                data: {
                    background: '#000',
                    backgroundImage: this.backgroundImage
                }
            })
        } else if(wallet.status === 'connected') {
            const {pathname} = Router
            setTimeout(() => {
                if(pathname == '/' ){
                    Router.push('/lobby')
                } 
            }, 1000);
        }
        
        return <div
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
            }}>

            <motion.div
                style={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                }}
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{
                    duration: .5
                }}
                >
                <div className={"container center " + styles.logoFont} style={{color: 'white'}}>
                    <motion.h1 style={{
                            marginTop: 0,
                            fontSize: 80
                        }}
                        initial={{opacity: 1}}
                        animate={wallet.status === 'connecting' || isLoading
                            ? {opacity: 0.5, scale: 4}
                            : {opacity: 1, scale: 1}
                        }
                        transition={wallet.status === 'connecting' || isLoading
                            ? {
                                duration: 60,
                                ease: 'linear',
                            }
                            : {}
                        }
                    >Dump Block</motion.h1>
                    <br/>
                    {/* {wallet.status === 'connected' && <div>
                        <div>Account: {wallet.account}</div>
                        <div>Balance: {wallet.balance}</div>
                        <button onClick={() => wallet.reset()}>disconnect</button>
                        <DButton onClick={() => this.getMyBalance(wallet.account)}>Get Balance</DButton>
                    </div>
                    } */}
                    
                    {(wallet.status === 'disconnected' || wallet.status === 'error') &&
                        <DButton key="connect-btn" onClick={()=>{
                            wallet.connect('injected');
                        }}>Connect with wallet</DButton>
                    }

                    {(wallet.status === 'connecting' || wallet.status === 'connected' || isLoading) &&
                        <LoadingIcon key="loading-icon"/>
                    }
                </div>
            </motion.div>
        </div>
    }
}

export default withWalletHook(TitleScreen);