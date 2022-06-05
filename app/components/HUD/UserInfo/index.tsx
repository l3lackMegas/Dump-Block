import { Component } from 'react'

// Dependencies
import { AnimatePresence, motion } from 'framer-motion'
import Web3 from 'web3'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

// Components
import { DButton, LoadingIcon, withWalletHook } from '../../common'
import { Modal } from '../../common/modal'

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
        this.depositBalance = this.depositBalance.bind(this);
    }

    state = {
        isBalanceLoading: true,
        balance: 0,
        showDepositModal: true,
    }

    async componentDidMount() {
        const wallet = this.props.wallet;
        let blockNumber: number = wallet.getBlockNumber();   
        this.setState({
            isBalanceLoading: false,
            balance: await getMyBalance(wallet.account)
        })
    }

    async depositBalance(amount: number) {
        const wallet = this.props.wallet;
        await depositMyBalance(wallet.account, amount)
        this.setState({
            balance: await getMyBalance(wallet.account),
            showDepositModal: false
        });
    }

    render() {
        const wallet = this.props.wallet;
        const { balance, isBalanceLoading, showDepositModal } = this.state;
        return <>
            <AnimatePresence exitBeforeEnter>
                {showDepositModal &&
                <Modal style={{
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    backdropFilter: 'blur(25px) saturate(130%)',
                    borderTop: '3px #57454e solid',
                    borderBottom: '3px #57454e solid',
                }}
                onClose={()=>{
                    this.setState({
                        showDepositModal: false
                    })
                }}>
                    <h1>Deposit</h1>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gridGap: '1rem',
                        alignItems: 'center',
                        justifyItems: 'center',
                        margin: '1rem 0',
                    }}>
                        <DButton onClick={async ()=>{
                            this.depositBalance(100);
                        }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> 100</span>
                        </DButton>

                        <DButton onClick={async ()=>{
                            this.depositBalance(300);
                        }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> 300</span>
                        </DButton>

                        <DButton onClick={async ()=>{
                            this.depositBalance(500);
                        }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> 500</span>
                        </DButton>
                        <DButton onClick={async ()=>{
                            this.depositBalance(1000);
                        }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> 1000</span>
                        </DButton>
                        <DButton onClick={async ()=>{
                            this.depositBalance(2000);
                        }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> 2000</span>
                        </DButton>
                        <DButton onClick={async ()=>{
                            this.depositBalance(5000);
                        }}>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> 5000</span>
                        </DButton>
                    </div>
                </Modal>
                }
            </AnimatePresence>
            
            <motion.div
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
                            this.setState({
                                showDepositModal: true
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
        </>
    }
}

export default withWalletHook(UserInfo);