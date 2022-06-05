import { Component } from 'react'

// Dependencies
import { AnimatePresence, motion } from 'framer-motion'
import Web3 from 'web3'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { connect } from "react-redux";

// Components
import { DButton, LoadingIcon, withWalletHook } from '../../common'

// Styles
import styles from './styles.module.scss'

/* Global State */
import { IGameState } from '../../../store/GameState'
import { IUserState } from '../../../store/UserInfo'
import RootStore from '../../../store/index'

// Contracts
import * as ContractToken from "../../../../solidity/build/contracts/DumpBlockToken.json";
import * as ContractAccount from "../../../../solidity/build/contracts/DumpBlockAccount.json";
import { head } from 'lodash'

// Utilities
import { getMyBalance, getAllHero, mintHero, burnHero, mintPass, getPassAmount } from '../../../utils/handleContract'
import env from '../../../utils/env'

const { APP_URL } = env

interface IRecipeProps {
    wallet: any
    dispatch: any
    user: IUserState
}

interface IState {
    isBalanceLoading: boolean,
    balance: number,
    characterData: any,
    isNoCharacter: boolean,
    charIndex: number
}

class MainMenu extends Component<IRecipeProps> {

    constructor(props: IRecipeProps | Readonly<IRecipeProps>) {
        super(props);
        this.updateUserInfo = this.updateUserInfo.bind(this)    
    }

    state: IState = {
        isBalanceLoading: true,
        balance: 0,
        characterData: null,
        isNoCharacter: false,
        charIndex: 0
    }

    async componentDidMount() {
        const wallet = this.props.wallet;
        let blockNumber: number = wallet.getBlockNumber();   
        this.setState({
            isBalanceLoading: false,
            balance: await getMyBalance(wallet.account)
        })
        this.getAllHeroData();
    }

    async updateUserInfo() {
        const wallet = this.props.wallet;
        this.props.dispatch({
            type: 'SET_USER_INFO',
            info: {
                ...this.props.user.info,
                balance: await getMyBalance(wallet.account),
                pass: await getPassAmount(wallet.account),
            }
        });
    }

    async getAllHeroData() {
        const wallet = this.props.wallet;
        let characterList: Array<any> = (await getAllHero(wallet.account)) || [];

        if(characterList.length > 0) {
            let charListData: Array<any> = [];
            for(let i = 0; i < characterList.length; i++) {
                let characterLink = characterList[i].uri;
                try {
                    // await burnHero(wallet.account, characterList[i].id);
                    let res = await fetch(APP_URL + characterLink);
                    let charData = await res.json();
                    charListData.push({
                        ...charData,
                        heroId: characterList[i].id
                    });
                } catch (error) {
                    
                }
            }
            this.props.dispatch({
                type: 'SET_USER_INFO',
                info: {
                    ...this.props.user.info,
                    characterList: charListData
                }
            });
            this.setState({
                isNoCharacter: false
            })
        } else {
            this.props.dispatch({
                type: 'SET_USER_INFO',
                info: {
                    ...this.props.user.info,
                    characterList: []
                }
            });
            this.setState({
                isNoCharacter: true
            })
        }
    }

    randomRange() {
        let num = Math.random() * 8
        return num < 1 ? 1 : Math.floor(num);
    }

    render() {
        const wallet = this.props.wallet;
        const { user } = this.props;
        const { charIndex, balance, isBalanceLoading, isNoCharacter } = this.state;
        const characterData = user.info && user.info.characterList && user.info.characterList.length > 0 ? user.info.characterList[charIndex] : null;
        const charLength = user.info && user.info.characterList ? user.info.characterList.length : 0;
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
                {charLength > 0 && 
                    <p style={{
                        margin: 0,
                        padding: '5px 0',
                        color: 'white',
                        textAlign: 'center',
                    }}
                    >{charIndex + 1} / {charLength}</p>
                }
                
                <div className='container center'>
                    {characterData == null && isNoCharacter == false && <LoadingIcon/>}
                    {isNoCharacter && <h1 style={{ color: 'white' }}>No character yet...</h1>}
                    {characterData != null && <>
                        <img height={200} src={'/char-info/' + characterData.image}/>
                        <h2 style={{margin: '0', color: 'white'}}>{characterData.name}</h2>
                        <p style={{marginBottom: '0', color: 'rgba(255, 255, 255, .5)'}}>Power: {characterData.attributes[0].value}</p>
                    </>}
                </div>

                <motion.div style={{
                        display: charIndex > 0 ? '' : 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 50,
                        height: '100%',
                        color: 'white',
                        fontSize: '2em',
                        cursor: 'pointer',
                    }}
                    whileHover={{
                        backgroundColor: 'rgba(0, 0, 0, .25)'
                    }}
                    onClick={() => {
                        this.setState({
                            charIndex: (charIndex - 1) < 0 ? charLength - 1 : charIndex - 1
                        })
                    }}
                >
                    <FontAwesomeIcon style={{top: '60%'}} className='container center' icon={faChevronLeft}/>
                </motion.div>

                <motion.div style={{
                        display: (charIndex + 1) == charLength ? 'none' : '',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 50,
                        height: '100%',
                        color: 'white',
                        fontSize: '2em',
                        cursor: 'pointer',
                    }}
                    whileHover={{
                        backgroundColor: 'rgba(0, 0, 0, .25)'
                    }}
                    onClick={() => {
                        this.setState({
                            charIndex: (charIndex + 1) % charLength
                        })
                    }}
                >
                    <FontAwesomeIcon style={{top: '60%'}} className='container center' icon={faChevronRight}/>
                </motion.div>
                

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
                                await mintHero(wallet.account, "/char-info/" + this.randomRange() + '/index.json')
                                await this.getAllHeroData();
                            }}
                        >Get Hero</DButton>
                        <DButton mode={['outline']}
                            onClick={async ()=>{
                                await mintPass(wallet.account, 5);
                                this.updateUserInfo();
                            }}
                        >Buy PASS</DButton>
                    </div>
                    <DButton style={{
                        width: '100%',
                    }}>Play!</DButton>
                </div>
            </div>
        </motion.div>
    }
}

export default withWalletHook(connect(
    //mapStateToProps,
    (state: any) => ({
        user: state.userInfo
    })
    // mapDispatchToProps,  that's another subject
)(MainMenu));