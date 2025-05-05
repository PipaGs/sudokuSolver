import SudokuGenerator from './generator'
import SudokuSolver from './sudoku'

// Example of a hard Sudoku puzzle
const hardSudoku: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 8, 5],
  [0, 0, 1, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 5, 0, 7, 0, 0, 0],
  [0, 0, 4, 0, 0, 0, 1, 0, 0],
  [0, 9, 0, 0, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0, 0, 7, 3],
  [0, 0, 2, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 9],
]

// Example of solving a Sudoku puzzle
const solver = new SudokuSolver(hardSudoku)
const solution = solver.getSolution()

if (solution) {
  console.log('Solution found:')
  console.log(solution.map((row) => row.join(' ')).join('\n'))
} else {
  console.log('No solution found')
}

// Example of generating a Sudoku puzzle
const generator = new SudokuGenerator()

// Generate a medium difficulty Sudoku
const { puzzle, solution: generatedSolution } =
  generator.generateSudoku('medium')

console.log('\nGenerated Sudoku (medium difficulty):')
console.log(puzzle.map((row) => row.join(' ')).join('\n'))

console.log('\nSolution:')
console.log(generatedSolution.map((row) => row.join(' ')).join('\n'))

// Generate multiple Sudoku puzzles of different difficulties
const difficulties = ['easy', 'medium', 'hard', 'extreme'] as const
const multipleSudokus = generator.generateMultipleSudoku(4, 'medium')

console.log('\nMultiple generated Sudoku puzzles:')
multipleSudokus.forEach((sudoku, index) => {
  console.log(`\nSudoku #${index + 1}:`)
  console.log(sudoku.puzzle.map((row) => row.join(' ')).join('\n'))
})
