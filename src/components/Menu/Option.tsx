import { MouseEventHandler } from 'react'
import Icon from '../Icon'
import { cn } from '../../lib/cn'

interface Props {
  text: string
  icon: string
  iconFilled?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Option = ({
  text,
  icon,
  iconFilled = false,
  disabled = false,
  onClick,
}: Props) => {
  return (
    <div
      className={cn(
        'flex h-12 transition',
        !disabled
          ? 'hover:cursor-pointer hover:bg-zinc-100/20'
          : 'text-zinc-100/40 hover:cursor-default',
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <Icon icon={icon} filled={iconFilled} />
      </div>
      <div className="flex h-12 flex-1 items-center text-xl font-medium">
        {text}
      </div>
    </div>
  )
}

export default Option
