export const logger = {
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug('[DEBUG]', ...args)
    }
  },
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args)
  },
  info: (...args: unknown[]) => {
    console.info('[INFO]', ...args)
  }
}
