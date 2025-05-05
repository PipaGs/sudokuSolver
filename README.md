# Sudoku Solver

A TypeScript library for solving and generating Sudoku puzzles.

## Installation

1. Make sure you have Node.js installed
2. Clone the repository
3. Install dependencies:
```bash
npm install
```

## Usage

Run the example:
```bash
npm start
```

The program will solve a preset puzzle and show the solution.

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

## Features

Create puzzles with different difficulties:
- Easy
- Medium
- Hard
- Extreme

All puzzles have unique solutions.

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