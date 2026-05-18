declare module '#build/design-tokens.json' {
  const value: Array<{
    name: string
    value: {
      syntax: string
      inherits?: boolean
      'initial-value': string
    }
  }>

  export default value
}

