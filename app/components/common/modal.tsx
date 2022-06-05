import { Children, DOMAttributes, MouseEventHandler } from 'react';
import { AnimatePresence, motion, MotionStyle } from "framer-motion"

export const Modal = ( { children, style, onClose } : {
    children?: React.ReactNode
    style?: MotionStyle
    onClose?: MouseEventHandler<HTMLDivElement>
}) => {
    return <motion.div
        style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.25)',
            zIndex: 99999
        }}
        initial={{
            opacity: 0,
        }}
        animate={{
            opacity: 1,
        }}
        exit={{
            opacity: 0,
        }}
    >
        <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
        }}
        onClick={onClose}
        ></div>
        <motion.div className='container center' style={{
            minHeight: 200,
            minWidth: 200,
            backgroundColor: 'white',
            overflow: 'hidden',
            borderRadius: 10,
            ...style,
        }}
        initial={{ 
            opacity: 0,
            transform: 'translate(-50%, -50%) scaleY(0)',
        }}
        animate={{
            opacity: 1,
            transform: 'translate(-50%, -50%) scaleY(1)',
        }}
        exit={{
            opacity: 0,
            transform: 'translate(-50%, -50%) scaleY(0)',
            transition: {
                duration: .25,
                ease: 'easeOut'
            }
        }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'auto',
            }}>
                { children }
            </div>
        </motion.div>
    </motion.div>
}