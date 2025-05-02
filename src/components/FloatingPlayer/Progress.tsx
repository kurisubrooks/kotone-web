import usePlayer from '../../hooks/usePlayer'
import useProgress from '../../hooks/useProgress'

const Progress = () => {
  const { duration } = usePlayer()
  const { progress } = useProgress()

  return (
    <div className="round player-width pointer-events-none absolute bottom-0 h-full grow overflow-hidden">
      <div
        className="absolute bottom-0 h-1 rounded-full bg-zinc-100/40"
        style={{ width: (progress / duration) * 100 + '%' }}
      />
    </div>
  )
}

export default Progress
