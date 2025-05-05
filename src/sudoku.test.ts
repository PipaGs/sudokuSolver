import SudokuSolver from './sudoku'

describe('SudokuSolver', () => {
  test('solves simple puzzle', () => {
    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]

    const solver = new SudokuSolver(puzzle)
    const solution = solver.getSolution()

    expect(solution).not.toBeNull()
    expect(solution).toHaveLength(9)
    expect(solution![0]).toHaveLength(9)

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        expect(solution![i][j]).toBeGreaterThanOrEqual(1)
        expect(solution![i][j]).toBeLessThanOrEqual(9)
      }
    }
  })

  test('returns null for invalid puzzle', () => {
    const invalidPuzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 5],
    ]

    const solver = new SudokuSolver(invalidPuzzle)
    const solution = solver.getSolution()

    expect(solution).toBeNull()
  })

  test('solves empty puzzle', () => {
    const emptyPuzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))

    const solver = new SudokuSolver(emptyPuzzle)
    const solution = solver.getSolution()

    expect(solution).not.toBeNull()
    expect(solution).toHaveLength(9)
    expect(solution![0]).toHaveLength(9)

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        expect(solution![i][j]).toBeGreaterThanOrEqual(1)
        expect(solution![i][j]).toBeLessThanOrEqual(9)
      }
    }
  })

  test('solves puzzle with one clue', () => {
    const minimalPuzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    minimalPuzzle[0][0] = 1

    const solver = new SudokuSolver(minimalPuzzle)
    const solution = solver.getSolution()

    expect(solution).not.toBeNull()
    expect(solution).toHaveLength(9)
    expect(solution![0]).toHaveLength(9)
    expect(solution![0][0]).toBe(1)
  })

  test('validates number placement', () => {
    const puzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    puzzle[0][0] = 1

    const solver = new SudokuSolver(puzzle)

    expect((solver as any).isValid(1, [0, 1])).toBe(false)
    expect((solver as any).isValid(1, [1, 0])).toBe(false)
    expect((solver as any).isValid(1, [1, 1])).toBe(false)
    expect((solver as any).isValid(2, [0, 1])).toBe(true)
  })

  test('finds empty cell', () => {
    const puzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    puzzle[0][0] = 1

    const solver = new SudokuSolver(puzzle)
    const emptyCell = (solver as any).findEmptyCell()

    expect(emptyCell).not.toBeNull()
    expect(emptyCell![0]).toBe(0)
    expect(emptyCell![1]).toBe(1)
  })

  test('returns null when grid is full', () => {
    const fullGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(1))

    const solver = new SudokuSolver(fullGrid)
    const emptyCell = (solver as any).findEmptyCell()

    expect(emptyCell).toBeNull()
  })

  test('matches snapshot for simple solution', () => {
    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]

    const solver = new SudokuSolver(puzzle)
    const solution = solver.getSolution()
    expect(solution).toMatchSnapshot('simple solution')
  })

  test('matches snapshot for empty solution', () => {
    const emptyPuzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))

    const solver = new SudokuSolver(emptyPuzzle)
    const solution = solver.getSolution()
    expect(solution).toMatchSnapshot('empty solution')
  })

  test('matches snapshot for one clue solution', () => {
    const minimalPuzzle = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    minimalPuzzle[0][0] = 1

    const solver = new SudokuSolver(minimalPuzzle)
    const solution = solver.getSolution()
    expect(solution).toMatchSnapshot('one clue solution')
  })

  test('matches snapshot for invalid puzzle', () => {
    const invalidPuzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 5],
    ]

    const solver = new SudokuSolver(invalidPuzzle)
    const solution = solver.getSolution()
    expect(solution).toMatchSnapshot('invalid puzzle')
  })
})
