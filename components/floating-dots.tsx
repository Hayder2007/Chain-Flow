"use client"

import { useEffect, useState } from "react"

interface FloatingDotsProps {
  count?: number
  className?: string
}

export function FloatingDots({ count = 15, className = "" }: FloatingDotsProps) {
  const [dots, setDots] = useState<
    Array<{ id: number; left: string; top: string; animationDelay: string; animationDuration: string }>
  >([])

  useEffect(() => {
    // Generate dots only once on mount to prevent re-rendering
    const generatedDots = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${20 + Math.random() * 15}s`,
    }))
    setDots(generatedDots)
  }, [count])

  return (
    <>
      <style jsx>{`
        @keyframes float-0 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(100px, -50px); }
          50% { transform: translate(-80px, -100px); }
          75% { transform: translate(-120px, 50px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-70px, -80px); }
          66% { transform: translate(90px, 60px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(60px, -120px); }
          40% { transform: translate(-100px, -40px); }
          60% { transform: translate(80px, 80px); }
          80% { transform: translate(-60px, 40px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          30% { transform: translate(-90px, -60px); }
          60% { transform: translate(110px, -90px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-4 {
          0% { transform: translate(0, 0); }
          40% { transform: translate(70px, 100px); }
          80% { transform: translate(-110px, -70px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      <div className={`fixed inset-0 pointer-events-none ${className}`}>
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute w-2 h-2 bg-[#00FFE5] rounded-full opacity-40"
            style={{
              left: dot.left,
              top: dot.top,
              animation: `float-${dot.id % 5} ${dot.animationDuration} linear infinite`,
              animationDelay: dot.animationDelay,
            }}
          />
        ))}
      </div>
    </>
  )
}
