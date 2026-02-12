"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
  const {user}=useUser();
  return (
    <div className='flex justify-between items-center p-4'>
    
        <div className='flex gap-2 items-center'>
            <h1 className='text-xl'>Logo</h1>
            <h2 className='text-xl font-semibold'><span className='text-primary'>UIUX</span> MOCK</h2>
        </div>

        <ul className='flex  gap-8 items-center text-lg'>
            <li className='hover:text-primary cursor-pointer'>Home</li>
            <li className='hover:text-primary cursor-pointer'>Pricing</li>
        </ul>
        {!user? 
         <SignInButton mode='modal'>
          <Button>Get started</Button>
         </SignInButton> :
        <UserButton/>
        }

       

    </div>
  )
}

export default Header