import { Button } from '@/components/ui/button'
import { ScreenConfig } from '@/types/types'
import { Code2Icon, Copy,  Download, GripVertical, Loader2Icon, MoreVerticalIcon, Sparkle, Trash } from 'lucide-react'
import React, { useContext, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner';
import { HtmlWrapper } from '@/data/constant';
import html2canvas from 'html2canvas'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios';
import { RefreshDataContext } from '@/context/RefreshDataContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '@/components/ui/textarea';


type Props={
    screen:ScreenConfig | undefined,
    activeTheme :any,
    iframeRef:any
    projectId:string | undefined
}

const ScreenHnadler = ({
    screen,
    activeTheme ,
    iframeRef,
    projectId

}:Props) => {

const htmlCode = HtmlWrapper(activeTheme, screen?.code as string)
const {refreshData,setRefreshData} = useContext(RefreshDataContext)
const [editUserInput,setEditUserInput]=useState<string>()
const [loading,setLoading]=useState(false)


const takeIframeScreenshot = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        const body = doc.body;

        // wait one frame to ensure layout is stable
        await new Promise((res) => requestAnimationFrame(res));

        const canvas = await html2canvas(body, {
            backgroundColor: null,
            useCORS: true,
            scale: window.devicePixelRatio || 1,
        });

        const image = canvas.toDataURL("image/png");

        // download automatically
        const link = document.createElement("a");
        link.href = image;
        link.download = `${screen?.screenName as string || "screen"}.png`;
        link.click();
    } catch (err) {
        console.error("Screenshot failed:", err);
    }
};




const OnDelete = async  ()=>{
 const result = await axios.delete('/api/generate-config?projectId='+projectId+"&screenId="+screen?.screenId);
 toast.success("Screen Deleted!");
 setRefreshData({method:'screenConfig', date:Date.now()})
}

 const editScreen = async () => {
    if (!editUserInput?.trim()) {
      toast.error("Please describe the changes you want to make.");
      return;
    }

    if (!projectId || !screen?.screenId || !screen?.code) {
      toast.error("Missing screen or project information.");
      return;
    }

    setLoading(true);
    toast.info("Regenerating screen, please wait...");

    try {
      const result = await axios.post('/api/edit-screen', {
        projectId: projectId,
        screenId: screen.screenId,
        userInput: editUserInput,
        oldCode: screen.code,
      });

      if (result?.status === 200) {
        toast.success("Screen Edited!");
        setRefreshData({ method: 'screenConfig', date: Date.now() });
      } else {
        toast.error("Failed to edit screen. Please try again.");
      }
    } catch (error: any) {
      console.error('editScreen error:', error);
      toast.error(error?.response?.data?.error || error?.message || 'Unable to edit screen.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='flex items-center justify-between w-full'>
         <div className='flex items-center gap-2'>
            <GripVertical className='text-gray-700 h-4 w-5' /> 
         <h2>{screen?.screenName}</h2>
         </div>


         <div className='flex'>

            <Dialog>
  <DialogTrigger>  
    <Button variant={'ghost'}><Code2Icon /></Button> 
       </DialogTrigger>
  <DialogContent className='max-w-6xl w-full h-[70vh] flex flex-col'>
    <DialogHeader>
      <DialogTitle>HTML + Tailwind CSS Code </DialogTitle>
      <DialogDescription>


        <div className='flex-1 overflow-y-auto rounded-md bg-muted'>
        {/* @ts-ignore */}
        
         <SyntaxHighlighter
          language="html"
           style={docco}
           
           customStyle={{
            margin:0,
            padding:0,
            whiteSpace:'pre-wrap',
            wordBreak:'break-word',
            overflowX:'hidden',
            height:'50vh'
           }}

           codeTagProps={{
            style:{
                whiteSpace:'pre-wrap',
                wordBreak:'break-word'
            }
           }}
           >
      {htmlCode}
    </SyntaxHighlighter>
    </div>

 <Button 
 onClick={()=>{navigator.clipboard.writeText(htmlCode as string);
    toast.success('Code copied to sucessfully')
 }}
 className='mt-5'><Copy/> copy</Button>

      </DialogDescription>
    </DialogHeader>
  </DialogContent>
           </Dialog>


           <Button onClick={takeIframeScreenshot} variant={'ghost'}>
            <Download/>
           </Button>
  
         
           <Popover>
  <PopoverTrigger asChild>
      <Button variant={'ghost'}><Sparkle/></Button>
  </PopoverTrigger>
  <PopoverContent>
   <div>
    <Textarea
    onChange={(event)=>setEditUserInput(event.target.value)}
    placeholder='What Changes You want to Make'/>
    <Button
    disabled={loading}
    onClick={()=>editScreen()}
    className='mt-2' size={'sm'}> {loading?<Loader2Icon className='animate-spin'/> : <Sparkle/>} Regenerate</Button>
   </div>
  </PopoverContent>
</Popover>
           
           <DropdownMenu>
  <DropdownMenuTrigger asChild>
   <Button variant={'ghost'}>
            <MoreVerticalIcon/>
           </Button>

  </DropdownMenuTrigger>
  <DropdownMenuContent>
    
      
      <DropdownMenuItem 
      onClick={()=>OnDelete()}
      variant={'destructive'}><Trash/> Delete</DropdownMenuItem>
     
  </DropdownMenuContent>
</DropdownMenu>




         </div>



    </div>
  )
}

export default ScreenHnadler