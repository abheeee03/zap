import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/auth'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingNav from '@/components/nav'
import { BarChart3, Link2, ShieldCheck } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function Landing() {
  const { isAuthenticated } = useAuth()
  const [openAuth, setOpenAuth] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/home')
      return
    }
    setOpenAuth(true)
  }

  const features = [
  {
    title: 'Fast Link Shortening',
    description: 'Turn long URLs into clean short links in seconds and share them anywhere.',
    icon: Link2,
  },
  {
    title: 'Click Analytics',
    description: 'Track total clicks for every short link and measure what is working best.',
    icon: BarChart3,
  },
  {
    title: 'Secure Access',
    description: 'Manage links in your own account with authenticated and protected routes.',
    icon: ShieldCheck,
  },
]

  return (
    <>
    <LandingNav onStart={handleGetStarted}/>
    <div className="h-screen w-full flex flex-col gap-5 items-center justify-center px-2">
      <span className='px-3 border rounded-xl'>Introducing zap</span>
      <h1 className='text-6xl font-semibold text-center mb-5'>Make your links look smart.</h1>
      <p className='max-w-lg text-lg text-center leading-tight'>Turn long, messy URLs into sleek, shareable links. Simple to use, powerful to grow your reach.</p>
      <div className="flex gap-3">
      <Button
      size={"lg"}
      onClick={handleGetStarted}
      >
        Get Started
      </Button>
      <Button 
      size={"lg"}
      variant={"outline"}>
        Learn More
      </Button>
      </div>
      <AuthDialog
        open={openAuth}
        onOpenChange={setOpenAuth}
        onSuccess={() => navigate('/home')}
      />
    </div>
    <section className='w-full h-screen flex flex-col items-center justify-center gap-10'>
      <div className='mb-5 text-center'>
        <h2 className='text-5xl font-semibold'>Why use zapp?</h2>
        <p className='mt-2 text-sm text-muted-foreground'>Simple tools to create, share, and track your links.</p>
      </div>

      <div className='flex flex-wrap items-center justify-center gap-4 max-w-xl px-4'>
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <Card key={feature.title} className='min-w-60 flex-1'>
              <CardHeader>
                <div className='mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Icon className='h-4 w-4' />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
    </>
  )
}

export default Landing