function generateCrosswordGrid(crosswordData) {
  // Find the longest word
  let gridSize = crosswordData.reduce(
    (max, item) => Math.max(max, item.answer.length),
    0
  );

  // Create an empty grid
  let grid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(" "));

  // Populate the grid with words
  crosswordData.forEach((item, index) => {
    let word = item.answer;
    for (let i = 0; i < word.length; i++) {
      grid[index][i] = word[i];
    }
  });

  // Print the grid
  grid.forEach((row) => {
    console.log(row.join(" "));
  });
}

let crosswordData = [
  { hint: "First word", answer: "hello" },
  { hint: "Second word", answer: "world" },
  { hint: "Third word", answer: "javascript" },
];

generateCrosswordGrid(crosswordData);
