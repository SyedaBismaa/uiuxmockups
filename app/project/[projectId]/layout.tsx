"use client"
import React, { useState } from 'react'
import { SettingContext } from '@/context/SettingContext'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const [settingDetail, setSettingDetail] = useState()

  return (
    <SettingContext.Provider value={{ settingDetail, setSettingDetail }}>
      {children}
    </SettingContext.Provider>
  )
}
