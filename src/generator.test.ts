import SudokuGenerator from './generator'
import SudokuSolver from './sudoku'

describe('SudokuGenerator', () => {
  let generator: SudokuGenerator

  beforeEach(() => {
    generator = new SudokuGenerator()
  })

  test('creates generator with correct initial values', () => {
    const grid = (generator as any).emptyGrid
    expect(grid.length).toBe(9)
    expect(grid[0].length).toBe(9)
    expect(grid[0][0]).toBe(0)
  })

  test('validates number placement', () => {
    const grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    grid[0][0] = 1

    expect((generator as any).isValid(grid, 0, 1, 1)).toBe(false)
    expect((generator as any).isValid(grid, 1, 0, 1)).toBe(false)
    expect((generator as any).isValid(grid, 1, 1, 1)).toBe(false)
    expect((generator as any).isValid(grid, 0, 1, 2)).toBe(true)
  })

  test('shuffles array', () => {
    const array = [1, 2, 3, 4, 5]
    const shuffled = (generator as any).shuffle([...array])

    expect(shuffled.length).toBe(array.length)
    expect(shuffled.sort()).toEqual(array.sort())
    array.forEach((num) => {
      expect(shuffled).toContain(num)
    })
  })

  test('creates valid solved grid', () => {
    const solvedGrid = (generator as any).createSolvedSudoku()

    expect(solvedGrid.length).toBe(9)
    expect(solvedGrid[0].length).toBe(9)

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        expect(solvedGrid[i][j]).toBeGreaterThanOrEqual(1)
        expect(solvedGrid[i][j]).toBeLessThanOrEqual(9)
      }
    }

    const solver = new SudokuSolver(solvedGrid)
    expect(solver.getSolution()).toEqual(solvedGrid)
  })

  test.each([
    ['easy', 30],
    ['medium', 40],
    ['hard', 50],
    ['extreme', 60],
  ] as const)(
    'generates %s puzzle with correct empty cells',
    (difficulty, expectedEmpty) => {
      const { puzzle } = generator.generateSudoku(difficulty)

      const emptyCells = puzzle.flat().filter((cell) => cell === 0).length
      expect(emptyCells).toBeGreaterThanOrEqual(expectedEmpty - 5)
      expect(emptyCells).toBeLessThanOrEqual(expectedEmpty + 5)
    }
  )

  test('generates puzzle with unique solution', () => {
    const { puzzle } = generator.generateSudoku('medium')
    expect((generator as any).hasUniqueSolution(puzzle)).toBe(true)
  })

  test('generates multiple puzzles', () => {
    const count = 3
    const sudokus = generator.generateMultipleSudoku(count, 'medium')

    expect(sudokus.length).toBe(count)
    sudokus.forEach(({ puzzle, solution }) => {
      expect(puzzle.length).toBe(9)
      expect(solution.length).toBe(9)
      expect((generator as any).hasUniqueSolution(puzzle)).toBe(true)
    })
  })

  test('checks solution uniqueness', () => {
    const multipleSolutionsGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))

    multipleSolutionsGrid[0][0] = 1
    multipleSolutionsGrid[0][1] = 2
    multipleSolutionsGrid[1][0] = 3
    multipleSolutionsGrid[1][1] = 4

    expect((generator as any).hasUniqueSolution(multipleSolutionsGrid)).toBe(
      false
    )
  })

  test('matches snapshot for solved grid', () => {
    const solvedGrid = (generator as any).createSolvedSudoku()
    expect(solvedGrid).toMatchSnapshot('solved grid')
  })

  test.each(['easy', 'medium', 'hard', 'extreme'] as const)(
    'matches snapshot for %s puzzle',
    (difficulty) => {
      const { puzzle, solution } = generator.generateSudoku(difficulty)
      expect({
        difficulty,
        emptyCells: puzzle.flat().filter((cell) => cell === 0).length,
        unique: (generator as any).hasUniqueSolution(puzzle),
        data: {
          puzzle,
          solution,
        },
      }).toMatchSnapshot(`${difficulty} puzzle`)
    }
  )

  test('matches snapshot for multiple puzzles', () => {
    const count = 3
    const sudokus = generator.generateMultipleSudoku(count, 'medium')
    expect({
      count,
      difficulty: 'medium',
      puzzles: sudokus.map((sudoku) => ({
        emptyCells: sudoku.puzzle.flat().filter((cell) => cell === 0).length,
        unique: (generator as any).hasUniqueSolution(sudoku.puzzle),
        data: sudoku,
      })),
    }).toMatchSnapshot('multiple puzzles')
  })
})
