import { useContext } from 'react'
import { SearchContext } from '@/components/providers/search-provider'

export function useSearch() {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error('usesearch must be used within a search-provider')
  }

  return context
}
