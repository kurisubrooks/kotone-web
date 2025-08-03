/**
 * https://discord.com/developers/docs/events/gateway-events#activity-object-status-display-types
 */
enum StatusDisplayType {
  /**
   * "Listening to Spotify"
   */
  Name = 0,
  /**
   * "Listening to Rick Astley"
   */
  State = 1,
  /**
   * "Listening to Never Gonna Give You Up"
   */
  Details = 2,
}

export default StatusDisplayType
