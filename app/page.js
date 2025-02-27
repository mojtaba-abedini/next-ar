"use client"

import dynamic from 'next/dynamic'

const Model = dynamic(
  () => import('./components/model'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className='flex w-full items-center justify-center h-screen pb-28 lg:pb-10'>

      <Model />
    </div>
  )
}
