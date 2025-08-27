import React from 'react'
import { type UseQueryResult, type DefaultError } from '@tanstack/react-query'

interface HitsProps<T> {
  useDataHook: () => UseQueryResult<T[], DefaultError>
  children: (query: UseQueryResult<T[], DefaultError>) => React.ReactNode
  loadingComponent?: React.ReactNode
  refetchingComponent?: React.ReactNode
  errorComponent?:
    | React.ReactNode
    | ((_params: { error: DefaultError; refetch: () => void }) => React.ReactNode)
  emptyDataComponent?: React.ReactNode | ((_params: { data: T[] }) => React.ReactNode)
}

export default function Hits<T>({
  useDataHook,
  children,
  loadingComponent,
  refetchingComponent,
  errorComponent,
  emptyDataComponent,
}: HitsProps<T>) {
  const query = useDataHook()
  const { data, isLoading, isRefetching, error, refetch } = query

  if (isLoading) {
    return <>{loadingComponent ?? null}</>
  }

  
  if (isRefetching) {
    if (refetchingComponent) return <>{refetchingComponent}</>
  }

  // Error
  if (error) {
    return (
      <>
        {typeof errorComponent === 'function'
          ? errorComponent({ error, refetch })
          : errorComponent ?? null}
      </>
    )
  }

  // Vacío (array)
  if (data && data.length === 0) {
    return <>{typeof emptyDataComponent === 'function' ? emptyDataComponent({ data }) : emptyDataComponent ?? null}</>
  }

  return <>{children(query)}</>
}
