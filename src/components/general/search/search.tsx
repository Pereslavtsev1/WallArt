import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <div className="relative flex w-full items-center">
      <Input variant="ghost" className="px-10 font-semibold" />
      <SearchIcon className="absolute left-2.5 size-5 text-muted-foreground" />
    </div>
  )
}

export default Search
