import { Component } from 'react'

// Dependencies
import { AnimatePresence, motion } from 'framer-motion'
import Web3 from 'web3'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

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
import { head } from 'lodash'

// Utilities
import { getMyBalance, getAllHero, mintHero } from '../../../utils/handleContract'

interface IRecipeProps {
    wallet: any
}

interface IState {
    isBalanceLoading: boolean,
    balance: number,
    characterData: any,
    isNoCharacter: boolean,
}

class MainMenu extends Component<IRecipeProps> {

    constructor(props: IRecipeProps | Readonly<IRecipeProps>) {
        super(props);
        
    }

    state: IState = {
        isBalanceLoading: true,
        balance: 0,
        characterData: null,
        isNoCharacter: false
    }

    async componentDidMount() {
        const wallet = this.props.wallet;
        let blockNumber: number = wallet.getBlockNumber();   
        this.setState({
            isBalanceLoading: false,
            balance: await getMyBalance(wallet.account)
        })

        let characterList: Array<any> = (await getAllHero(wallet.account)) || [];

        if(characterList.length > 0) {

            fetch(characterList[0])
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    characterData: data
                });  
            })
        } else [
            this.setState({
                isNoCharacter: true
            })
        ]
    }

    render() {
        const wallet = this.props.wallet;
        const { balance, isBalanceLoading, characterData, isNoCharacter } = this.state;
        return <motion.div
            style={{
                position: 'absolute',
                top: 'calc(50% + 50px)',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80vw',
                height: '70vh',
                maxWidth: 1000,
                maxHeight: 600,
                backgroundColor: 'rgba(0, 0, 0, .5)',
                borderBottom: '3px #57454e solid',
                borderTop: '3px #57454e solid',
                zIndex: 100,
                // boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, .5)',
            }}
            initial={{
                transform: 'translate(-50%, -50%) scaleY(0.2)',
                opacity: 0,
                backdropFilter: 'blur(0px) saturate(0%)',
            }}
            animate={{
                transform: 'translate(-50%, -50%) scaleY(1)',
                opacity: 1,
                backdropFilter: 'blur(25px) saturate(130%)',
                transition: {
                    duration: .45,
                    ease: 'easeOut'
                }
            }}
            exit={{
                transform: 'translate(-50%, -50%) scaleY(0.2)',
                opacity: 0
            }}
        >
            <motion.div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '70%',
                    backgroundColor: 'rgba(255, 255, 255, .05)',
                }}
            >
                <div className='container center'>
                    {characterData == null && isNoCharacter == false && <LoadingIcon/>}
                    {isNoCharacter && <h1 style={{ color: 'white' }}>No character yet...</h1>}
                    {characterData != null && <>
                        <img src={characterData.image}/>
                        <h2 style={{margin: '0', color: 'white'}}>{characterData.name}</h2>
                    </>}
                </div>
            </motion.div>
            <div style={{
                position: 'relative',
                width: '100%',
                height: '30%',
            }}>
                <div className='container center' style={{
                    width: '100%',
                }}>
                    <div className={styles.flexBtn} style={{ display: 'flex' }}>
                        <DButton mode={['outline']}
                            onClick={async () => {
                                await mintHero(wallet.account, "https://ipfs.io/ipfs/Qmd9MCGtdVz2miNumBHDbvj8bigSgTwnr4SbyH6DNnpWdt?filename=1-PUG.json")
                                await getAllHero(wallet.account);
                            }}
                        >Get Hero</DButton>
                        <DButton mode={['outline']}
                            onClick={async ()=>{
                                await getAllHero(wallet.account);
                            }}
                        >Choose Hero</DButton>
                    </div>
                    <DButton style={{
                        width: '100%',
                    }}>Play!</DButton>
                </div>
            </div>
        </motion.div>
    }
}

export default withWalletHook(MainMenu);