/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
 */
enum ActivityType {
  /**
   * Playing {game}
   */
  Playing = 0,
  /**
   * Streaming {details}
   */
  Streaming = 1,
  /**
   * Listening to {name}
   */
  Listening = 2,
  /**
   * Watching {details}
   */
  Watching = 3,
  /**
   * {emoji} {state}
   */
  Custom = 4,
  /**
   * Competing in {name}
   */
  Competing = 5,
}

export default ActivityType
