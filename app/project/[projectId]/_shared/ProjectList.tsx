"use client"
import { ProjectType } from '@/types/types'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProjectCard from './ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'

const ProjectList = () => {

    const [projectList,setProjectList]=useState<ProjectType[]>([])
    const [loading,setLoading]=useState(false)

    useEffect(()=>{
        GetProjectList();
    }, [])


    const GetProjectList= async ()=>{
    setLoading(true)
    const result= await axios.get('/api/project');
    console.log(result.data)
    setProjectList(result.data);
    setLoading(false);
    }

  return (
    <div className='px-10 md:px-24 lg:px-44 xl:px-56 mt-5 '>
        <h2 className='text-2xl font-bold '>My Projects</h2>
         
         {!loading && projectList?.length ==0 && <div>
            
            <h2 className='text-center'>No Project Avaliable</h2>
            </div>}
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {!loading?projectList?.map((project,index)=>(
                
                 <ProjectCard project={project}/>
                
            )) :
             [1,2,3,4,5].map((Item,index)=>(
             <div>
                <Skeleton className='w-full h-[200px] rounded-2xl' />
                  <Skeleton className='mt-3 w-full h-6' />
                  <Skeleton className='mt-3 w-full h-6' />
                  <Skeleton className='mt-3 w-30 h-6' />
                  
             </div>
             ))

            }

        </div>

        
         </div>
  )
}

export default ProjectList