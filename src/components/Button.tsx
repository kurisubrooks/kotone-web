import { MouseEventHandler, ReactNode } from 'react'
import Icon from './Icon'
import { cn } from '../lib/cn'

interface Props {
  icon?: string
  filled?: boolean
  size?: number
  onClick?: MouseEventHandler<HTMLDivElement>
  children: ReactNode
}

const Button = ({ icon, filled, size, onClick, children }: Props) => {
  return (
    <div
      className={cn(
        'round bg-button flex items-center gap-2 py-1 font-medium transition hover:cursor-pointer',
        icon ? 'pr-4 pl-2' : 'px-4',
      )}
      onClick={onClick}
    >
      {icon && <Icon icon={icon} filled={filled} size={size} />}
      {children}
    </div>
  )
}

export default Button
