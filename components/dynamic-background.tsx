"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const BACKGROUND_IMAGES = [
  "/backgrounds/tech-1.jpg",
  "/backgrounds/tech-2.jpg",
  "/backgrounds/tech-3.jpg",
  "/backgrounds/tech-4.jpg",
]

const TRANSITION_INTERVAL = 8000 // Change image every 8 seconds

export function DynamicBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      // Wait for fade out animation
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
        setIsVisible(true)
      }, 500)
    }, TRANSITION_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background Images Container */}
      <div className="relative w-full h-full">
        {BACKGROUND_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex && isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={85}
            />
          </div>
        ))}
      </div>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 -z-5" />

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {BACKGROUND_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsVisible(true)
              }, 300)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to background ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
