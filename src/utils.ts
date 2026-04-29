// Module label for logging purposes.
export const modLabel = '[DAREDASH] >>>> '

/**
 * Logs debug messages to the console if in development mode.
 * @param {string} message - The message to log.
 * @param {'log'|'warn'|'error'} [type] - The type of log message.
 * @param {any} [data] - Additional data to log.
 */
export function debugLog(
  message: string,
  type?: 'log' | 'warn' | 'error' | 'info' | 'debug',
  data?: any
) {
  if (process.env.NODE_ENV === 'development') {
    const logMethod = console[type || 'log']
    logMethod(`${modLabel} ${message}`, data ??  '')
  }
}
