import { motion, MotionStyle } from 'framer-motion';
import { Children, DOMAttributes, MouseEventHandler } from 'react';

import bsc, { useWallet } from '@binance-chain/bsc-use-wallet'

import styles from './styles.module.scss';
export const LoadingIcon = (
{
    duration,
    elmKey
} : {
    duration?: number
    elmKey?: string
}) => {

    return <motion.div
    key={elmKey}
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
    exit={{
        scale: 0.5,
        opacity: 0,
        transition: {
            delay: 0.5,
            duration: 0.5,
        }
    }}
/>;
};

export const DButton = ( { children, onClick, elmKey, mode, style, disabled } : {
    onClick?: MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode;
    elmKey?: string;
    mode?: Array<String>;
    disabled?: boolean;
    style?: MotionStyle
}) => {

    let classSets = "";
    if(mode) {
        mode.forEach((item: String) => {
            classSets += ' ' + styles['' + item];
        });
    }
    
    return <motion.button disabled={disabled} key={elmKey} className={
        styles.dButton + ' ' + classSets }
        onClick={(event)=>{onClick && onClick(event)}}
        style={style}
    >
        {children}
    </motion.button>
}


export const withWalletHook = (Component: any) =>{
    return function WrappedComponent(props: any) {
        const wallet = useWallet()
        return <Component {...props} wallet={wallet} />;
    }
}