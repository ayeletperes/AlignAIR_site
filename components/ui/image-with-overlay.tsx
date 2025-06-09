'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ImageWithOverlayProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  showOverlayOnHover?: boolean
  overlayContent?: React.ReactNode
  onClick?: () => void
}

export default function ImageWithOverlay({
  src,
  alt,
  width,
  height,
  className = '',
  showOverlayOnHover = false,
  overlayContent,
  onClick
}: ImageWithOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayClass, setOverlayClass] = useState('')

  const handleShowOverlay = () => {
    setShowOverlay(true)
    setOverlayClass('shown')
  }

  const handleHideOverlay = () => {
    setOverlayClass('hidden')
    // Keep overlay visible during fadeout animation
    setTimeout(() => {
      setShowOverlay(false)
      setOverlayClass('')
    }, 2000) // Match animation duration
  }

  const handleImageClick = () => {
    if (onClick) {
      onClick()
    } else {
      if (showOverlay) {
        handleHideOverlay()
      } else {
        handleShowOverlay()
      }
    }
  }

  return (
    <div 
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseEnter={showOverlayOnHover ? handleShowOverlay : undefined}
      onMouseLeave={showOverlayOnHover ? handleHideOverlay : undefined}
      onClick={!showOverlayOnHover ? handleImageClick : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block"
      />
      
      {showOverlay && (
        <div className={`overlay ${overlayClass}`}>
          {overlayContent && (
            <div className="absolute inset-0 flex items-center justify-center text-white z-10">
              {overlayContent}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 