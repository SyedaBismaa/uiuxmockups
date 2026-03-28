import { Button } from '@/components/ui/button'
import { SettingContext } from '@/context/SettingContext';
import axios from 'axios';
import { Loader2, Save } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast, Toaster } from 'sonner';

const ProjectHeader = () => {
    const {settingDetail,setSettingDetail}=useContext(SettingContext);
    const [loading, setLoading]=useState(false);

    const onSave= async ()=>{
      try{
        setLoading(true);
      const result= await axios.put('/api/project', {
        theme:settingDetail?.theme,
        projectId:settingDetail?.projectId,
        projectName:settingDetail?.projectName
      })
      setLoading(false);
      toast.success("saved successfully")
      }catch(err){
        setLoading(false);
        toast.error("Internal server Error")
      }

    }
  
  return (
    <div className='flex justify-between items-center shadow p-3'>
         <div className='flex gap-2 items-center'>
            <h1 className='text-xl'>Logo</h1>
            <h2 className='text-xl font-semibold'><span className='text-primary'>UIUX</span> MOCK</h2>
        </div>
        <Button
        onClick={onSave}
         disabled={loading}>  
         {loading? <Loader2 className='animate-spin'/> : <Save/> } Save</Button>
    </div>
  )
}

export default ProjectHeader