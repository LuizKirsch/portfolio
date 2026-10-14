import { useSyncExternalStore } from 'react'

/** true enquanto a media query casar; reage a resize e rotação. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => matchMedia(query).matches,
  )
}

export const MOBILE = '(max-width: 767px)'
