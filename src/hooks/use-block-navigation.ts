import { useLayoutEffect, useMemo } from 'react'
import { AppRouterEvent, useAppRouter } from '@/lib/next'

type EventCallback = (event: Event, confirmed: boolean) => void

interface UseBlockNavigationProps {
  shouldBlock: boolean | (() => boolean)
  message?: string
  onBeforeUnload?: EventCallback
  onPopState?: EventCallback
  onBeforeRouteChange?: EventCallback
}

export const useBlockNavigation = ({
  shouldBlock,
  message = '離れる？？？',
  onBeforeUnload,
  onPopState,
  onBeforeRouteChange,
}: UseBlockNavigationProps) => {
  const router = useAppRouter()

  const blocked = useMemo(() => {
    return typeof shouldBlock === 'function' ? shouldBlock() : shouldBlock
  }, [shouldBlock])

  useLayoutEffect(() => {
    if (!blocked) return

    const handleBeforeRouteChange = (event: CustomEvent) => {
      const confirmed = window.confirm(message)

      onBeforeRouteChange?.(event, confirmed)

      if (!confirmed) event.preventDefault()
    }

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()

      const confirmed = window.confirm(message)

      if (confirmed) {
        onPopState?.(event, confirmed)
        router.back()
      } else {
        onPopState?.(event, confirmed)
        window.history.pushState(null, '', window.location.href)
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = message

      onBeforeUnload?.(event, false)

      return message
    }

    window.addEventListener(AppRouterEvent.BeforeRouteChange, handleBeforeRouteChange)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    window.history.pushState(null, '', window.location.href)

    return () => {
      window.removeEventListener(AppRouterEvent.BeforeRouteChange, handleBeforeRouteChange)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [blocked, router, message, onBeforeUnload, onPopState, onBeforeRouteChange])
}
