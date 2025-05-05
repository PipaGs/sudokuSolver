export default {
  entry: {
    index: 'src/index.ts',
    sudoku: 'src/sudoku.ts',
    generator: 'src/generator.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    minify: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
  dts: true,
  clean: true,
}
