import { MouseEventHandler } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/cn'

interface Props {
  state: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Switch = ({ state, onClick }: Props) => {
  return (
    <div
      className={cn(
        'flex h-4 w-12 cursor-pointer rounded-full p-0.5 transition',
        state ? 'bg-pink-800' : 'bg-highlight',
      )}
      onClick={onClick}
    >
      <motion.div
        layout
        className="relative h-3 w-6 rounded-full bg-zinc-100"
        style={{ left: state ? 20 : 0 }}
        transition={{
          type: 'spring',
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </div>
  )
}

export default Switch
