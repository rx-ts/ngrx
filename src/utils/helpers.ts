import { last } from 'lodash'

export const getBaseHref = () => {
  // The last base element has highest privilege
  const base = last(document.getElementsByTagName('base'))
  // use `getAttribute` instead of `base.href` because the attribute could be void but results current whole location url
  return (base && base.getAttribute('href')) || '/'
}

export const isAbsoluteUrl = (url: string) => /^(https?:\/)?\//.test(url)
