// Dependencies
import Web3 from 'web3'

// Contracts
import * as ContractToken from "../../solidity/build/contracts/DumpBlockToken.json";
import * as ContractAccount from "../../solidity/build/contracts/DumpBlockAccount.json";
import * as ContractHero from "../../solidity/build/contracts/DumpHero.json";

/* Global State */
import { IGameState } from '../store/GameState'
import RootStore from '../store/index'

let TokenAddress = '0x1582711BA9580d846310accC32a0700983d3AeDB';
let GameAddress = '0x1c7f7a9a822af4aF8574F21B5B1707538751Bd47';
let HeroAddress = '0xF975328Fe752188c4D729a907EB6d89cD5cfE514';

export async function getMyBalance(account?: string | null){
    console.log(account)
    
    if(!account) return 0
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: true,
            message: 'Checking balance...'
        }
    })
    const provider = new Web3(window.ethereum)
    // let contractToken: any = ContractToken;
    let contractAccount: any = ContractAccount;
    // let UserToken = new provider.eth.Contract(contractToken.abi, TokenAddress);
    let GameAccount = new provider.eth.Contract(contractAccount.abi, GameAddress);
    

    // let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();

    // console.log("allowanceBefore", provider.utils.fromWei(allowanceAfter.toString()));
    console.log(account)
    // console.log(provider.utils.fromWei((await GameAccount.methods.balance().call()).toString()));
    let balanceAmount = provider.utils.fromWei((await GameAccount.methods.balanceOf(account).call()).toString())
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: false,
            message: 'Done'
        }
    })
    return balanceAmount
};

export async function withdrawMyBalance(account: string, amount: number){
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: true,
            message: 'Comfirming transaction...'
        }
    })
    return new Promise(async (resolve, reject) => {
        console.log(account, amount)
    
        if(!account) return 0
        const provider = new Web3(window.ethereum)
        let contractToken: any = ContractToken;
        let contractAccount: any = ContractAccount;
        let UserToken = new provider.eth.Contract(contractToken.abi, TokenAddress);
        let GameAccount = new provider.eth.Contract(contractAccount.abi, GameAddress);
    
        // let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();
    
        // console.log("allowanceBefore", provider.utils.fromWei(allowanceAfter.toString()));
    
        UserToken.methods.approve(GameAccount.options.address, provider.utils.toWei(amount.toString(), "ether")).send({from: account})
        .then(async () => {
            let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();
    
            console.log("allowanceAfter", provider.utils.fromWei(allowanceAfter.toString()));
            
            console.log("UserToken before balance", provider.utils.fromWei((await UserToken.methods.balanceOf(account).call()).toString()));
            // console.log("before balance", provider.utils.fromWei((await GameAccount.methods.balance().call()).toString()));
            RootStore.dispatch({
                type: 'SET_LOADING_STATUS',
                data: {
                    isLoading: true,
                    message: 'Withdrawing...'
                }
            })

            try {
                let result = await GameAccount.methods.withdraw(provider.utils.toWei(amount.toString(), "ether")).send({from: account});   
            } catch (error) {
                RootStore.dispatch({
                    type: 'SET_LOADING_STATUS',
                    data: {
                        isLoading: false,
                        message: 'Failed'
                    }
                })
            }
            
            console.log("After balance", provider.utils.fromWei((await GameAccount.methods.balanceOf(account).call()).toString()));
            // console.log("After balance", readableBalance);
            RootStore.dispatch({
                type: 'SET_LOADING_STATUS',
                data: {
                    isLoading: false,
                    message: 'Done'
                }
            })
            resolve(true);
        }).catch((err: any) => {
            console.log(err);
            RootStore.dispatch({
                type: 'SET_LOADING_STATUS',
                data: {
                    isLoading: false,
                    message: 'Done'
                }
            })
            resolve(false);
        });
    })
};

export async function depositMyBalance(account: string, amount: number){
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: true,
            message: 'Comfirming transaction...'
        }
    })
    return new Promise(async (resolve, reject) => {
        console.log(account, amount)
    
        if(!account) return 0
        const provider = new Web3(window.ethereum)
        let contractToken: any = ContractToken;
        let contractAccount: any = ContractAccount;
        let UserToken = new provider.eth.Contract(contractToken.abi, TokenAddress);
        let GameAccount = new provider.eth.Contract(contractAccount.abi, GameAddress);
    
        // let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();
    
        // console.log("allowanceBefore", provider.utils.fromWei(allowanceAfter.toString()));
    
        UserToken.methods.approve(GameAccount.options.address, provider.utils.toWei(amount.toString(), "ether")).send({from: account})
        .then(async () => {
            let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();
    
            console.log("allowanceAfter", provider.utils.fromWei(allowanceAfter.toString()));
            RootStore.dispatch({
                type: 'SET_LOADING_STATUS',
                data: {
                    isLoading: true,
                    message: 'Depositing...'
                }
            })
            
            console.log("UserToken before balance", provider.utils.fromWei((await UserToken.methods.balanceOf(account).call()).toString()));
            // console.log("before balance", provider.utils.fromWei((await GameAccount.methods.balance().call()).toString()));

            try {
                let result = await GameAccount.methods.deposit(provider.utils.toWei(amount.toString(), "ether")).send({from: account});
            } catch (error) {
                RootStore.dispatch({
                    type: 'SET_LOADING_STATUS',
                    data: {
                        isLoading: false,
                        message: 'Failed'
                    }
                })
            }
            
            console.log("After balance", provider.utils.fromWei((await GameAccount.methods.balanceOf(account).call()).toString()));
            // console.log("After balance", readableBalance);
            RootStore.dispatch({
                type: 'SET_LOADING_STATUS',
                data: {
                    isLoading: false,
                    message: 'Done'
                }
            })
            resolve(true);
        }).catch((err: any) => {
            console.log(err);
            RootStore.dispatch({
                type: 'SET_LOADING_STATUS',
                data: {
                    isLoading: false,
                    message: 'Done'
                }
            })
            resolve(false);
        });
    })
};

export async function mintHero(account: string | null, urlToken: string){
    console.log(account)
    
    if(!account) return 0
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: true,
            message: 'Testing...'
        }
    })
    const provider = new Web3(window.ethereum)
    // let contractToken: any = ContractToken;
    let contractAccount: any = ContractAccount;
    let contractHero: any = ContractHero;
    // let UserToken = new provider.eth.Contract(contractToken.abi, TokenAddress);
    let GameAccount = new provider.eth.Contract(contractAccount.abi, GameAddress);
    let HeroContract = new provider.eth.Contract(contractHero.abi, HeroAddress);


    let transaction = await HeroContract.methods.mintHero(account, urlToken).send({from: account});
    console.log(transaction)
    const web3 = new Web3(window.ethereum);
    let reciept = await web3.eth.getTransactionReceipt(transaction.transactionHash);
    console.log(reciept);
    let heroId = Web3.utils.hexToNumber(reciept.logs[0].topics[3]);
    
    console.log(heroId);

    // get uri token
    let uri = await HeroContract.methods.tokenURI(heroId).call()

    console.log(uri);
    

    // let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();

    // console.log("allowanceBefore", provider.utils.fromWei(allowanceAfter.toString()));
    
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: false,
            message: 'Done'
        }
    })
    return uri
};

export async function getAllHero(account: string){
    console.log(account)
    
    if(!account) return 0
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: true,
            message: 'Geting hero...'
        }
    })
    const provider = new Web3(window.ethereum)
    // let contractToken: any = ContractToken;
    let contractAccount: any = ContractAccount;
    let contractHero: any = ContractHero;
    // let UserToken = new provider.eth.Contract(contractToken.abi, TokenAddress);
    let GameAccount = new provider.eth.Contract(contractAccount.abi, GameAddress);
    let HeroContract = new provider.eth.Contract(contractHero.abi, HeroAddress);

    let balanceAmount = parseInt(await HeroContract.methods.balanceOf(account).call());
    
    let uriList = [];
    for(let i = 0; i < balanceAmount; i++){
        let heroId = await HeroContract.methods.tokenOfOwnerByIndex(account, i).call()
        console.log(heroId);
        let uri = await HeroContract.methods.tokenURI(heroId).call()
        console.log(uri);
        uriList.push(uri);
    }
    // get uri token
    

    console.log(uriList);
    

    // let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();

    // console.log("allowanceBefore", provider.utils.fromWei(allowanceAfter.toString()));
    
    RootStore.dispatch({
        type: 'SET_LOADING_STATUS',
        data: {
            isLoading: false,
            message: 'Done'
        }
    })
    return uriList
};