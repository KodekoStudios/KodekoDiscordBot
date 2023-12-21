import { isEmpty, isNaN, isNil } from 'lodash'

export function is_falsy (
  source: unknown
): source is '' | [] | Record<string, never> | null | undefined {
  return (
    isNil(source) ||
    isEmpty(source) ||
    isNaN(source as number) ||
    (typeof source === 'number' && source < 0) ||
    !source
  )
}
