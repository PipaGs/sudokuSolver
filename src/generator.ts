export type Grid = number[][]
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type SudokuResult = {
  id: string
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
    for (let x = 0; x < this.size; x++) {
      if (grid[row][x] === num) return false
    }
    for (let x = 0; x < this.size; x++) {
      if (grid[x][col] === num) return false
    }
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

  private createSolvedSudoku(): number[][] {
    const grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
    this.fillGrid(grid)
    return grid
  }

  private removeNumbers(
    grid: number[][],
    difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  ): number[][] {
    const puzzle = grid.map((row) => [...row])
    const cellsToRemove = {
      easy: 25,
      medium: 35,
      hard: 45,
      extreme: 55,
    }[difficulty]

    let removed = 0
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0
        removed++
      }
    }
    return puzzle
  }

  private hasUniqueSolution(grid: Grid): boolean {
    let solutionsCount = 0
    const gridCopy = grid.map((row) => [...row])
    const findAllSolutions = (row = 0, col = 0): void => {
      if (solutionsCount > 1) return
      if (row === 9) {
        solutionsCount++
        return
      }
      const nextRow = col === 8 ? row + 1 : row
      const nextCol = col === 8 ? 0 : col + 1
      if (gridCopy[row][col] !== 0) {
        findAllSolutions(nextRow, nextCol)
        return
      }
      for (let num = 1; num <= 9; num++) {
        if (this.isValid(gridCopy, row, col, num)) {
          gridCopy[row][col] = num
          findAllSolutions(nextRow, nextCol)
          if (solutionsCount > 1) return
          gridCopy[row][col] = 0
        }
      }
    }
    findAllSolutions()
    return solutionsCount === 1
  }

  private gridToBase64(grid: Grid): string {
    const flat = grid
      .flat()
      .map((n) => n.toString())
      .join('')
    return Buffer.from(flat, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  private base64ToGrid(b64url: string): Grid {
    let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4 !== 0) b64 += '='
    const str = Buffer.from(b64, 'base64').toString('utf8')
    if (str.length !== 81) throw new Error('Invalid ID')
    const arr = str.split('').map((c) => parseInt(c, 10))
    if (!arr.every((n) => n >= 1 && n <= 9)) {
      throw new Error('Invalid ID')
    }
    const grid: Grid = []
    for (let i = 0; i < 9; i++) {
      grid.push(arr.slice(i * 9, (i + 1) * 9))
    }
    return grid
  }

  public generateSudoku(difficulty: Difficulty = 'medium'): SudokuResult {
    const solvedGrid = this.createSolvedSudoku()
    const puzzle = this.removeNumbers(solvedGrid, difficulty)
    const emptyCells = puzzle.flat().filter((cell) => cell === 0).length
    const minEmptyCells: Record<Difficulty, number> = {
      easy: 25,
      medium: 35,
      hard: 45,
      extreme: 55,
    }
    if (emptyCells < minEmptyCells[difficulty]) {
      return this.generateSudoku(difficulty)
    }
    const id = this.gridToBase64(solvedGrid)
    return {
      id,
      puzzle,
      solution: solvedGrid,
    }
  }

  public generateFromId(
    id: string,
    difficulty: Difficulty = 'medium'
  ): SudokuResult {
    const solvedGrid = this.base64ToGrid(id)
    const puzzle = this.removeNumbers(solvedGrid, difficulty)
    return {
      id,
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
