import { ReactNode } from 'react'
import { Link } from 'react-router'
import Icon from './Icon'

interface Props {
  to: string
  children: ReactNode
}

const LinkedHeader = ({ to, children }: Props) => {
  return (
    <Link
      to={to}
      className="hover:bg-highlight mx-1 flex flex-row rounded-2xl px-3 py-1 transition"
    >
      <h2 className="flex-1 text-2xl font-medium">{children}</h2>
      <div className="flex items-center">
        <Icon icon="arrow_forward" />
      </div>
    </Link>
  )
}

export default LinkedHeader
