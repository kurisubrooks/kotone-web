import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { animateScroll, Element, scroller } from 'react-scroll'
import useLyrics from '../api/useLyrics'
import useQueue from '../hooks/useQueue'
import useProgress from '../hooks/useProgress'
import secsToTicks from '../lib/secsToTicks'
import { cn } from '../lib/cn'

const Lyrics = () => {
  const queue = useQueue()
  const { progress } = useProgress()
  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const lyrics = useLyrics(track ? track.Id : undefined, !!track)
  const timed = lyrics.data ? 'Start' in lyrics.data.Lyrics[0] : false
  const [follow, setFollow] = useState<boolean>(true)
  const [currentA, setCurrent] = useState<number>(0)
  const [current] = useDebounce(currentA, 200, { leading: true })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timed && !!lyrics.data) {
      const position = secsToTicks(progress)
      for (let i = 0; i < lyrics.data.Lyrics.length; i++) {
        const start = lyrics.data.Lyrics[i].Start
        if (start >= position + 200_0000) {
          if (i === 0) {
            setCurrent(null)
            break
          }
          setCurrent(i - 1)
          break
        }
      }
    }
  }, [progress])

  useEffect(() => {
    if (timed && follow && lyrics.data) {
      scroller.scrollTo(current?.toString(), {
        duration: 200,
        smooth: true,
        offset: -(containerRef.current.offsetHeight / 2 - 64),
        containerId: 'lyrics',
      })
    }
  }, [current, follow, timed])

  useEffect(() => {
    animateScroll.scrollToTop({
      duration: 0,
      smooth: false,
      containerId: 'lyrics',
    })
  }, [track])

  return (
    <div className="flex h-full flex-col gap-4 px-4 pt-4">
      <h1 className="text-3xl font-bold">Lyrics</h1>
      {lyrics.data && !lyrics.isLoading && (
        <div
          ref={containerRef}
          id="lyrics"
          className={cn(
            'flex h-full flex-col gap-6 overflow-y-scroll pb-6',
            follow && timed && 'overflow-hidden',
          )}
        >
          {lyrics.data.Lyrics.map((lyric, index) => (
            <Element
              name={index.toString()}
              key={index}
              className={cn(
                'text-3xl',
                timed && follow && index !== current && 'text-zinc-100/60',
              )}
            >
              {lyric.Text}
            </Element>
          ))}
        </div>
      )}
    </div>
  )
}

export default Lyrics
