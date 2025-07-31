import {motion} from 'framer-motion';
import React from 'react';
import '../index.css'; // Assuming you have a global CSS file

const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 0
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.5,
            type: "spring",
            damping: 25,
            stiffness: 500
        }
    },
    exit: {
        y: "100vh",
        opacity: 0
       
    }
}; 


const Modal = ({handleClose, text}) => {
    return (
            <motion.div onClick={e => e.stopPropagation()}
            className="modal"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit">
                <motion.button className="close-button" 
                  whileHover={{ rotate: 10 }}
                   transition={{
                 duration: 0.05
                }}
                whileTap={{ scale: 0.9 }}
                
                onClick={handleClose}>Close</motion.button>
            </motion.div>
    );
};

export default Modal;