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
import { getMyBalance, getAllHero, mintHero, burnHero, playGame, mintPass, burnPass, getPassAmount } from '../../../utils/handleContract'
import env from '../../../utils/env'

const { APP_URL } = env

interface IRecipeProps {
    wallet: any
    dispatch: any
    user: IUserState
    heroId: number
}

interface IState {
    isBalanceLoading: boolean,
    balance: number
    characterData: any
    isNoCharacter: boolean
    charIndex: number
    isShowResult: boolean
    resultData: any
}

class PlayMenu extends Component<IRecipeProps> {

    constructor(props: IRecipeProps | Readonly<IRecipeProps>) {
        super(props);
        this.updateUserInfo = this.updateUserInfo.bind(this)    
        this.showResult = this.showResult.bind(this);
    }

    state: IState = {
        isBalanceLoading: true,
        balance: 0,
        characterData: null,
        isNoCharacter: false,
        charIndex: 0,
        isShowResult: false,
        resultData: {
            success: false,
            rand: 0,
            chance: 0
        }
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

    async showResult(result: any) {
        await this.updateUserInfo();
        this.setState({
            isShowResult: true,
            resultData: result
        });
    }

    render() {
        const wallet = this.props.wallet;
        const { user } = this.props;
        const { balance, isBalanceLoading, isNoCharacter, isShowResult, resultData } = this.state;
        const passToken = user.info?.pass || 0;
        const charIndex = this.props.heroId;
        const characterData = user.info && user.info.characterList && user.info.characterList.length > 0 ? user.info.characterList[charIndex] : null;

        const chanceRate = characterData != null ? characterData.attributes[0].value * 10 : 0;
        const carCost = characterData != null ? 
            (characterData.attributes[0].value / 100) * 2
         : 0;
        

        console.log(charIndex)
        
        return <motion.div
            style={{
                width: '100%',
                height: '100%',
            }}
            initial={{
                y: 200,
                opacity: 0
            }}
            animate={{
                y: 0,
                opacity: 1
            }}
            exit={{
                y: 200,
                opacity: 0,
                transition: {
                    duration: 0.25
                }
            }}
            transition={{
                duration: .5,
                ease: 'easeInOut'
            }}
        >
        <div style={{width: '100%', height: 150}}></div>
        <div style={{
            position: 'relative',
            width: '100%',
            height: 300,
        }}>
            <div className='container center'>
                {characterData == null && isNoCharacter == false && <LoadingIcon/>}
                {isNoCharacter && <h1 style={{ color: 'white' }}>No character yet...</h1>}
                {characterData != null && <>
                    <img height={200} src={'/char-info/' + characterData.image}/>
                    <h2 style={{margin: '0', color: 'white'}}>{characterData.name}</h2>
                    <p style={{marginBottom: '0', color: 'rgba(255, 255, 255, .5)'}}>Energy: {characterData.attributes[0].value}</p>
                    <p style={{ color: 'orange' }}>
                        <span>You have chance to win </span>
                        <FontAwesomeIcon icon={faCoins} />
                        <span> {chanceRate} !</span>
                    </p>
                </>}
            </div>
        </div>
        <div style={{width: '100%', height: 50}}></div>
        <motion.div
            style={{
                margin: '0 auto',
                width: '80vw',
                maxWidth: 1000,
                backgroundColor: 'rgba(0, 0, 0, .5)',
                borderBottom: '3px #57454e solid',
                borderTop: '3px #57454e solid',
                zIndex: 100,
                // boxShadow: '0px 0px 20px 1px rgba(0, 0, 0, .5)',
            }}
            initial={{
                opacity: 0,
                backdropFilter: 'blur(0px) saturate(0%)',
            }}
            animate={{
                opacity: 1,
                backdropFilter: 'blur(25px) saturate(130%)',
                transition: {
                    duration: .45,
                    ease: 'easeOut'
                }
            }}
            exit={{
                opacity: 0
            }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                color: 'white',
                textAlign: 'center',
            }}>
                { !isShowResult && <div style={{
                    padding: '30px 20px',
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                }}>
                    <DButton disabled={passToken < 5 + carCost} style={{
                        width: '100%',
                        marginBottom: '10px',
                    }}
                    onClick={async () => {
                        let result = await playGame(wallet.account, 5 + carCost, chanceRate, 40);
                        this.showResult(result);
                    }}
                    >
                        <span>Take a walk {'(40%)'}: </span>
                        <FontAwesomeIcon icon={faCoins} />
                        <span> {5 + carCost} PASS</span>
                    </DButton>
                    <DButton disabled={passToken < 10 + carCost} style={{
                        width: '100%',
                        marginBottom: '10px',
                    }}
                    onClick={async () => {
                        let result = await playGame(wallet.account, 10 + carCost, chanceRate, 80);
                        this.showResult(result);
                    }}
                    >
                        <span>Find treasure {'(80%)'}: </span>
                        <FontAwesomeIcon icon={faCoins} />
                        <span> {10 + carCost} PASS</span>
                    </DButton>
                    <DButton mode={['outline']} style={{
                        width: '100%',
                    }}
                        onClick={async ()=>{
                        Router.back();
                    }}
                    >Back</DButton>
                </div> }

                { isShowResult && <div style={{
                    padding: '30px 20px',
                }}>
                    <h1 style={{ marginTop: 0 }}>Result</h1>
                    {resultData.success && <>
                        <h2 style={{ color: 'green' }}>You Win !</h2>
                        <p style={{ color: 'rgba(255, 255, 255, .5)' }}>Got {resultData.rand} From {resultData.chance}</p>
                        <p style={{ color: 'orange' }}>
                            <span>You will reciept your </span>
                            <FontAwesomeIcon icon={faCoins} />
                            <span> {chanceRate} !</span>
                        </p>
                    </>}

                    {!resultData.success && <>
                        <h2 style={{ color: 'red' }}>You Failed !</h2>
                        <p style={{ color: 'rgba(255, 255, 255, .5)' }}>Got {resultData.rand} From {resultData.chance}</p>
                    </>}

                    <DButton style={{
                        width: '100%',
                    }}
                        onClick={async ()=>{
                        Router.back();
                    }}
                    >Back</DButton>
                </div>}
            </div>
        </motion.div>
        </motion.div>
    }
}

export default withWalletHook(connect(
    //mapStateToProps,
    (state: any) => ({
        user: state.userInfo
    })
    // mapDispatchToProps,  that's another subject
)(PlayMenu));