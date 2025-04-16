import { MouseEventHandler } from 'react'
import { cn } from '../../lib/cn'
import Icon from '../Icon'

interface Props {
  icon: string
  onClick?: MouseEventHandler<HTMLDivElement>
  show?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'always'
}

const Button = ({ icon, onClick, show = 'always' }: Props) => {
  return (
    <Icon
      icon={icon}
      size={32}
      filled
      onClick={onClick}
      className={cn(
        'player-button rounded-full p-2 transition hover:cursor-pointer hover:bg-zinc-100/20',
        show !== 'always' && 'hidden!',
        show === 'sm' && 'sm:block!',
        show === 'md' && 'md:block!',
        show === 'lg' && 'lg:block!',
        show === 'xl' && 'xl:block!',
        show === '2xl' && '2xl:block!',
      )}
    />
  )
}

export default Button
