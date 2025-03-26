import Icon from './Icon'

const FloatingPlayer = () => {
  return (
    <div className="absolute bottom-4 flex w-full justify-center">
      <div className="text-w round flex w-lg items-center bg-pink-800/40">
        <div className="flex grow gap-4">
          <div className="round bg-w h-16 w-16" />
          <div className="flex flex-col justify-center">
            <div className="text-xl font-medium">Title</div>
            <div className="text-zinc-100/80">Artist</div>
          </div>
        </div>
        <div className="flex gap-2 px-4">
          <Icon icon="play_arrow" size={32} filled />
          <Icon icon="skip_next" size={32} filled />
        </div>
      </div>
    </div>
  )
}

export default FloatingPlayer
