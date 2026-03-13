/**
 * @interface TypedTokenValue
 * @description Represents a typed token value with syntax, inheritance, and initial value.
 * @property {string} syntax - The syntax of the token.
 * @property {boolean} [inherits] - Indicates if the token inherits from another.
 * @property {string} 'initial-value' - The initial value of the token.
 */
export interface TypedTokenValue {
  syntax: string
  inherits?: boolean
  'initial-value': string
}

/**
 * @interface TokenNode
 * @description Represents a token node with optional description, type, and value.
 * @property {string} [$description] - A description of the token.
 * @property {string} [$type] - The type of the token.
 * @property {TypedTokenValue|string} [$value] - The value of the token.
 * @property {any} [key] - Additional properties of the token node.
 */
export interface TokenNode {
  $description?: string
  $type?: string
  $value?: TypedTokenValue | string
  [key: string]: any
}

/**
 * Represents a file containing tokens, mapping string keys to token nodes.
 * @typedef {Object} TokensFile
 * @property {TokenNode} [key] - A token node.
 */
export interface TokensFile {
  [key: string]: TokenNode
}

/**
 * Represents the options for the module.
 * @typedef {Object} ModuleOptions
 * @property {string} [tokens] - The path to the tokens file.
 */
export interface ModuleOptions {
  tokens?: string
  debug?: boolean
  prefix?: string
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    daredash?: {
      /**
       * Global icon overrides for the daredash UI components.
       * Set these strings to any valid icon name supported by @nuxt/icon.
       */
      icons?: {
        success?: string
        error?: string
        warning?: string
        info?: string
        toastClose?: string
        selectArrow?: string
        modalClose?: string
        [key: string]: string | undefined
      }
    }
  }
}
