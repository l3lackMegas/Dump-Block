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
import { getMyBalance, depositMyBalance, withdrawMyBalance, mintHero } from '../../../utils/handleContract'

interface IRecipeProps {
    wallet: any
}

class UserInfo extends Component<IRecipeProps> {

    constructor(props: IRecipeProps | Readonly<IRecipeProps>) {
        super(props);
        
    }

    state = {
        isBalanceLoading: true,
        balance: 0
    }

    async componentDidMount() {
        const wallet = this.props.wallet;
        let blockNumber: number = wallet.getBlockNumber();   
        this.setState({
            isBalanceLoading: false,
            balance: await getMyBalance(wallet.account)
        })
    }

    render() {
        const wallet = this.props.wallet;
        const { balance, isBalanceLoading } = this.state;
        return <motion.div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 100,
                backgroundColor: 'rgba(0, 0, 0, .5)',
                borderBottom: '3px #57454e solid',
                zIndex: 100,
                // boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, .5)',
            }}
            initial={{
                y: -100,
                backdropFilter: 'blur(0px) saturate(0%)',
            }}
            animate={{
                y: 0,
                backdropFilter: 'blur(25px) saturate(130%)',
                transition: {
                    duration: .65,
                    ease: 'easeOut'
                }
            }}
            exit={{
                y: -100,
            }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}>
                <div className={styles.userSection}>
                    <p style={{color: '#ccc'}}>Account:</p>
                    <p>{wallet.account}</p>
                </div>
                <div className={styles.coinSection}>
                    <span style={{marginLeft: 10}}></span>
                    <DButton mode={['mini', 'outline']} onClick={async ()=>{
                        await depositMyBalance(wallet.account, 500)
                        this.setState({
                            balance: await getMyBalance(wallet.account)
                        })
                    }}>Deposit</DButton>
                    <span style={{marginLeft: 10}}></span>
                    <DButton disabled={balance == 0} mode={['mini', 'outline']} onClick={async ()=>{
                        await withdrawMyBalance(wallet.account, balance)
                        this.setState({
                            balance: await getMyBalance(wallet.account)
                        })
                    }}>Withdraw</DButton>
                    <span style={{marginLeft: 20}}></span>
                    <FontAwesomeIcon icon={faCoins} />
                    <span style={{margin: '0 10px 0 5px'}}>
                        {balance}
                    </span>
                </div>
            </div>
        </motion.div>
    }
}

export default withWalletHook(UserInfo);