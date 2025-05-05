import SudokuSolver from './sudoku'

export type Grid = number[][]
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type SudokuResult = {
  puzzle: Grid
  solution: Grid
}

class SudokuGenerator {
  private readonly size: number
  private readonly emptyGrid: Grid

  constructor() {
    this.size = 9
    this.emptyGrid = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(0))
  }

  private isValid(grid: Grid, row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < this.size; x++) {
      if (grid[row][x] === num) return false
    }

    // Check column
    for (let x = 0; x < this.size; x++) {
      if (grid[x][col] === num) return false
    }

    // Check 3x3 box
    const startRow = row - (row % 3)
    const startCol = col - (col % 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false
      }
    }

    return true
  }

  private shuffle<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  private fillGrid(grid: Grid): boolean {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (grid[row][col] === 0) {
          const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
          for (const num of nums) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num
              if (this.fillGrid(grid)) return true
              grid[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  private createSolvedSudoku(): Grid {
    const grid = this.emptyGrid.map((row) => [...row])
    this.fillGrid(grid)
    return grid
  }

  private removeNumbers(grid: Grid, difficulty: Difficulty): Grid {
    const gridCopy = grid.map((row) => [...row])
    const cells = this.shuffle([...Array(81).keys()])

    const cellsToRemove: Record<Difficulty, number> = {
      easy: 30,
      medium: 40,
      hard: 50,
      extreme: 60,
    }

    let removed = 0
    let attempts = 0
    const maxAttempts = 100 // Prevent infinite loop

    while (removed < cellsToRemove[difficulty] && attempts < maxAttempts) {
      const cell = cells[attempts % cells.length]
      const row = Math.floor(cell / 9)
      const col = cell % 9

      if (gridCopy[row][col] !== 0) {
        const temp = gridCopy[row][col]
        gridCopy[row][col] = 0

        const testGrid = gridCopy.map((row) => [...row])
        if (this.hasUniqueSolution(testGrid)) {
          removed++
        } else {
          gridCopy[row][col] = temp
        }
      }
      attempts++
    }

    return gridCopy
  }

  private hasUniqueSolution(grid: Grid): boolean {
    let solutionsCount = 0
    const gridCopy = grid.map((row) => [...row])

    const findAllSolutions = (row = 0, col = 0): void => {
      // Stop if we found more than one solution
      if (solutionsCount > 1) return

      if (row === 9) {
        solutionsCount++
        return
      }

      // Move to next cell
      const nextRow = col === 8 ? row + 1 : row
      const nextCol = col === 8 ? 0 : col + 1

      // If cell is not empty, move to next cell
      if (gridCopy[row][col] !== 0) {
        findAllSolutions(nextRow, nextCol)
        return
      }

      // Try all possible numbers
      for (let num = 1; num <= 9; num++) {
        if (this.isValid(gridCopy, row, col, num)) {
          gridCopy[row][col] = num
          findAllSolutions(nextRow, nextCol)
          if (solutionsCount > 1) return // Stop if we found more than one solution
          gridCopy[row][col] = 0
        }
      }
    }

    findAllSolutions()
    return solutionsCount === 1
  }

  public generateSudoku(difficulty: Difficulty = 'medium'): SudokuResult {
    const solvedGrid = this.createSolvedSudoku()
    const puzzle = this.removeNumbers(solvedGrid, difficulty)

    // Check if we have enough empty cells
    const emptyCells = puzzle.flat().filter((cell) => cell === 0).length
    const minEmptyCells: Record<Difficulty, number> = {
      easy: 25,
      medium: 35,
      hard: 45,
      extreme: 55,
    }

    // If we haven't reached minimum empty cells, generate again
    if (emptyCells < minEmptyCells[difficulty]) {
      return this.generateSudoku(difficulty)
    }

    return {
      puzzle,
      solution: solvedGrid,
    }
  }

  public generateMultipleSudoku(
    count: number = 1,
    difficulty: Difficulty = 'medium'
  ): SudokuResult[] {
    const result: SudokuResult[] = []
    for (let i = 0; i < count; i++) {
      result.push(this.generateSudoku(difficulty))
    }
    return result
  }
}

export default SudokuGenerator
