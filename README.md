# Sudoku Solver

A TypeScript library for solving and generating Sudoku puzzles.

## Installation

```bash
npm install @pipags/sudoku-solver
```

## Usage

```typescript
import { Sudoku, Generator } from '@pipags/sudoku-solver';

// Create a new Sudoku puzzle
const generator = new Generator();
const result = generator.generateSudoku('easy');

// result contains: { id: string, puzzle: number[][], solution: number[][] }
console.log('Puzzle:', result.puzzle);
console.log('Solution:', result.solution);
console.log('ID:', result.id); // ID is in base64url format

// Solve the puzzle
const sudoku = new Sudoku(result.puzzle);
const solution = sudoku.getSolution();
console.log('Solved:', solution);
```

## Features

- Solve any valid Sudoku puzzle
- Generate new puzzles with different difficulty levels:
  - Easy
  - Medium
  - Hard
  - Extreme
- TypeScript support with type definitions
- 100% test coverage
- Generate unique IDs in base64url format for each puzzle

## API

### Sudoku Class

```typescript
class Sudoku {
  constructor(grid: number[][]);
  isValid(row: number, col: number, num: number): boolean;
  solve(): boolean;
  getSolution(): number[][];
}
```

### Generator Class

```typescript
class Generator {
  generateSudoku(difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): { id: string, puzzle: number[][], solution: number[][] };
  generateFromId(id: string, difficulty?: 'easy' | 'medium' | 'hard' | 'extreme'): { id: string, puzzle: number[][], solution: number[][] };
  generateMultipleSudoku(count: number, difficulty?: 'easy' | 'medium' | 'hard' | 'extreme'): { id: string, puzzle: number[][], solution: number[][] }[];
}
```

## Project Structure

- `src/index.ts` - exports library components
- `src/sudoku.ts` - Sudoku solving logic
- `src/generator.ts` - puzzle generator
- `src/examples.ts` - usage examples

## How it Works

Uses backtracking to solve Sudoku puzzles:

1. Find empty cell
2. Try numbers 1-9
3. Check row, column and box
4. Move to next cell if valid
5. Backtrack if stuck

## License

MIT

## Project Structure

- `src/index.ts` - exports library components
- `src/sudoku.ts` - Sudoku solving logic
- `src/generator.ts` - puzzle generator
- `src/examples.ts` - usage examples

## How it Works

Uses backtracking to solve Sudoku puzzles:

1. Find empty cell
2. Try numbers 1-9
3. Check row, column and box
4. Move to next cell if valid
5. Backtrack if stuck
