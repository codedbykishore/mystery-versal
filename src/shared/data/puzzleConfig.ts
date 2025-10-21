import { Puzzle, SetConfig } from '../types';

// Puzzle configuration with scrambled grid positions
export const puzzleConfiguration: Puzzle[] = [
  {
    id: 1,
    subreddit: "r/Math",
    postLink: "https://reddit.com/r/MVMath/post1",
    answer: "1",
    hintText: "Navigate to r/Science. The atomic number you seek is 4.",
    targetSubreddit: "r/Science",
    set: 1,
    gridPosition: 5, // Center position
    imagePiece: "piece-1"
  },
  {
    id: 2,
    subreddit: "r/History",
    postLink: "https://reddit.com/r/MVHistory/post2",
    answer: "2",
    hintText: "Navigate to r/Geography. The continent count is 5.",
    targetSubreddit: "r/Geography",
    set: 2,
    gridPosition: 1, // Top-left
    imagePiece: "piece-2"
  },
  {
    id: 3,
    subreddit: "r/Codes",
    postLink: "https://reddit.com/r/MVCodes/post3",
    answer: "3",
    hintText: "Mix the formula in r/Chemistry. The carbon count is 6.",
    targetSubreddit: "r/Chemistry",
    set: 3,
    gridPosition: 9, // Bottom-right
    imagePiece: "piece-3"
  },
  {
    id: 4,
    subreddit: "r/Science",
    postLink: "https://reddit.com/r/MVScience/post4",
    answer: "4",
    hintText: "Study life in r/Biology. The pH level is 7.",
    targetSubreddit: "r/Biology",
    set: 1,
    gridPosition: 3, // Top-right
    imagePiece: "piece-4"
  },
  {
    id: 5,
    subreddit: "r/Geography",
    postLink: "https://reddit.com/r/MVGeography/post5",
    answer: "5",
    hintText: "Decode the language in r/Linguistics. The vowel count is 8.",
    targetSubreddit: "r/Linguistics",
    set: 2,
    gridPosition: 7, // Bottom-left
    imagePiece: "piece-5"
  },
  {
    id: 6,
    subreddit: "r/Chemistry",
    postLink: "https://reddit.com/r/MVChemistry/post6",
    answer: "6",
    hintText: "Create beauty in r/Art. The sides of perfection are 9.",
    targetSubreddit: "r/Art",
    set: 3,
    gridPosition: 2, // Top-center
    imagePiece: "piece-6"
  },
  {
    id: 7,
    subreddit: "r/Biology",
    postLink: "https://reddit.com/r/MVBiology/post7",
    answer: "7",
    hintText: "Congratulations! You have completed path 1 of the Mystery Versal puzzle hunt!",
    targetSubreddit: "",
    set: 1,
    gridPosition: 4, // Middle-left
    imagePiece: "piece-7"
  },
  {
    id: 8,
    subreddit: "r/Linguistics",
    postLink: "https://reddit.com/r/MVLinguistics/post8",
    answer: "8",
    hintText: "Congratulations! You have completed path 2 of the Mystery Versal puzzle hunt!",
    targetSubreddit: "",
    set: 2,
    gridPosition: 6, // Middle-right
    imagePiece: "piece-8"
  },
  {
    id: 9,
    subreddit: "r/Art",
    postLink: "https://reddit.com/r/MVArt/post9",
    answer: "9",
    hintText: "Congratulations! You have completed path 3 of the Mystery Versal puzzle hunt!",
    targetSubreddit: "",
    set: 3,
    gridPosition: 8, // Bottom-center
    imagePiece: "piece-9"
  }
];

// Set configuration for independent unlock system
export const setConfiguration: SetConfig = {
  sets: {
    1: {
      puzzles: [1, 4, 7], // Independent path: 1 -> 4 -> 7
      unlockRequirement: [] // Always unlocked at start
    },
    2: {
      puzzles: [2, 5, 8], // Independent path: 2 -> 5 -> 8
      unlockRequirement: [] // Always unlocked at start
    },
    3: {
      puzzles: [3, 6, 9], // Independent path: 3 -> 6 -> 9
      unlockRequirement: [] // Always unlocked at start
    }
  }
};

// Grid position to puzzle ID mapping (scrambled)
export const gridToPuzzleMapping: { [gridPosition: number]: number } = {
  1: 2,  // Top-left: r/History
  2: 6,  // Top-center: r/Linguistics
  3: 4,  // Top-right: r/Science
  4: 7,  // Middle-left: r/Chemistry
  5: 1,  // Center: r/Math
  6: 8,  // Middle-right: r/Biology
  7: 5,  // Bottom-left: r/Geography
  8: 9,  // Bottom-center: r/Art
  9: 3   // Bottom-right: r/Codes
};

// Reverse mapping: puzzle ID to grid position
export const puzzleToGridMapping: { [puzzleId: number]: number } = {
  1: 5,  // r/Math -> Center
  2: 1,  // r/History -> Top-left
  3: 9,  // r/Codes -> Bottom-right
  4: 3,  // r/Science -> Top-right
  5: 7,  // r/Geography -> Bottom-left
  6: 2,  // r/Linguistics -> Top-center
  7: 4,  // r/Chemistry -> Middle-left
  8: 6,  // r/Biology -> Middle-right
  9: 8   // r/Art -> Bottom-center
};