import { pipe } from 'rxjs'
import { publishReplay, refCount } from 'rxjs/operators'

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const publishRef = <T>(bufferSize = 1, windowTime?: number) =>
  pipe(
    publishReplay<T>(bufferSize, windowTime),
    refCount(),
  )
