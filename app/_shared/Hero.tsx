"use client"
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { ChevronRight, Loader, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { suggestions } from '@/data/constant'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { randomUUID } from 'crypto'


const Hero = () => {
  const router = useRouter();
  const [userInput, setuserInput] = useState<string>()
  const [device, setdevice] = useState<string>('website')
  const [loading, setloading] = useState(false);
  const {user}= useUser();


  const onCreateProject=  async ()=>{
   if(!user){
      router.push('/sign-in');
      return;
   }
   //Create New Project
  if(!userInput){
    return;
  }
  setloading(true);
   const projectId =crypto.randomUUID();
   const result = await axios.post('/api/project',{
       userInput:userInput,
       device : device,
       projectId:projectId
   })

   console.log(result.data);
   setloading(false);

   //navigate to Project route
  }

  return (

    <div className='pt-2 px-10 md:px-24 lg:px-48 xl:px-60 mt-20 '>
     <div className='flex justify-center items-center mb-5'>
          <div className="group max-w-sm relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className={cn(
          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="text-sm font-medium">
        Introducing Magic UI
      </AnimatedGradientText>
      <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </div>
     </div>
        <h2 className='text-5xl  font-bold text-center'>Design High Quality <span className='text-primary'>Websites And Mobile App </span>Designs</h2>
        <p className='text-center text-gray-600 text-lg mt-3'>Imagin Your Idea And turn it into reality</p>

          <div className="flex w-full justify-center gap-6 pt-5">
      <InputGroup className='max-w-xl bg-white z-10 rounded-2xl' >
        <InputGroupTextarea
         value={userInput}
         onChange={(event)=>setuserInput(event.target?.value)}
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-20 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Enter What Design you want to Create..."
        />

        <InputGroupAddon align="block-end">
                <Select 
                defaultValue='website' 
                onValueChange={(value)=>setdevice(value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="type" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="website">Website</SelectItem>
      <SelectItem value="mobile">Mobile</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
          <InputGroupButton className="ml-auto" size="sm"
          disabled={loading}
           variant="default" onClick={onCreateProject}>
            {loading? <Loader className='animate-spin'/> :   <Send/>}
          
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>


<div className='flex gap-5 mt-4'>
  {suggestions.map((suggestion,index)=>(
    <div
    onClick={()=>setuserInput(suggestion?.description)}
     className='p-2 
    border rounded-2xl z-10 cursor-pointer bg-white items-center flex gap-5 flex-col '>
      <h2 className='text-lg'>{suggestion?.icon}</h2>
      <h2 className='text-center line-clamp-2 text-sm'>{suggestion?.name}</h2>
    </div>
  ))}
</div>


    </div>

   
  
  )
}

export default Hero