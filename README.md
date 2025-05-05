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
const puzzle = generator.generateSudoku('easy');

// Solve the puzzle
const sudoku = new Sudoku(puzzle);
const solution = sudoku.getSolution();

console.log('Puzzle:', puzzle);
console.log('Solution:', solution);
```

## Features

- Solve any valid Sudoku puzzle
- Generate new puzzles with different difficulty levels:
  - Easy
  - Medium
  - Hard
  - Extreme
  - Minimal
  - Symmetric
- TypeScript support with type definitions
- 100% test coverage

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
  generateSudoku(difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'minimal' | 'symmetric'): number[][];
}
```

## License

MIT

## Project Structure

- `src/index.ts` - exports library components
- `src/sudoku.ts` - Sudoku solving logic
- `src/generator.ts` - puzzle generator
- `src/examples.ts` - usage examples
- `package.json` - project dependencies

## How it Works

Uses backtracking to solve Sudoku puzzles:

1. Find empty cell
2. Try numbers 1-9
3. Check row, column and box
4. Move to next cell if valid
5. Backtrack if stuck

---

# Решатель судоку

Библиотека на TypeScript для решения и генерации судоку.

## Установка

1. Убедитесь, что установлен Node.js
2. Клонируйте репозиторий
3. Установите зависимости:
```bash
npm install
```

## Использование

Запуск примера:
```bash
npm start
```

Программа решит предустановленное судоку и покажет решение.

## Структура проекта

- `src/index.ts` - экспорт компонентов библиотеки
- `src/sudoku.ts` - логика решения судоку
- `src/generator.ts` - генератор головоломок
- `src/examples.ts` - примеры использования
- `package.json` - зависимости проекта

## Как это работает

Использует алгоритм с возвратом для решения судоку:

1. Находит пустую ячейку
2. Пробует числа 1-9
3. Проверяет строку, столбец и квадрат
4. Переходит к следующей ячейке если подходит
5. Возвращается если зашёл в тупик

## Возможности

Создание головоломок разной сложности:
- Easy (Легкий)
- Medium (Средний)
- Hard (Сложный)
- Extreme (Экстремальный)

Все головоломки имеют единственное решение. 