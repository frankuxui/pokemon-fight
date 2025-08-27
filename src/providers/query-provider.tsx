import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type React from 'react'

export default function QueryProvider ({ children }: { children: React.ReactNode }) {

  // Cliente de React Query
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}