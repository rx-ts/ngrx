import { TemplateOptions } from 'lodash'

export const TEMPLATE_OPTIONS: TemplateOptions = Object.freeze({
  interpolate: /{{([\s\S]+?)}}/g,
})
