'use client'
import { createContext, type ReactNode, useState } from 'react'

type SearchStore = {
  search: string | undefined
  setSearch: (search: string | undefined) => void
}

export const SearchContext = createContext<SearchStore | undefined>(undefined)

const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState<string | undefined>()

  const value: SearchStore = {
    search: search,
    setSearch: setSearch,
  }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export default SearchProvider
