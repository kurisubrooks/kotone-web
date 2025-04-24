import { AnimatePresence, motion } from 'motion/react'
import useMenu from '../../hooks/useMenu'
import Track from './Track'

const Menu = () => {
  const menu = useMenu()

  return (
    <AnimatePresence>
      {menu.showMenu && (
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{
            duration: 0.1,
            easings: ['easeIn', 'easeOut'],
          }}
          className="round absolute z-100 min-w-64 overflow-hidden bg-zinc-900 text-zinc-100"
          style={{
            left: menu.x - 16,
            top: menu.y - 16,
          }}
        >
          {menu.type === 'track' && <Track />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Menu
