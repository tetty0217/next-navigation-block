'use client'

import _NextLink from 'next/link'
import { ComponentProps, MouseEvent } from 'react'
import { AppRouterEvent } from '../constants'
import { dispatchAppRouterEvent } from '../utils/event'

type NextLinkProps = ComponentProps<typeof _NextLink>

export const NextLink = ({ children, onClick, ...props }: NextLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const beforeRouteChangeEvent = dispatchAppRouterEvent(AppRouterEvent.BeforeRouteChange)
    if (beforeRouteChangeEvent?.defaultPrevented) {
      event.preventDefault()
      return
    }

    const beforeRouterPushEvent = dispatchAppRouterEvent(AppRouterEvent.BeforePush)
    if (beforeRouterPushEvent?.defaultPrevented) {
      event.preventDefault()
      return
    }

    if (onClick) {
      onClick(event)
    }
  }

  return (
    <_NextLink {...props} onClick={handleClick}>
      {children}
    </_NextLink>
  )
}
