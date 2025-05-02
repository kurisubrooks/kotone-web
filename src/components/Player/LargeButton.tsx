import { MouseEventHandler } from 'react'
import Icon from '../Icon'

interface Props {
  icon: string
  large?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const LargeButton = ({ icon, large = false, onClick }: Props) => {
  return (
    <Icon
      icon={icon}
      filled
      size={large ? 72 : 48}
      className="rounded-full p-4 transition hover:cursor-pointer hover:bg-zinc-100/20"
      onClick={onClick}
    />
  )
}

export default LargeButton
