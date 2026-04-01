import { Link } from 'react-router-dom'
import Logo from './logo'

function LandingNav() {
  return (
    <div className='fixed w-full flex items-center justify-center py-4'>
        <div className="flex items-center justify-between border-t shadow rounded-3xl w-full max-w-2xl px-3 py-2">
            <div className="flex gap-3 items-center justify-center">
            <Logo size='xs'/>
            <h1 className='text-lg font-semibold'>
                 Zap
            </h1>
            </div>
            <div className="px-2">
                <Link to={'/home'}>Get Started</Link>
            </div>
        </div>
    </div>
  )
}

export default LandingNav