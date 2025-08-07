import { useContext } from 'react'
import { SearchContext } from '@/components/providers/search-provider'

export function useSearch() {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error('useSettings must be used within a search-provider')
  }

  return context
}
