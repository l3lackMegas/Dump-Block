import { Component } from 'react'

// Dependencies
import { AnimatePresence, motion } from 'framer-motion'
import Web3 from 'web3'

// Components
import { DButton, LoadingIcon, withWalletHook } from '../../common'

// Styles
import styles from '/style.module.css'

// Contracts
import ContractToken from "../../../../solidity/build/contracts/DumpBlockToken.json";
import ContractAccount from "../../../../solidity/build/contracts/DumpBlockAccount.json";

interface IRecipeProps {
    wallet: any
}

class TitleScreen extends Component<IRecipeProps> {

    constructor(props: IRecipeProps | Readonly<IRecipeProps>) {
        super(props);
        
    }

    state = {
        isLoading: false
    }

    componentDidMount() {
        const wallet = this.props.wallet;
        let blockNumber: number = wallet.getBlockNumber();   
    }

    async getMyBalance(account?: string | null){
		console.log(account);
		if(!account) return 0;
		const provider = new Web3(window.ethereum);
		let UserToken = new provider.eth.Contract(ContractToken.abi, "0x610e8090493234AbB750BE275796325e4F76745B");
		let GameAccount = new provider.eth.Contract(ContractAccount.abi, "0xFf953e06F26EA8D5094a00b11C26ad4514986A6c");
		

		this.setState({isLoading: true});


		let allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();

		console.log("allowanceBefore", provider.utils.fromWei(allowanceAfter.toString()));

		UserToken.methods.approve(GameAccount.options.address, provider.utils.toWei("500", "ether")).send({from: account})
		.then(async () => {
			allowanceAfter = await UserToken.methods.allowance(account, GameAccount.options.address).call();

			console.log("allowanceAfter", provider.utils.fromWei(allowanceAfter.toString()));
			
			console.log("UserToken before balance", provider.utils.fromWei((await UserToken.methods.balanceOf(account).call()).toString()));
			// console.log("before balance", provider.utils.fromWei((await GameAccount.methods.balance().call()).toString()));
			
			let result = await GameAccount.methods.deposit(provider.utils.toWei("100", "ether")).send({from: account});
			
			console.log("After balance", provider.utils.fromWei((await GameAccount.methods.balance().call()).toString()));
			// console.log("After balance", readableBalance);
			this.setState({isLoading: false});
		}).catch((err: any) => {
			console.log(err);
			this.setState({isLoading: false});
		});

		
	};

    render() {

        const wallet = this.props.wallet
        const { isLoading } = this.state
        
        return <>
            <div className="container center">
		{wallet.status === 'connected' &&
        <div>
          <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div>
          <button onClick={() => wallet.reset()}>disconnect</button>
		  <DButton onClick={() => this.getMyBalance(wallet.account)}>Get Balance</DButton>
        </div>
		}

		{(wallet.status === 'disconnected' || wallet.status === 'error') &&
			<DButton onClick={()=>{
				wallet.connect('injected');
			}}>Conenct with wallet</DButton>
		}

		{(wallet.status === 'connecting'  || isLoading) &&
			<LoadingIcon/>
		}
	</div>
        </>
    }
}

export default withWalletHook(TitleScreen);