import React from 'react'
import { Outlet } from 'react-router'
import Header from 'src/components/header'

export default function Root () {
  return (
    <React.Fragment>
      <Header />
      <main className='w-full min-h-screen'>
        <Outlet />
      </main>
    </React.Fragment>
  )
}