import { InjectionToken } from '@angular/core'

import { getBaseHref } from './helpers'

export const TOKEN_BASE_HREF = new InjectionToken<string>(
  'base href from DOM',
  {
    providedIn: 'root',
    factory: getBaseHref,
  },
)
