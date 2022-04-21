import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { UseWalletProvider } from '@binance-chain/bsc-use-wallet'
import bsc from '@binance-chain/bsc-use-wallet'

function MyApp({ Component, pageProps }: AppProps) {
	return <UseWalletProvider chainId={97}>
		<Component {...pageProps} />
	</UseWalletProvider>
}

export default MyApp
