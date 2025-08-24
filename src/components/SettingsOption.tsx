import { MouseEventHandler, ReactNode } from 'react'
import Icon from './Icon'
import { cn } from '../lib/cn'

interface Props {
  title: string
  description?: string
  icon?: string
  filled?: boolean
  right?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const SettingsOption = ({
  title,
  description,
  icon,
  filled,
  right,
  onClick,
}: Props) => {
  return (
    <div
      className={cn(
        'hover:bg-highlight flex items-center gap-4 rounded-2xl px-4 py-2 transition',
        onClick && 'hover:cursor-pointer',
      )}
      onClick={onClick}
    >
      {icon && <Icon icon={icon} filled={filled} />}
      <div className="flex flex-1 flex-col">
        <div className="text-2xl font-medium">{title}</div>
        {description && <div>{description}</div>}
      </div>
      {!!right && right}
    </div>
  )
}

export default SettingsOption
