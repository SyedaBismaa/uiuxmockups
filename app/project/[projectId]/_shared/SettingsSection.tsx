"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RefreshDataContext } from '@/context/RefreshDataContext'
import { SettingContext } from '@/context/SettingContext'
import { THEME_NAME_LIST, THEMES } from '@/data/Themes'
import { ProjectType } from '@/types/types'
import axios from 'axios'
import { Camera, Loader2Icon, Share, Sparkle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'


type Props={
  projectDetail:ProjectType | undefined
  screeDescription:string|undefined
}

const SettingsSection = ({projectDetail,screeDescription}:Props) => {

    const [selectedtheme, setselectedtheme] = useState('AURORA_INK')
    const [projectName, setprojectName] = useState(projectDetail?.projectName ?? '')
    const [userNewScreenInput, setuserNewScreenInput] = useState<string>('')
    const {settingDetail,setSettingDetail}=useContext(SettingContext);
    const [loading,setLoading]=useState(false)
    const {refreshData,setRefreshData} = useContext(RefreshDataContext) 
     const [loadingMsg, setloadingMsg] = useState('Loading')
   
 
    useEffect(() => {
  if (projectDetail) {
    setprojectName(projectDetail.projectName ?? '')
    setselectedtheme(projectDetail?.theme as string)
    setSettingDetail({
      projectId: projectDetail.projectId,
      projectName: projectDetail.projectName,
      theme: projectDetail.theme,
    })
  }
}, [projectDetail])

    const OnThemeSelect=(theme:string)=>{
       setselectedtheme(theme);
       setSettingDetail((prev:any)=>({
        ...prev,
        theme:theme
       }))
    }


    const GenerateNewScreen= async()=>{
      try{
         setLoading(true)
    const result= await axios.post('/api/generate-config',{
     projectId:projectDetail?.projectId,
     projectName:projectDetail?.projectName,
     deviceType:projectDetail?.device,
     theme:projectDetail?.theme,
      oldScreenDescription:screeDescription
    })
    console.log(result.data);
    setRefreshData({method:'screenConfig', date:Date.now()})
    setLoading(false)
      }catch(err){
        setLoading(false)
      }
    
    }


  return (
  <div className='w-[300px] h-[90vh] p-5 border-r flex flex-col overflow-hidden'>
        <h2 className='font-medium text-lg '>Settings</h2>

 {loading && <div 
        className='p-3 bg-blue-300
         border-blue-600 rounded-xl absolute top-1/2 left-1/2'>
          <h2 className='flex gap-2 items-center'> <Loader2Icon className='animate-spin'/> {loadingMsg}</h2>
        </div>}
         <div className='mt-3'>
            <h1 className='text-sm mb-2'>Project Name</h1>
         <Input placeholder='Project Name'
         value={projectName}
        onChange={(event) => {
  setprojectName(event.target.value)
  setSettingDetail((prev: any) => ({
    ...prev,
    projectName: event.target.value  
  }))
}}
         />
         </div>

         <div className='mt-5'>
            <h1 className='text-sm mb-2'>Generate New Screen</h1>
         <Textarea
         value={userNewScreenInput}
         onChange={(event)=>setuserNewScreenInput(event.target.value)}
          placeholder='Enter Prompt to generate screen using Ai'/>

         <Button size={'sm'} className='mt-2 w-full' 
         disabled={loading}
         onClick={GenerateNewScreen}
         >  {loading?<Loader2Icon className='animate-spin'/>:<Sparkle/>}  Generate With Ai</Button>
         </div>


           <div className='mt-5 flex flex-col'>
            <h1 className='text-sm mb-4 '>Themes</h1>
            <div className='flex-1 overflow-auto'>
              {/* <div className='overflow-auto'> */}
                {THEME_NAME_LIST.map((theme, index) => (
                  <div
                    key={theme}
                    className={`p-3 border rounded-xl mb-2 cursor-pointer ${theme == selectedtheme ? 'border-primary bg-primary/20' : ''}`}
                    onClick={() => OnThemeSelect(theme)}>
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