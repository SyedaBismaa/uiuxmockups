import { ProjectType } from '@/types/types'
import React from 'react'
import  Image from 'next/image'
import Link from 'next/link';


type Props={
    project:ProjectType;
}


const ProjectCard = ({project}:Props) => {
  return (

    <Link href={'/project/'+project?.projectId}>
     
    <div className='rounded-2xl mt-5'>
    <Image src={project?.screenshot as string} alt={project?.projectName as string}
    height={200}
    width={300}
    className='rounded-xl object-contain  h-[200px] w-full bg-black'
    />

    <div>
        <h2 >{project?.projectName}</h2>
        <p className='text-sm text-gray-500'>{project.createdOn}</p>
    </div>

    </div>
    </Link>
  )
}

export default ProjectCard