import { stat, readFile, readdir } from 'fs/promises'
import { join, relative, extname } from 'path'
import { defu } from 'defu'

async function getJsonFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = join(dir, dirent.name)
      return dirent.isDirectory() ? await getJsonFiles(res) : res
    })
  )
  return Array.prototype.concat(...files).filter(file => extname(file) === '.json')
}

function createNestedObject(keys: string[], value: any): Record<string, any> {
  const result: Record<string, any> = {}
  let current = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i] as string
    current[key] = current[key] || {}
    current = current[key]
  }
  current[keys[keys.length - 1] as string] = value
  return result
}

export async function mergeTokenSource(sourcePath: string): Promise<Record<string, any>> {
  let stats
  try {
    stats = await stat(sourcePath)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw error
    }
    throw error
  }

  if (stats.isFile()) {
    const content = await readFile(sourcePath, 'utf-8')
    const parsed = JSON.parse(content)
    return parsed.default || parsed
  }

  if (stats.isDirectory()) {
    const files = await getJsonFiles(sourcePath)
    files.sort() // Ensure deterministic order
    
    let mergedTokens: Record<string, any> = {}

    for (const file of files) {
      const content = await readFile(file, 'utf-8')
      let parsed = JSON.parse(content)
      parsed = parsed.default || parsed

      const relPath = relative(sourcePath, file)
      const keys = relPath
        .replace(/\.json$/, '')
        .split(/[\\/]/)

      let finalKeys = keys
      if (finalKeys[finalKeys.length - 1] === 'index') {
        finalKeys.pop()
      }

      if (finalKeys.length === 0) {
        mergedTokens = defu(mergedTokens, parsed)
      } else {
        const namespacedObject = createNestedObject(finalKeys, parsed)
        mergedTokens = defu(mergedTokens, namespacedObject)
      }
    }

    return mergedTokens
  }

  throw new Error(`Path is neither a file nor a directory: ${sourcePath}`)
}
