"use client"

import dynamic from 'next/dynamic'

const Model = dynamic(
  () => import('./model'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className='flex w-full items-center justify-center h-screen'>

      <Model />
    </div>
  )
}
