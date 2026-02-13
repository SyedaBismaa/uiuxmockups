import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import React from 'react'

const ProjectHeader = () => {
  return (
    <div className='flex justify-between items-center shadow p-3'>
         <div className='flex gap-2 items-center'>
            <h1 className='text-xl'>Logo</h1>
            <h2 className='text-xl font-semibold'><span className='text-primary'>UIUX</span> MOCK</h2>
        </div>
        <Button><Save/> Save</Button>
    </div>
  )
}

export default ProjectHeader