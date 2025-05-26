/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-restricted-syntax */

// CJS imports
const cjsIndex = require('../dist/index.js')
const cjsGenerator = require('../dist/generator.js')
const cjsSudoku = require('../dist/sudoku.js')

// describe('Entry points ESM', () => {
//   it('index.mjs exports', async () => {
//     const esmIndex = await import('../dist/index.mjs')
//     expect(esmIndex).toHaveProperty('SudokuGenerator')
//     expect(esmIndex).toHaveProperty('SudokuSolver')
//   })
//   it('generator.mjs exports', async () => {
//     const esmGenerator = await import('../dist/generator.mjs')
//     expect(esmGenerator).toHaveProperty('default')
//   })
//   it('sudoku.mjs exports', async () => {
//     const esmSudoku = await import('../dist/sudoku.mjs')
//     expect(esmSudoku).toHaveProperty('default')
//   })
// })

describe('Entry points CJS', () => {
  it('index.js exports', () => {
    expect(cjsIndex).toHaveProperty('SudokuGenerator')
    expect(cjsIndex).toHaveProperty('SudokuSolver')
  })
  it('generator.js exports', () => {
    expect(cjsGenerator).toHaveProperty('default')
  })
  it('sudoku.js exports', () => {
    expect(cjsSudoku).toHaveProperty('default')
  })
})
