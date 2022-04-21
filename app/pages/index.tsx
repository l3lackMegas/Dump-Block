import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

// Dependencies
import { motion } from 'framer-motion'

// Components

// Scences
import TitleScreen from '../components/scene/title-screen'

// Styles
import styles from '../styles/Home.module.scss'

// Contracts
import ContractToken from "../../solidity/build/contracts/DumpBlockToken.json";
import ContractAccount from "../../solidity/build/contracts/DumpBlockAccount.json";


declare global {
    interface Window { ethereum: any; }
}

const Home: NextPage = () => {
	
	return <>
		<TitleScreen />
	</>;
}

export default Home
