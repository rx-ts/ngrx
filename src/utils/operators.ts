import { pipe } from 'rxjs'
import { publishReplay, refCount } from 'rxjs/operators'

export const publishRef = <T>(bufferSize = 1, windowTime?: number) =>
  pipe(publishReplay<T>(bufferSize, windowTime), refCount())
