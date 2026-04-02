import { SettingContext } from '@/context/SettingContext'
import { themeToCssVars, ThemeKey } from '@/data/Themes'
import { ProjectType, ScreenConfig } from '@/types/types'
import { GripVertical } from 'lucide-react'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import ScreenHnadler from './ScreenHnadler'
import { HtmlWrapper } from '@/data/constant'

type Props = {
  x: number
  y: number
  setPanningEnabled: (enable: boolean) => void
  width: number
  height: number
  htmlCode: string | undefined
  projectDetail: ProjectType | undefined
  screen :ScreenConfig | undefined
}

const ScreenFrame = ({ 
  x, 
  y, 
  setPanningEnabled, 
  width, 
  height, 
  htmlCode, 
  projectDetail,
  screen

}: Props) => {
  const { settingDetail } = useContext(SettingContext)

  // ✅ Avoid hydration mismatch: don't initialize with props directly
  const [size, setSize] = useState<{ width: number; height: number } | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // ✅ Only run on client
  useEffect(() => {
    setMounted(true)
    setSize({ width, height })
  }, [])

  // ✅ Sync size when props change
  useEffect(() => {
    if (mounted) {
      setSize({ width, height })
    }
  }, [width, height, mounted])

const activeTheme = (settingDetail?.theme ?? projectDetail?.theme) as ThemeKey

const html = HtmlWrapper(activeTheme  ,htmlCode as string)
  


  const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      if (!doc) return

      const headerH = 40
      const htmlEl = doc.documentElement
      const body = doc.body

      const contentH = Math.max(
        htmlEl?.scrollHeight ?? 0,
        body?.scrollHeight ?? 0,
        htmlEl?.offsetHeight ?? 0,
        body?.offsetHeight ?? 0
      )

      const next = Math.min(Math.max(contentH + headerH, 160), 2000)
      setSize((s) => {
        if (!s) return { width, height: next }
        return Math.abs(s.height - next) > 2 ? { ...s, height: next } : s
      })
    } catch {
      // cross-origin / sandbox blocks access
    }
  }, [width])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const onLoad = () => {
      measureIframeHeight()

      const doc = iframe.contentDocument
      if (!doc) return

      const observer = new MutationObserver(() => measureIframeHeight())
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })

      const t1 = window.setTimeout(measureIframeHeight, 50)
      const t2 = window.setTimeout(measureIframeHeight, 200)
      const t3 = window.setTimeout(measureIframeHeight, 600)

      return () => {
        observer.disconnect()
        window.clearTimeout(t1)
        window.clearTimeout(t2)
        window.clearTimeout(t3)
      }
    }

    iframe.addEventListener('load', onLoad)
    window.addEventListener('resize', measureIframeHeight)

    return () => {
      iframe.removeEventListener('load', onLoad)
      window.removeEventListener('resize', measureIframeHeight)
    }
  }, [measureIframeHeight, htmlCode])

  // ✅ Don't render on server — avoids hydration mismatch entirely
  if (!mounted) return null

  return (
    <Rnd
      default={{ x, y, width, height }}
      size={size ?? { width, height }}
      dragHandleClassName="drag-handle"
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={(_, __, ref, ___, _position) => {
        setPanningEnabled(true)
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }}
    >
      <div className="drag-handle flex gap-2 items-center cursor-move rounded-2xl mb-2 bg-gray-100 p-2">
       
        <ScreenHnadler 
        iframeRef={iframeRef}
         activeTheme={activeTheme}
          screen={screen}
          projectId={projectDetail?.projectId}
          />
      </div>

      <iframe
  key={activeTheme}
  ref={iframeRef}
  style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none', backgroundColor: 'white' }}
  sandbox="allow-scripts allow-same-origin"
  srcDoc={html}
/>
    </Rnd>
  )
}

export default ScreenFrame