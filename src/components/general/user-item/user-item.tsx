import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@clerk/nextjs'

const UserItem = () => {
  const user = useUser()
  return (
    <div>
      <Avatar>
        <AvatarImage src={user.user?.imageUrl} />
        <AvatarFallback>{user.user?.username}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default UserItem
