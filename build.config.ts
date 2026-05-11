import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/module',
    {
      builder: 'mkdist',
      input: './runtime',
      outDir: './dist/runtime',
      addRelativeDeclarationExtensions: true,
      ext: 'js',
      pattern: [
        '**',
        '!**/*.stories.{js,cts,mts,ts,jsx,tsx}',
        '!**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}'
      ]
    }
  ]
})
