"use client"
import React, { useEffect, useState } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingsSection from './_shared/SettingsSection'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { ProjectType, ScreenConfig } from '@/types/types'
import { Loader2Icon, LoaderIcon } from 'lucide-react'
import Canvas from './_shared/Canvas'


const ProjectCanvasPlayground = () => {


  const {projectId}=useParams();
  const [projectDetail, setprojectDetail] = useState<ProjectType>()
  const [loading, setloading] = useState(false);
  const [loadingMsg, setloadingMsg] = useState('Loading')
  const [screenConfigOriginal, setscreenConfigOriginal] = useState<ScreenConfig[]>([])
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
     setscreenConfigOriginal(result?.data?.screenConfig)
     setscreenConfig(result?.data?.screenConfig)
    //  if(result.data?.screenConfig.length==0){
    //   generateScreenConfig();
    //  }
     setloading(false);

  }


  useEffect(()=>{
  if(projectDetail&&screenConfigOriginal&&screenConfigOriginal.length==0){
    generateScreenConfig();
  }
  else if(projectDetail&&screenConfigOriginal){
  GenerateScreenUIUX();
  }
  },[projectDetail, screenConfigOriginal])


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

  const GenerateScreenUIUX=async ()=>{
     setloading(true);
     for(let index=0; index<screenConfig?.length; index++){
      const screen = screenConfig[index];
      if(screen?.code) continue ;

      setloadingMsg(`Generating Screen ${index + 1}`)

      const result=await axios.post('/api/generate-screen-ui',{
        projectId,
        screenId:screen?.screenId,
        screenName:screen?.screenName,
        purpose:screen?.purpose,
        screenDescription:screen?.screenDescription
      });
      console.log(result.data)
      setscreenConfig(prev=>prev.map((item,i)=>
      (i===index?result.data : item)))

     }

     setloading(false);
  }

  return (
    <div>
        <ProjectHeader/>
        {loading && <div 
        className='p-3 bg-blue-300
         border-blue-600 rounded-xl absolute top-1/2 left-1/2'>
          <h2 className='flex gap-2 items-center'> <Loader2Icon className='animate-spin'/> {loadingMsg}</h2>
        </div>}


        <div className='flex gap-5'>

            {/* Setting  */}
            <SettingsSection projectDetail={projectDetail} />

            {/* Canvas  */}
            <Canvas projectDetail={projectDetail} 
            screenConfig={screenConfig}/>


        </div>
    </div>
  )
}

export default ProjectCanvasPlayground