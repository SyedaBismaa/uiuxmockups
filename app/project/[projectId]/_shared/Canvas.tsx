"use client"
import React, { useState } from 'react'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from './ScreenFrame';
import { ProjectType, ScreenConfig } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import {  Minus, Plus, RefreshCcw } from 'lucide-react';
import { Button } from '@base-ui/react';

type Props={
projectDetail:ProjectType | undefined,
screenConfig:ScreenConfig[],
loading?:boolean

}

const Canvas = ({projectDetail, screenConfig, loading}:Props) => {
 
    const [panningEnabled, setpanningEnabled] = useState(true)
    
    const isMobile = projectDetail?.device=='mobile';

    const SCREEN_WIDTH = isMobile ? 300 : 950;
    const SCREEN_HEIGHT = isMobile ? 800 : 800;
    const GAP = isMobile ? 10 : 60;




    const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools flex gap-2  ">
      <Button className="bg-white  rounded-full px-5 p-3" variant={'ghost'} onClick={() => zoomIn()}><Plus/></Button>
      <Button className="bg-white  rounded-full px-5 p-3" variant={'ghost'} onClick={() => zoomOut()}><Minus/></Button>
      <Button className="bg-white  rounded-full px-5 p-3"className="bg-white rounded-full px-5 p-3"  variant={'ghost'} onClick={() => resetTransform()}><RefreshCcw/></Button>
    </div>
  );
};


  return (
    <div className='w-full h-screen '
     style={{
            backgroundColor: "#d1d5db",
            backgroundImage:"radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1px)",
            backgroundSize:"20px 20px"

        }}
    >
       
        <TransformWrapper
        initialScale={0.9}
        minScale={0.9}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        wheel={{step:0.8}}
        doubleClick={{disabled:false}}
        panning={{disabled:!panningEnabled}}
        >
           {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
  <TransformComponent
  wrapperStyle={{width:'100%' , height:'100%'}}
  >
    
  {screenConfig?.map((screen,index)=>(
     <div key={index} style={{position:'absolute', left:index*(SCREEN_WIDTH+GAP), top:0, width:SCREEN_WIDTH, height:SCREEN_HEIGHT}}>
      {screen?.code? <ScreenFrame 
     x={index*(SCREEN_WIDTH+GAP)} y={0}
     width={SCREEN_WIDTH}
     height={SCREEN_HEIGHT}
     setPanningEnabled={setpanningEnabled}
     htmlCode={screen?.code}
     projectDetail= {projectDetail}
     />
    : <div className='border-2 bg-white rounded-2xl p-5 gap-3 flex flex-col' 
    style={{
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT
        
      }}
    >
     <Skeleton className='w-full   bg-gray-600  rounded-lg h-10'/>
      <Skeleton className='w-full  bg-gray-600   rounded-lg h-10'/>      <Skeleton className='w-full rounded-lg h-10'/>
      <Skeleton className='w-full   bg-gray-600  rounded-lg h-10'/>      <Skeleton className='w-full rounded-lg h-10'/>
      <Skeleton className='w-full  bg-gray-600   rounded-lg h-10'/>
      <Skeleton className='w-full  bg-gray-600   rounded-lg h-10'/>
      <Skeleton className='w-full  bg-gray-600   rounded-lg h-10'/>
      <Skeleton className='w-full   bg-gray-600  rounded-lg h-10'/>
      <Skeleton className='w-full   bg-gray-600  rounded-lg h-10'/>

      
    </div>
    
    }
     </div>
  ))} 


  </TransformComponent>
  </>)}
</TransformWrapper>
    </div>
  )
}

export default Canvas