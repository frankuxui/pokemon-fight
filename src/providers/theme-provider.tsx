import type React from 'react'
import { ThemeProvider } from 'next-themes'

export default function AppThemeProvider ({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider>{children}</ThemeProvider>
  )
}