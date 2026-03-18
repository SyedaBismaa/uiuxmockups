import { themeToCssVars, ThemeKey } from '@/data/Themes'
import { ProjectType } from '@/types/types'
import { GripVertical } from 'lucide-react'
import React, { useMemo } from 'react'
import {Rnd} from 'react-rnd'

type Props={
    x:number,
    y:number,
    setPanningEnabled:(enable:boolean)=>void
    width:number,
    height:number,
    htmlCode:string | undefined,
     projectDetail:ProjectType | undefined
}



const ScreenFrame = ({x,y,setPanningEnabled , width , height, htmlCode , projectDetail}:Props) => {

const html = useMemo(() => `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
  <style>
    ${themeToCssVars(projectDetail?.theme as ThemeKey)}
  </style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] w-full">
  ${htmlCode ?? ""}
</body>
</html>
`, [projectDetail?.theme, htmlCode]);



  return (
    <Rnd 
    default={{
        x,
        y,
        width:width,
        height:height
    }}

    dragHandleClassName='drag-handle'
    onDragStart={()=>setPanningEnabled(false)}
    onDragStop={()=>setPanningEnabled(true)}
    onResizeStart={()=>setPanningEnabled(false)}
    onResizeStop={()=>setPanningEnabled(true)}
    
    >
       <div className='drag-handle flex gap-2 items-center cursor-move bg-gray-100 p-2'>
         <GripVertical/>Drag Here 
       </div>

       <iframe
       style={{
  width: "100%",
  height: "calc(100% - 40px)",
  border: "none",
  backgroundColor: "white",
}}
       
       sandbox='allow-scripts'
        srcDoc={html}
       
       />


    </Rnd>
  )
}

export default ScreenFrame