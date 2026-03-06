"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THEME_NAME_LIST, THEMES } from '@/data/Themes'
import { Camera, Share, Sparkle } from 'lucide-react'
import React, { useState } from 'react'

const SettingsSection = () => {

    const [selectedtheme, setselectedtheme] = useState('AURORA_INK')
    const [projectName, setprojectName] = useState('')
    const [userNewScreenInput, setuserNewScreenInput] = useState<string>()
  return (
  <div className='w-[300px] h-[90vh] p-5 border-r flex flex-col overflow-hidden'>
        <h2 className='font-medium text-lg '>Settings</h2>

         <div className='mt-3'>
            <h1 className='text-sm mb-2'>Project Name</h1>
         <Input placeholder='Project Name'
         onChange={(event)=>setprojectName(event.target.value)}
         />
         </div>

         <div className='mt-5'>
            <h1 className='text-sm mb-2'>Generate New Screen</h1>
         <Textarea
         onChange={(event)=>setuserNewScreenInput(event.target.value)}
          placeholder='Enter Prompt to generate screen using Ai'/>

         <Button size={'sm'} className='mt-2 w-full'><Sparkle/> Generate With Ai</Button>
         </div>


           <div className='mt-5 flex flex-col'>
            <h1 className='text-sm mb-4 '>Themes</h1>
            <div className='flex-1 overflow-auto'>
              {/* <div className='overflow-auto'> */}
                {THEME_NAME_LIST.map((theme, index) => (
                  <div
                    key={theme}
                    className={`p-3 border rounded-xl mb-2 cursor-pointer ${theme == selectedtheme ? 'border-primary bg-primary/20' : ''}`}
                    onClick={() => setselectedtheme(theme)}>
                    <h2>{theme}</h2>
                    <div className='flex gap-2 p-3'>
                      <div className={`h-4 w-4  rounded-full`} style={{ background: THEMES[theme].primary }} />

                      <div className={`h-4 w-4 rounded-full `} style={{ background: THEMES[theme].secondary }} />

                      <div className={`h-4 w-4 rounded-full`} style={{ background: THEMES[theme].accent }} />

                      <div className={`h-4 w-4 rounded-full  `} style={{ background: THEMES[theme].background }} />
                      <div
                        className='h-4 w-4 rounded-full'
                        style={{
                          background: `linear-gradient(135deg, ${THEMES[theme].background}, ${THEMES[theme].primary}, ${THEMES[theme].accent})`
                        }}
                      />

                    </div>

                  </div>
                ))}
              </div>
            {/* </div> */}
           </div>

   <div className='mt-5'>
            <h1 className='text-sm mb-2'>Extras</h1>
         <div className='flex gap-3'>
            <Button size={'sm'} variant={'outline'} className='mt-2 '><Camera/>Screenshot</Button>
         <Button size={'sm'} variant={'outline'} className='mt-2 '><Share/>Share</Button>
         </div>
         </div>

        </div>
  )
}

export default SettingsSection