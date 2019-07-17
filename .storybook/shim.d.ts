declare module '@storybook/addon-console' {
  export const setConsoleOptions: (options: { panelExclude: RegExp[] }) => void
}
