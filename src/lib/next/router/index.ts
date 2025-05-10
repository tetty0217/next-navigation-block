'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { AppRouterEvent } from '../constants'
import { dispatchAppRouterEvent } from '../utils/event'

type Router = ReturnType<typeof useRouter>

export const useAppRouter = (): Router => {
  const router = useRouter()

  const back = useCallback(() => {
    const beforeRouteChangeEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeRouteChange)
    if (!beforeRouteChangeEvent?.defaultPrevented) {
      const beforeBackEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeBack)
      if (!beforeBackEvent?.defaultPrevented) {
        router.back()
      }
    }
  }, [router])

  const forward = useCallback(() => {
    const beforeRouteChangeEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeRouteChange)
    if (beforeRouteChangeEvent?.defaultPrevented) return

    const beforeForwardEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeForward)
    if (beforeForwardEvent?.defaultPrevented) return

    router.forward()
  }, [router])

  const refresh = useCallback(() => {
    const beforeRefreshEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeRefresh)
    if (beforeRefreshEvent?.defaultPrevented) return

    router.refresh()
  }, [router])

  const push = useCallback(
    (...args: Parameters<Router['push']>) => {
      const beforeRouteChangeEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeRouteChange, args)
      if (beforeRouteChangeEvent?.defaultPrevented) return

      const beforePushEvent = dispatchAppRouterEvent(AppRouterEvent.BeforePush, args)
      if (beforePushEvent?.defaultPrevented) return

      router.push(...args)
    },
    [router],
  )

  const replace = useCallback(
    (...args: Parameters<Router['replace']>) => {
      const beforeRouteChangeEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeRouteChange, args)
      if (beforeRouteChangeEvent?.defaultPrevented) return

      const beforeReplaceEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeReplace, args)
      if (beforeReplaceEvent?.defaultPrevented) return

      router.replace(...args)
    },
    [router],
  )

  const prefetch = useCallback(
    (...args: Parameters<Router['prefetch']>) => {
      const beforePrefetchEvent = dispatchAppRouterEvent(AppRouterEvent.BeforePrefetch, args)
      if (beforePrefetchEvent?.defaultPrevented) return

      router.prefetch(...args)
    },
    [router],
  )

  return {
    back,
    forward,
    refresh,
    push,
    replace,
    prefetch,
  }
}
