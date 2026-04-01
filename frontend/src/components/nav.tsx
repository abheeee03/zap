import Logo from './logo'
import {motion} from 'motion/react'

function LandingNav({onStart}:{onStart?: ()=>void}) {
  return (
    <motion.div 
    initial={{y: -100}}
    transition={{delay: 0.3}}
    animate={{y: 0}}
    className='fixed w-full flex items-center justify-center py-4 px-2'>
        <div className="flex items-center justify-between border-t shadow rounded-3xl w-full max-w-2xl px-3 py-2">
            <div className="flex gap-3 items-center justify-center">
            <Logo size='xs'/>
            <h1 className='text-lg font-semibold'>
                 Zap
            </h1>
            </div>
            <div className="px-2">
                <button 
                onClick={onStart}
                >Get Started</button>
            </div>
        </div>
    </motion.div>
  )
}

export default LandingNav