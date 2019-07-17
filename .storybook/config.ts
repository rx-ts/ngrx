import { setConsoleOptions } from '@storybook/addon-console'
import { withKnobs } from '@storybook/addon-knobs'
import { addDecorator, configure } from '@storybook/angular'

addDecorator(withKnobs)

setConsoleOptions({
  panelExclude: [],
})

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.ts$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
