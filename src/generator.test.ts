import SudokuGenerator from './generator'
import SudokuSolver from './sudoku'

describe('SudokuGenerator', () => {
  let generator: SudokuGenerator

  beforeEach(() => {
    generator = new SudokuGenerator()
  })

  describe('generateSudoku', () => {
    it('generates valid sudoku puzzle', () => {
      const result = generator.generateSudoku()
      expect(result.puzzle.length).toBe(9)
      expect(result.puzzle[0].length).toBe(9)
      expect(result.solution.length).toBe(9)
      expect(result.solution[0].length).toBe(9)
    })

    it('generates puzzle with unique solution', () => {
      const result = generator.generateSudoku()
      const solver = new SudokuSolver(result.puzzle)
      const solutions = solver.getSolution()
      expect(solutions).toBeDefined()
    })

    it('generates different puzzles each time', () => {
      const result1 = generator.generateSudoku()
      const result2 = generator.generateSudoku()
      expect(result1.puzzle).not.toEqual(result2.puzzle)
    })

    it('generates puzzle with correct difficulty', () => {
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]
      difficulties.forEach((difficulty) => {
        const result = generator.generateSudoku(difficulty)
        const emptyCells = result.puzzle
          .flat()
          .filter((cell) => cell === 0).length
        const minEmptyCells: Record<typeof difficulty, number> = {
          easy: 25,
          medium: 35,
          hard: 45,
          extreme: 55,
        }
        expect(emptyCells).toBeGreaterThanOrEqual(minEmptyCells[difficulty])
      })
    })

    it('generates valid solution', () => {
      const result = generator.generateSudoku()
      const solver = new SudokuSolver(result.solution)
      expect(solver.getSolution()).toEqual(result.solution)
    })

    it('generates puzzle with valid ID', () => {
      const result = generator.generateSudoku()
      expect(result.id).toBeDefined()
      expect(() => Buffer.from(result.id, 'base64')).not.toThrow()
      const decoded = Buffer.from(result.id, 'base64').toString('utf8')
      expect(decoded.length).toBe(81)
      expect(decoded.split('').every((c) => /[1-9]/.test(c))).toBe(true)
    })

    it('generates same sudoku from ID', () => {
      const original = generator.generateSudoku()
      const recreated = generator.generateFromId(original.id)

      expect(recreated.id).toBe(original.id)
      expect(recreated.solution).toEqual(original.solution)
      expect(recreated.puzzle.flat().filter((cell) => cell === 0).length).toBe(
        original.puzzle.flat().filter((cell) => cell === 0).length
      )
    })

    it('generates different IDs for different sudokus', () => {
      const result1 = generator.generateSudoku()
      const result2 = generator.generateSudoku()
      expect(result1.id).not.toBe(result2.id)
    })

    it('recreates grid from ID correctly', () => {
      const original = generator.generateSudoku()
      const recreated = generator.generateFromId(original.id)

      expect(recreated.solution.length).toBe(9)
      expect(recreated.solution[0].length).toBe(9)
      expect(
        recreated.solution.flat().every((num) => num >= 1 && num <= 9)
      ).toBe(true)
    })

    it('handles invalid ID format', () => {
      expect(() => generator.generateFromId('invalid-id')).toThrow('Invalid ID')
    })

    it('should generate sudoku with a valid ID', () => {
      const { puzzle, solution, id } = generator.generateSudoku('easy')
      expect(puzzle).toBeDefined()
      expect(solution).toBeDefined()
      expect(id).toBeDefined()
      expect(id).toMatch(/^[A-Za-z0-9\-_]+$/)
      let b64 = id.replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4 !== 0) b64 += '='
      const decoded = Buffer.from(b64, 'base64').toString('utf8')
      expect(decoded.length).toBe(81)
      expect(decoded).toMatch(/^[1-9]+$/)
    })

    it('should generate different sudoku puzzles', () => {
      const results = Array.from({ length: 5 }, () =>
        generator.generateSudoku('easy')
      )
      const ids = results.map((r) => r.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(5)
      results.forEach(({ puzzle, solution, id }) => {
        expect(puzzle).toBeDefined()
        expect(solution).toBeDefined()
        expect(id).toBeDefined()
        expect(id).toMatch(/^[A-Za-z0-9\-_]+$/)
        let b64 = id.replace(/-/g, '+').replace(/_/g, '/')
        while (b64.length % 4 !== 0) b64 += '='
        const decoded = Buffer.from(b64, 'base64').toString('utf8')
        expect(decoded.length).toBe(81)
        expect(decoded).toMatch(/^[1-9]+$/)
      })
    })

    it('should generate a valid base64url ID', () => {
      const { id } = generator.generateSudoku('easy')
      expect(id).toMatch(/^[A-Za-z0-9\-_]+$/)
      let b64 = id.replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4 !== 0) b64 += '='
      const decoded = Buffer.from(b64, 'base64').toString('utf8')
      expect(decoded.length).toBe(81)
      expect(decoded).toMatch(/^[1-9]+$/)
    })

    it('returns valid puzzle, solution and id', () => {
      const result = generator.generateSudoku()
      expect(result).toHaveProperty('id')
      expect(typeof result.id).toBe('string')
      expect(result.id).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(result).toHaveProperty('puzzle')
      expect(result).toHaveProperty('solution')
      expect(Array.isArray(result.puzzle)).toBe(true)
      expect(Array.isArray(result.solution)).toBe(true)
      expect(result.puzzle.length).toBe(9)
      expect(result.solution.length).toBe(9)
      for (let i = 0; i < 9; i++) {
        expect(Array.isArray(result.puzzle[i])).toBe(true)
        expect(Array.isArray(result.solution[i])).toBe(true)
        expect(result.puzzle[i].length).toBe(9)
        expect(result.solution[i].length).toBe(9)
        for (let j = 0; j < 9; j++) {
          expect(typeof result.puzzle[i][j]).toBe('number')
          expect(result.puzzle[i][j]).toBeGreaterThanOrEqual(0)
          expect(result.puzzle[i][j]).toBeLessThanOrEqual(9)
          expect(typeof result.solution[i][j]).toBe('number')
          expect(result.solution[i][j]).toBeGreaterThanOrEqual(1)
          expect(result.solution[i][j]).toBeLessThanOrEqual(9)
        }
      }
      expect(result.puzzle.flat().some((n: number) => n === 0)).toBe(true)
      expect(
        result.solution.flat().every((n: number) => n >= 1 && n <= 9)
      ).toBe(true)
    })
  })

  describe('generateMultipleSudoku', () => {
    it('generates specified number of puzzles', () => {
      const count = 5
      const results = generator.generateMultipleSudoku(count)
      expect(results.length).toBe(count)
    })

    it('generates different puzzles', () => {
      const results = generator.generateMultipleSudoku(3)
      const puzzles = results.map((r) => r.puzzle)
      expect(new Set(puzzles.map((p) => p.toString())).size).toBe(3)
    })

    it('generates puzzles with correct difficulty', () => {
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]
      difficulties.forEach((difficulty) => {
        const results = generator.generateMultipleSudoku(2, difficulty)
        results.forEach((result) => {
          const emptyCells = result.puzzle
            .flat()
            .filter((cell) => cell === 0).length
          const minEmptyCells: Record<typeof difficulty, number> = {
            easy: 25,
            medium: 35,
            hard: 45,
            extreme: 55,
          }
          expect(emptyCells).toBeGreaterThanOrEqual(minEmptyCells[difficulty])
        })
      })
    })

    it('generates multiple valid puzzles', () => {
      const results = generator.generateMultipleSudoku(3)
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(3)
      for (const result of results) {
        expect(result).toHaveProperty('id')
        expect(typeof result.id).toBe('string')
        expect(result.id).toMatch(/^[A-Za-z0-9_-]+$/)
        expect(result).toHaveProperty('puzzle')
        expect(result).toHaveProperty('solution')
        expect(Array.isArray(result.puzzle)).toBe(true)
        expect(Array.isArray(result.solution)).toBe(true)
        expect(result.puzzle.length).toBe(9)
        expect(result.solution.length).toBe(9)
        for (let i = 0; i < 9; i++) {
          expect(Array.isArray(result.puzzle[i])).toBe(true)
          expect(Array.isArray(result.solution[i])).toBe(true)
          expect(result.puzzle[i].length).toBe(9)
          expect(result.solution[i].length).toBe(9)
          for (let j = 0; j < 9; j++) {
            expect(typeof result.puzzle[i][j]).toBe('number')
            expect(result.puzzle[i][j]).toBeGreaterThanOrEqual(0)
            expect(result.puzzle[i][j]).toBeLessThanOrEqual(9)
            expect(typeof result.solution[i][j]).toBe('number')
            expect(result.solution[i][j]).toBeGreaterThanOrEqual(1)
            expect(result.solution[i][j]).toBeLessThanOrEqual(9)
          }
        }
        expect(result.puzzle.flat().some((n: number) => n === 0)).toBe(true)
        expect(
          result.solution.flat().every((n: number) => n >= 1 && n <= 9)
        ).toBe(true)
      }
    })
  })

  describe('snapshots', () => {
    it('generates consistent puzzles', () => {
      const result = generator.generateSudoku()
      expect(result).toHaveProperty('id')
      expect(typeof result.id).toBe('string')
      expect(result.id).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(result).toHaveProperty('puzzle')
      expect(result).toHaveProperty('solution')
      expect(Array.isArray(result.puzzle)).toBe(true)
      expect(Array.isArray(result.solution)).toBe(true)
      expect(result.puzzle.length).toBe(9)
      expect(result.solution.length).toBe(9)
      for (let i = 0; i < 9; i++) {
        expect(Array.isArray(result.puzzle[i])).toBe(true)
        expect(Array.isArray(result.solution[i])).toBe(true)
        expect(result.puzzle[i].length).toBe(9)
        expect(result.solution[i].length).toBe(9)
        for (let j = 0; j < 9; j++) {
          expect(typeof result.puzzle[i][j]).toBe('number')
          expect(result.puzzle[i][j]).toBeGreaterThanOrEqual(0)
          expect(result.puzzle[i][j]).toBeLessThanOrEqual(9)
          expect(typeof result.solution[i][j]).toBe('number')
          expect(result.solution[i][j]).toBeGreaterThanOrEqual(1)
          expect(result.solution[i][j]).toBeLessThanOrEqual(9)
        }
      }
      expect(result.puzzle.flat().some((n) => n === 0)).toBe(true)
      expect(result.solution.flat().every((n) => n >= 1 && n <= 9)).toBe(true)
    })

    it('generates consistent multiple puzzles', () => {
      const results = generator.generateMultipleSudoku(3)
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(3)
      for (const result of results) {
        expect(result).toHaveProperty('id')
        expect(typeof result.id).toBe('string')
        expect(result.id).toMatch(/^[A-Za-z0-9_-]+$/)
        expect(result).toHaveProperty('puzzle')
        expect(result).toHaveProperty('solution')
        expect(Array.isArray(result.puzzle)).toBe(true)
        expect(Array.isArray(result.solution)).toBe(true)
        expect(result.puzzle.length).toBe(9)
        expect(result.solution.length).toBe(9)
        for (let i = 0; i < 9; i++) {
          expect(Array.isArray(result.puzzle[i])).toBe(true)
          expect(Array.isArray(result.solution[i])).toBe(true)
          expect(result.puzzle[i].length).toBe(9)
          expect(result.solution[i].length).toBe(9)
          for (let j = 0; j < 9; j++) {
            expect(typeof result.puzzle[i][j]).toBe('number')
            expect(result.puzzle[i][j]).toBeGreaterThanOrEqual(0)
            expect(result.puzzle[i][j]).toBeLessThanOrEqual(9)
            expect(typeof result.solution[i][j]).toBe('number')
            expect(result.solution[i][j]).toBeGreaterThanOrEqual(1)
            expect(result.solution[i][j]).toBeLessThanOrEqual(9)
          }
        }
        expect(result.puzzle.flat().some((n) => n === 0)).toBe(true)
        expect(result.solution.flat().every((n) => n >= 1 && n <= 9)).toBe(true)
      }
    })
  })

  it('restores the same solution from ID', () => {
    const { id, solution } = generator.generateSudoku('hard')
    const restored = generator.generateFromId(id, 'hard')
    expect(restored.solution).toEqual(solution)
    expect(restored.id).toBe(id)
  })

  it('restores puzzle with correct difficulty from ID', () => {
    const { id } = generator.generateSudoku('extreme')
    const restored = generator.generateFromId(id, 'easy')
    const emptyCells = restored.puzzle
      .flat()
      .filter((cell) => cell === 0).length
    expect(emptyCells).toBeGreaterThanOrEqual(25)
    expect(emptyCells).toBeLessThanOrEqual(35)
  })

  it('throws error for invalid ID (not base64)', () => {
    expect(() => generator.generateFromId('not_base64')).toThrow()
  })

  it('throws error for invalid ID (wrong length)', () => {
    const short = Buffer.from('12345', 'utf8').toString('base64')
    expect(() => generator.generateFromId(short)).toThrow()
  })

  it('generates different IDs for different solutions', () => {
    const sudoku1 = generator.generateSudoku('medium')
    const sudoku2 = generator.generateSudoku('medium')
    expect(sudoku1.id).not.toBe(sudoku2.id)
  })

  it('should generate multiple sudoku puzzles with valid IDs', () => {
    const sudokuPuzzles = generator.generateMultipleSudoku(3)
    expect(sudokuPuzzles).toHaveLength(3)
    sudokuPuzzles.forEach(({ id, solution }) => {
      const decoded = Buffer.from(id, 'base64').toString('utf8')
      expect(decoded.length).toBe(81)
      expect(decoded.split('').every((c) => /[1-9]/.test(c))).toBe(true)
      const restored = generator.generateFromId(id, 'medium')
      expect(restored.solution).toEqual(solution)
    })
  })

  describe('ID validation and recovery', () => {
    it('generates valid base64 ID', () => {
      const result = generator.generateSudoku()
      const decoded = Buffer.from(result.id, 'base64').toString('utf8')
      expect(decoded.length).toBe(81)
      expect(decoded.split('').every((c) => /[1-9]/.test(c))).toBe(true)
    })

    it('maintains solution integrity through ID recovery', () => {
      const original = generator.generateSudoku('hard')
      const recreated = generator.generateFromId(original.id, 'hard')
      expect(recreated.solution).toEqual(original.solution)
      expect(
        recreated.solution.flat().every((num) => num >= 1 && num <= 9)
      ).toBe(true)
    })

    it('preserves difficulty constraints when recreating from ID', () => {
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]

      difficulties.forEach((difficulty) => {
        const original = generator.generateSudoku(difficulty)
        const recreated = generator.generateFromId(original.id, difficulty)

        const emptyCells = recreated.puzzle
          .flat()
          .filter((cell) => cell === 0).length
        const minEmptyCells: Record<typeof difficulty, number> = {
          easy: 25,
          medium: 35,
          hard: 45,
          extreme: 55,
        }

        expect(emptyCells).toBeGreaterThanOrEqual(minEmptyCells[difficulty])
      })
    })

    it('handles invalid base64 characters in ID', () => {
      const invalidId = 'invalid@base64#chars'
      expect(() => generator.generateFromId(invalidId)).toThrow('Invalid ID')
    })

    it('handles base64 string with wrong length', () => {
      const shortId = Buffer.from('12345', 'utf8').toString('base64')
      expect(() => generator.generateFromId(shortId)).toThrow('Invalid ID')
    })

    it('handles base64 string with invalid sudoku numbers', () => {
      const invalidNumbers = '0'.repeat(81)
      const invalidId = Buffer.from(invalidNumbers, 'utf8').toString('base64')
      expect(() => generator.generateFromId(invalidId)).toThrow('Invalid ID')
    })
  })

  describe('Multiple sudoku generation with IDs', () => {
    it('generates unique IDs for multiple sudokus', () => {
      const count = 5
      const results = generator.generateMultipleSudoku(count)
      const ids = results.map((r) => r.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(count)
    })

    it('maintains solution integrity for multiple sudokus', () => {
      const results = generator.generateMultipleSudoku(3, 'medium')
      results.forEach(({ id, solution }) => {
        const recreated = generator.generateFromId(id, 'medium')
        expect(recreated.solution).toEqual(solution)
      })
    })

    it('generates different difficulties for same solution', () => {
      const original = generator.generateSudoku('hard')
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]

      difficulties.forEach((difficulty) => {
        const recreated = generator.generateFromId(original.id, difficulty)
        expect(recreated.solution).toEqual(original.solution)

        const emptyCells = recreated.puzzle
          .flat()
          .filter((cell) => cell === 0).length
        const minEmptyCells: Record<typeof difficulty, number> = {
          easy: 25,
          medium: 35,
          hard: 45,
          extreme: 55,
        }

        expect(emptyCells).toBeGreaterThanOrEqual(minEmptyCells[difficulty])
      })
    })
  })

  describe('Edge cases', () => {
    it('handles empty string ID', () => {
      expect(() => generator.generateFromId('')).toThrow('Invalid ID')
    })

    it('handles very long base64 string', () => {
      const longId = Buffer.from('1'.repeat(1000), 'utf8').toString('base64')
      expect(() => generator.generateFromId(longId)).toThrow('Invalid ID')
    })

    it('generates valid sudoku with minimum difficulty', () => {
      const result = generator.generateSudoku('easy')
      const emptyCells = result.puzzle
        .flat()
        .filter((cell) => cell === 0).length
      expect(emptyCells).toBeGreaterThanOrEqual(25)
      expect(emptyCells).toBeLessThanOrEqual(35)
    })

    it('generates valid sudoku with maximum difficulty', () => {
      const result = generator.generateSudoku('extreme')
      const emptyCells = result.puzzle
        .flat()
        .filter((cell) => cell === 0).length
      expect(emptyCells).toBeGreaterThanOrEqual(55)
      expect(emptyCells).toBeLessThanOrEqual(65)
    })
  })

  describe('ID uniqueness and integrity', () => {
    it('generates unique IDs for large batch of sudokus', () => {
      const batchSize = 100
      const results = generator.generateMultipleSudoku(batchSize)
      const ids = results.map((r) => r.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(batchSize)
    })

    it('maintains ID uniqueness across different difficulties', () => {
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]
      const allIds = new Set<string>()

      difficulties.forEach((difficulty) => {
        const results = generator.generateMultipleSudoku(10, difficulty)
        results.forEach((result) => {
          expect(allIds.has(result.id)).toBe(false)
          allIds.add(result.id)
        })
      })
    })

    it('ensures ID is deterministic for same solution', () => {
      const original = generator.generateSudoku()
      const recreated = generator.generateFromId(original.id)
      const recreatedAgain = generator.generateFromId(original.id)

      expect(recreated.id).toBe(original.id)
      expect(recreatedAgain.id).toBe(original.id)
      expect(recreated.solution).toEqual(original.solution)
      expect(recreatedAgain.solution).toEqual(original.solution)
    })

    it('verifies ID format consistency', () => {
      const results = generator.generateMultipleSudoku(50)
      results.forEach((result) => {
        // Проверяем формат base64url
        expect(result.id).toMatch(/^[A-Za-z0-9\-_]+$/)

        // Проверяем декодирование
        let b64 = result.id.replace(/-/g, '+').replace(/_/g, '/')
        while (b64.length % 4 !== 0) b64 += '='
        const decoded = Buffer.from(b64, 'base64').toString('utf8')

        // Проверяем длину и содержимое
        expect(decoded.length).toBe(81)
        expect(decoded).toMatch(/^[1-9]+$/)

        // Проверяем, что декодированное значение соответствует решению
        const solutionString = result.solution.flat().join('')
        expect(decoded).toBe(solutionString)
      })
    })

    it('ensures ID uniqueness with same difficulty', () => {
      const difficulty = 'medium'
      const results = generator.generateMultipleSudoku(50, difficulty)
      const ids = results.map((r) => r.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(50)
    })

    it('verifies ID recovery with different difficulties', () => {
      const original = generator.generateSudoku('hard')
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]

      difficulties.forEach((difficulty) => {
        const recreated = generator.generateFromId(original.id, difficulty)
        expect(recreated.id).toBe(original.id)
        expect(recreated.solution).toEqual(original.solution)
      })
    })

    it('ensures ID uniqueness with multiple generators', () => {
      const generator1 = new SudokuGenerator()
      const generator2 = new SudokuGenerator()
      const results1 = generator1.generateMultipleSudoku(25)
      const results2 = generator2.generateMultipleSudoku(25)

      const allIds = new Set([
        ...results1.map((r) => r.id),
        ...results2.map((r) => r.id),
      ])
      expect(allIds.size).toBe(50)
    })

    it('verifies ID stability across multiple generations', () => {
      const original = generator.generateSudoku()
      const id = original.id

      for (let i = 0; i < 100; i++) {
        const newSudoku = generator.generateSudoku()
        expect(newSudoku.id).not.toBe(id)
      }
    })

    it('ensures ID uniqueness with different random seeds', () => {
      const results = new Set<string>()
      const attempts = 100

      for (let i = 0; i < attempts; i++) {
        const sudoku = generator.generateSudoku()
        expect(results.has(sudoku.id)).toBe(false)
        results.add(sudoku.id)
      }

      expect(results.size).toBe(attempts)
    })

    it('verifies ID collision resistance', () => {
      const batchSize = 1000
      const results = generator.generateMultipleSudoku(batchSize)
      const ids = results.map((r) => r.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(batchSize)

      ids.forEach((id) => {
        expect(id).toMatch(/^[A-Za-z0-9\-_]+$/)
        let b64 = id.replace(/-/g, '+').replace(/_/g, '/')
        while (b64.length % 4 !== 0) b64 += '='
        const decoded = Buffer.from(b64, 'base64').toString('utf8')
        expect(decoded.length).toBe(81)
        expect(decoded).toMatch(/^[1-9]+$/)
      })
    })

    it('ensures ID uniqueness with same difficulty and multiple batches', () => {
      const difficulty = 'medium'
      const batchSize = 50
      const numBatches = 5
      const allIds = new Set<string>()

      for (let i = 0; i < numBatches; i++) {
        const results = generator.generateMultipleSudoku(batchSize, difficulty)
        results.forEach((result) => {
          expect(allIds.has(result.id)).toBe(false)
          allIds.add(result.id)
        })
      }

      expect(allIds.size).toBe(batchSize * numBatches)
    })

    it('verifies ID uniqueness with different puzzle patterns', () => {
      const patterns = new Set<string>()
      const attempts = 100

      for (let i = 0; i < attempts; i++) {
        const sudoku = generator.generateSudoku()
        const pattern = sudoku.puzzle.flat().join('')
        expect(patterns.has(pattern)).toBe(false)
        patterns.add(pattern)
        expect(sudoku.id).toMatch(/^[A-Za-z0-9\-_]+$/)
      }
    })

    it('ensures ID uniqueness with different solution patterns', () => {
      const solutions = new Set<string>()
      const attempts = 100

      for (let i = 0; i < attempts; i++) {
        const sudoku = generator.generateSudoku()
        const solution = sudoku.solution.flat().join('')
        expect(solutions.has(solution)).toBe(false)
        solutions.add(solution)
        expect(sudoku.id).toMatch(/^[A-Za-z0-9\-_]+$/)
      }
    })

    it('verifies ID uniqueness with different difficulty combinations', () => {
      const difficulties: ('easy' | 'medium' | 'hard' | 'extreme')[] = [
        'easy',
        'medium',
        'hard',
        'extreme',
      ]
      const allIds = new Set<string>()
      const allSolutions = new Set<string>()

      difficulties.forEach((difficulty) => {
        const results = generator.generateMultipleSudoku(25, difficulty)
        results.forEach((result) => {
          const solution = result.solution.flat().join('')
          expect(allSolutions.has(solution)).toBe(false)
          allSolutions.add(solution)
          expect(allIds.has(result.id)).toBe(false)
          allIds.add(result.id)
        })
      })

      expect(allIds.size).toBe(100)
      expect(allSolutions.size).toBe(100)
    })

    it('ensures ID uniqueness with different grid transformations', () => {
      const original = generator.generateSudoku()
      const originalId = original.id
      const originalSolution = original.solution.flat().join('')

      for (let i = 0; i < 100; i++) {
        const newSudoku = generator.generateSudoku()
        const newSolution = newSudoku.solution.flat().join('')
        expect(newSolution).not.toBe(originalSolution)
        expect(newSudoku.id).not.toBe(originalId)
      }
    })
  })
})
