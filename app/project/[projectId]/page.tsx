import React from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingsSection from './_shared/SettingsSection'

const ProjectCanvasPlayground = () => {
  return (
    <div>
        <ProjectHeader/>
        <div className='flex justify-between'>
            {/* Setting  */}
            <SettingsSection/>

            {/* Canvas  */}
           
            

        </div>
    </div>
  )
}

export default ProjectCanvasPlayground