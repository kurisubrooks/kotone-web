import { cn } from '../lib/cn'

interface Props {
  icon: string
  filled?: boolean
  size?: number
  weight?: number
}

const Icon = ({ icon, filled = false, size, weight }: Props) => {
  return (
    <span
      className={cn(
        'material-symbols-rounded select-none',
        filled && 'material-symbols-filled',
      )}
      style={{
        fontSize: size ?? 24,
        fontWeight: weight ?? 400,
      }}
    >
      {icon}
    </span>
  )
}

export default Icon
