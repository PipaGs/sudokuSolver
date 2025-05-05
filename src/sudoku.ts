type Grid = number[][]

class SudokuSolver {
  private readonly size: number
  private readonly boxSize: number
  private grid: Grid

  constructor(grid: Grid) {
    this.size = 9
    this.boxSize = 3
    this.grid = grid.map((row) => [...row])
  }

  public solve(): Grid | null {
    if (this.solveSudoku(0, 0)) {
      return this.grid.map((row) => [...row])
    }
    return null
  }

  public getSolution(): Grid | null {
    return this.solve()
  }

  private findEmptyCell(): [number, number] | null {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] === 0) {
          return [row, col]
        }
      }
    }
    return null
  }

  private isValid(num: number, pos: [number, number]): boolean {
    const [row, col] = pos

    // Check row
    for (let x = 0; x < this.size; x++) {
      if (this.grid[row][x] === num && x !== col) {
        return false
      }
    }

    // Check column
    for (let x = 0; x < this.size; x++) {
      if (this.grid[x][col] === num && x !== row) {
        return false
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / this.boxSize) * this.boxSize
    const boxCol = Math.floor(col / this.boxSize) * this.boxSize

    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        if (
          this.grid[boxRow + i][boxCol + j] === num &&
          boxRow + i !== row &&
          boxCol + j !== col
        ) {
          return false
        }
      }
    }

    return true
  }

  private solveSudoku(row: number, col: number): boolean {
    const emptyCell = this.findEmptyCell()

    if (!emptyCell) {
      return true
    }

    const [currentRow, currentCol] = emptyCell

    for (let num = 1; num <= this.size; num++) {
      if (this.isValid(num, [currentRow, currentCol])) {
        this.grid[currentRow][currentCol] = num

        if (this.solveSudoku(currentRow, currentCol)) {
          return true
        }

        this.grid[currentRow][currentCol] = 0
      }
    }

    return false
  }
}

export default SudokuSolver
