import React from 'react'
import { assets } from '../assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* ---------- Background Image ---------- */}
      <img 
        src={assets.bgImage} 
        alt="" 
        className='absolute top-0 left-0 z-[-1] w-full h-full object-cover' 
      />

      {/* ---------- Left Side: Branding ---------- */}
      <div className='flex-1 flex flex-col justify-between p-8 md:p-12 lg:p-16'>
        <img src={assets.logo} alt="" className='h-10 object-contain self-start' />


        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4'>
            <img src={assets.group_users} alt="" className='h-10' />
            <div>
              <div className='flex'>
                {[...Array(5)].fill(0).map((_, i) => (
                  <Star key={i} className='w-4 h-4 text-yellow-500 fill-yellow-500' />
                ))}
              </div>
              <p className='text-sm text-gray-600'>Used by 12k+ developers</p>
            </div>
          </div>

          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-zinc-900'>
            More than just friends, <br /> truly connect.
          </h1>
 
          <p className='text-base md:text-lg text-zinc-600 max-w-md'>
            PingUp helps you connect and share with the people in your life.
          </p>
        </div>

        <span className='h-10 md:block hidden'></span>
      </div>

      {/* ---------- Right Side: Login Form ---------- */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <SignIn />
      </div>
    </div>
  )
}

export default Login