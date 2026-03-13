interface Data {
  [key: string]: unknown
}
export default function (obj: Data) {
  //TODO: Find the best way to get this from Theme Token
  const colorAttrs = new Set([
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'danger',
    'info'
  ])
  return Object.keys(obj).find((key) => colorAttrs.has(key))
}
