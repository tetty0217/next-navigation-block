import { AppRouterEvent } from '../constants'

export const dispatchAppRouterEvent = (
  type: (typeof AppRouterEvent)[keyof typeof AppRouterEvent],
  detail?: unknown,
) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)
    return event
  }

  return null
}
