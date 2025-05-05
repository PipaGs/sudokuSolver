import { SudokuSolver, SudokuGenerator } from './dist/index.mjs'

// Создаем генератор
const generator = new SudokuGenerator()

// Генерируем судоку
const result = generator.generateSudoku('easy')
console.log('Generated puzzle:')
console.log(result.puzzle.map((row) => row.join(' ')).join('\n'))

// Решаем судоку
const solver = new SudokuSolver(result.puzzle)
const solution = solver.getSolution()
console.log('\nSolution:')
console.log(solution.map((row) => row.join(' ')).join('\n'))
