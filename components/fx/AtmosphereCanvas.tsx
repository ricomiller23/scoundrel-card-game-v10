'use client'

import React, { useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/store'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

export const AtmosphereCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useGameStore((s) => s.reducedMotion)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isVisible = !document.hidden

    // Cap DPR at 2 for performance on mobile devices
    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)

    const handleResize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Pre-allocate particle pool (no continuous allocations during render)
    const count = 48
    const particles: Particle[] = []
    const width = window.innerWidth
    const height = window.innerHeight

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.12 - Math.random() * 0.3,
        size: 1 + Math.random() * 2,
        alpha: 0.12 + Math.random() * 0.38,
        color: Math.random() > 0.35 ? '#F2D06B' : '#C9A227'
      })
    }
    particlesRef.current = particles

    // Render loop pausing when tab is hidden
    const render = () => {
      if (!isVisible) return

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const pool = particlesRef.current
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i]
        p.x += p.vx
        p.y += p.vy

        // Wrap around viewport bounds
        if (p.y < 0) {
          p.y = h
          p.x = Math.random() * w
        }
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowBlur = 4
        ctx.shadowColor = p.color
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        cancelAnimationFrame(animationFrameId)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 select-none opacity-50"
      aria-hidden="true"
    />
  )
}
