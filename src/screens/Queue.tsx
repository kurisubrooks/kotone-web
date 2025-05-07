import { CSSProperties } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import {
  Droppable,
  Draggable,
  DragDropContext,
  DropResult,
} from '@hello-pangea/dnd'
import useQueue from '../hooks/useQueue'
import useMenu from '../hooks/useMenu'
import { cn } from '../lib/cn'
import TrackListItem from '../components/TrackListItem'
import Item from 'jellyfin-api/lib/types/media/Item'
import { Track } from '../types/ItemTypes'

interface RowProps {
  data: Track[]
  index: number
  style: CSSProperties
}

const Row = ({ data, index, style }: RowProps) => {
  const { track, setTrack } = useQueue()
  const { setMenu } = useMenu()

  if (!data[index]) {
    return (
      <div className="flex h-18 w-full py-1">
        <div className="round group flex h-16 w-full gap-4 bg-red-400 py-1" />
      </div>
    )
  }

  return (
    <Draggable
      draggableId={data[index].Id + '_' + index}
      key={data[index].Id + '_' + index}
      index={index}
    >
      {(provided) => (
        <TrackListItem
          item={data[index] as Item}
          showLike={false}
          provided={provided}
          style={style}
          onClick={() => {
            setTrack(index)
          }}
          onContextMenu={(e) => setMenu(e, 'track', data[index])}
          playing={track === index}
        />
      )}
    </Draggable>
  )
}

const Queue = () => {
  const queue = useQueue()
  const { showMenu } = useMenu()

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    if (result.source.index === result.destination.index) {
      return
    }

    queue.moveQueue(result.source.index, result.destination.index)
  }

  return (
    <div className="flex h-full flex-col gap-4 px-4 pt-4">
      <h1 className="text-3xl font-bold">Queue</h1>
      <div className="flex h-full">
        <AutoSizer>
          {({ height, width }) => (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="queue"
                mode="virtual"
                renderClone={(provided, _snapshot, rubric) => (
                  <TrackListItem
                    item={queue.queue[rubric.source.index] as Item}
                    showLike={false}
                    provided={provided}
                    dragging
                    playing={queue.track === rubric.source.index}
                  />
                )}
              >
                {(provided) => (
                  <FixedSizeList
                    width={width}
                    height={height}
                    itemCount={queue.queue.length}
                    itemSize={72}
                    className={cn('pb-4', showMenu && 'overflow-y-hidden!')}
                    outerRef={provided.innerRef}
                    itemData={queue.queue}
                  >
                    {Row}
                  </FixedSizeList>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default Queue
