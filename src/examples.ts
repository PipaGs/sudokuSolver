import SudokuGenerator from './generator'

const sudokuGeneratorExample = new SudokuGenerator()

console.log('=== Example 1: Generate Sudoku and ID ===')
const sudokuResultExample = sudokuGeneratorExample.generateSudoku('hard')
console.log('Generated Sudoku (hard level):')
console.table(sudokuResultExample.puzzle)
console.log('Solution:')
console.table(sudokuResultExample.solution)
console.log('Sudoku ID (base64):', sudokuResultExample.id)

console.log('\n=== Example 2: Restore Sudoku from ID ===')
const restoredSudokuExample = sudokuGeneratorExample.generateFromId(
  sudokuResultExample.id,
  'hard'
)
console.log('Restored Sudoku:')
console.table(restoredSudokuExample.puzzle)
console.log('Restored solution:')
console.table(restoredSudokuExample.solution)
console.log('ID matches:', restoredSudokuExample.id === sudokuResultExample.id)

console.log('\n=== Example 3: Generate Multiple Sudokus ===')
const multipleSudokuPuzzlesExample =
  sudokuGeneratorExample.generateMultipleSudoku(3, 'medium')
console.log('Generated 3 Sudokus (medium level):')
multipleSudokuPuzzlesExample.forEach((item, idx) => {
  console.log(`\nSudoku #${idx + 1}:`)
  console.log('ID:', item.id)
  console.log('Puzzle:')
  console.table(item.puzzle)
  console.log('Solution:')
  console.table(item.solution)
})

console.log('\n=== Example 4: Restore All Sudokus from IDs ===')
console.log('Restoring all generated Sudokus from their IDs:')
multipleSudokuPuzzlesExample.forEach((item, idx) => {
  const restored = sudokuGeneratorExample.generateFromId(item.id, 'medium')
  console.log(`\nRestored Sudoku #${idx + 1}:`)
  console.log('ID matches:', restored.id === item.id)
  console.log(
    'Solution matches:',
    JSON.stringify(restored.solution) === JSON.stringify(item.solution)
  )
  console.table(restored.puzzle)
})

console.log('\n=== Example 5: Generate Sudokus with Different Difficulties ===')
const originalSudoku = sudokuGeneratorExample.generateSudoku('hard')
console.log('Original Sudoku (hard level):')
console.log('ID:', originalSudoku.id)
console.table(originalSudoku.puzzle)

const difficulties = ['easy', 'medium', 'hard', 'extreme'] as const
difficulties.forEach((difficulty) => {
  const restored = sudokuGeneratorExample.generateFromId(
    originalSudoku.id,
    difficulty
  )
  console.log(`\nRestored Sudoku (${difficulty} level):`)
  console.log('ID matches:', restored.id === originalSudoku.id)
  console.log(
    'Solution matches:',
    JSON.stringify(restored.solution) ===
      JSON.stringify(originalSudoku.solution)
  )
  console.table(restored.puzzle)
})
