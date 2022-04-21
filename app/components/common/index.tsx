import { motion } from 'framer-motion';
import { Children, DOMAttributes, MouseEventHandler } from 'react';

import bsc, { useWallet } from '@binance-chain/bsc-use-wallet'

import styles from './styles.module.scss';
export const LoadingIcon = (
{
    duration
} : {
    duration?: number
}) => {

    return <motion.div
    className="loading-icon"
    animate={{
        scale: [0.75, 0.6, 2, 1.5, 1.5, 2, 0.6, 0.75],
        opacity: [1, 0.5, 1, 1, 1, 1, 0.5, 1],
        rotate: [0, 0, 300, 270, 270, 320, 0, 0],
        borderRadius: ["50%", "50%", "0%", "0%", "0%", "0%", "50%", "50%"],
    }}
    transition={{
        duration: duration || 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 0.2, 0.1, 0.2],
        repeat: Infinity,
        repeatDelay: 0.5
    }}
/>;
};

export const DButton = ( { children, onClick } : {
    onClick?: MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode;
}) => {
    
    return <button className={styles.dButton} onClick={(event)=>{onClick && onClick(event)}} >
        {children}
    </button>
}


export const withWalletHook = (Component: any) =>{
    return function WrappedComponent(props: any) {
        const wallet = useWallet()
        return <Component {...props} wallet={wallet} />;
    }
}