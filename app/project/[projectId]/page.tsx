"use client"
import React, { useEffect, useState } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingsSection from './_shared/SettingsSection'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { ProjectType, ScreenConfig } from '@/types/types'
import { Loader2Icon, LoaderIcon } from 'lucide-react'


const ProjectCanvasPlayground = () => {


  const {projectId}=useParams();
  const [projectDetail, setprojectDetail] = useState<ProjectType>()
  const [loading, setloading] = useState(false);
  const [loadingMsg, setloadingMsg] = useState('Loading')
  const [screenConfig, setscreenConfig] = useState<ScreenConfig[]>([])

  useEffect(()=>{
    projectId&&GetProjectDetail();
  },[projectId])

  const GetProjectDetail= async ()=> {
    setloading(true);
    setloadingMsg('Loading..')
     const result = await axios.get('/api/project?projectId='+projectId)
     console.log(result.data)
     setprojectDetail(result?.data?.projectDetail);
     setscreenConfig(result?.data?.screenConfig)
    //  if(result.data?.screenConfig.length==0){
    //   generateScreenConfig();
    //  }
     setloading(false);

  }


  useEffect(()=>{
  if(projectDetail&&screenConfig&&screenConfig.length==0){
    generateScreenConfig();
  }
  },[projectDetail&&screenConfig])


  const generateScreenConfig= async ()=>{
    // console.log('generating config')
    setloading(true);
    setloadingMsg("Generating Screen config...");
    const result=await axios.post('/api/generate-config',{
      projectId:projectId,
      deviceType:projectDetail?.device,
      userInput:projectDetail?.userInput

    })

    console.log(result.data)

    GetProjectDetail();
    setloading(false)


  }

  return (
    <div>
        <ProjectHeader/>
        {loading && <div 
        className='p-3 bg-blue-300
         border-blue-600 rounded-xl absolute top-1/2 left-1/2'>
          <h2 className='flex gap-2 items-center'> <Loader2Icon className='animate-spin'/> {loadingMsg}</h2>
        </div>}


        <div className='flex'>

            {/* Setting  */}
            <SettingsSection projectDetail={projectDetail} />

            {/* Canvas  */}

        </div>
    </div>
  )
}

export default ProjectCanvasPlayground