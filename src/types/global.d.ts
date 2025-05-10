export declare global {
  interface WindowEventMap {
    'beforeRouterBack': CustomEvent
    'beforeRouterForward': CustomEvent
    'beforeRouterRefresh': CustomEvent
    'beforeRouterPush': CustomEvent
    'beforeRouterReplace': CustomEvent
    'beforeRouterPrefetch': CustomEvent
    'beforeRouteChange': CustomEvent
  }
}

