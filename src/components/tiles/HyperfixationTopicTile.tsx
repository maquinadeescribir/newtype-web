import { useAppStore } from '../../store/useAppStore'
import { HYPERFIXATION_TOPICS } from '../../data/hyperfixations'

export default function HyperfixationTopicTile({ topicId }: { topicId: string }) {
  const items = useAppStore((s) => s.topicItems[topicId] ?? [])
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const topic = HYPERFIXATION_TOPICS.find((t) => t.id === topicId)
  if (!topic) return null

  return (
    <button
      className="tile-body com-tile-body"
      onClick={() => setActivePanel(topicId)}
      aria-label={`Open ${topic.topic}`}
    >
      <div className="hf-topic">{topic.topic}</div>
      <div className="com-hint">current · {items.length} saved</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
