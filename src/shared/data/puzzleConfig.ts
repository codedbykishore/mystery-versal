import { Puzzle, SetConfig } from '../types';

// Puzzle configuration with scrambled grid positions
export const puzzleConfiguration: Puzzle[] = [
  {
    id: 1,
    subreddit: "r/Math",
    postLink: "https://reddit.com/r/MVMath/post1",
    answer: "1",
    hintText: "Navigate to r/History. The year you seek is 2.",
    targetSubreddit: "r/History",
    set: 1,
    gridPosition: 1, // Top-left
    imagePiece: "piece-1"
  },
  {
    id: 2,
    subreddit: "r/History",
    postLink: "https://reddit.com/r/MVHistory/post2",
    answer: "2",
    hintText: "Decode in r/Codes. The cipher key is 3.",
    targetSubreddit: "r/Codes",
    set: 1,
    gridPosition: 2, // Top-center
    imagePiece: "piece-2"
  },
  {
    id: 3,
    subreddit: "r/Codes",
    postLink: "https://reddit.com/r/MVCodes/post3",
    answer: "3",
    hintText: "Explore r/Science. The atomic number is 4.",
    targetSubreddit: "r/Science",
    set: 1,
    gridPosition: 3, // Top-right
    imagePiece: "piece-3"
  },
  {
    id: 4,
    subreddit: "r/Science",
    postLink: "https://reddit.com/r/MVScience/post4",
    answer: "4",
    hintText: "Navigate to r/Geography. The continent count is 5.",
    targetSubreddit: "r/Geography",
    set: 2,
    gridPosition: 4, // Middle-left
    imagePiece: "piece-4"
  },
  {
    id: 5,
    subreddit: "r/Geography",
    postLink: "https://reddit.com/r/MVGeography/post5",
    answer: "5",
    hintText: "Mix in r/Chemistry. The carbon count is 6.",
    targetSubreddit: "r/Chemistry",
    set: 2,
    gridPosition: 5, // Center
    imagePiece: "piece-5"
  },
  {
    id: 6,
    subreddit: "r/Chemistry",
    postLink: "https://reddit.com/r/MVChemistry/post6",
    answer: "6",
    hintText: "Study life in r/Biology. The pH level is 7.",
    targetSubreddit: "r/Biology",
    set: 2,
    gridPosition: 6, // Middle-right
    imagePiece: "piece-6"
  },
  {
    id: 7,
    subreddit: "r/Biology",
    postLink: "https://reddit.com/r/MVBiology/post7",
    answer: "7",
    hintText: "Decode language in r/Linguistics. The vowel count is 8.",
    targetSubreddit: "r/Linguistics",
    set: 3,
    gridPosition: 7, // Bottom-left
    imagePiece: "piece-7"
  },
  {
    id: 8,
    subreddit: "r/Linguistics",
    postLink: "https://reddit.com/r/MVLinguistics/post8",
    answer: "8",
    hintText: "Create beauty in r/Art. The final answer is 9.",
    targetSubreddit: "r/Art",
    set: 3,
    gridPosition: 8, // Bottom-center
    imagePiece: "piece-8"
  },
  {
    id: 9,
    subreddit: "r/Art",
    postLink: "https://reddit.com/r/MVArt/post9",
    answer: "9",
    hintText: "Congratulations! You have completed the Mystery Versal puzzle hunt!",
    targetSubreddit: "",
    set: 3,
    gridPosition: 9, // Bottom-right
    imagePiece: "piece-9"
  }
];

// Set configuration for linear progression
export const setConfiguration: SetConfig = {
  sets: {
    1: {
      puzzles: [1, 2, 3], // Top row: 1 -> 2 -> 3
      unlockRequirement: [] // Always unlocked at start
    },
    2: {
      puzzles: [4, 5, 6], // Middle row: 4 -> 5 -> 6
      unlockRequirement: [] // Always unlocked at start
    },
    3: {
      puzzles: [7, 8, 9], // Bottom row: 7 -> 8 -> 9
      unlockRequirement: [] // Always unlocked at start
    }
  }
};

// Grid position to puzzle ID mapping (linear)
export const gridToPuzzleMapping: { [gridPosition: number]: number } = {
  1: 1,  // Top-left: r/Math
  2: 2,  // Top-center: r/History
  3: 3,  // Top-right: r/Codes
  4: 4,  // Middle-left: r/Science
  5: 5,  // Center: r/Geography
  6: 6,  // Middle-right: r/Chemistry
  7: 7,  // Bottom-left: r/Biology
  8: 8,  // Bottom-center: r/Linguistics
  9: 9   // Bottom-right: r/Art
};

// Reverse mapping: puzzle ID to grid position
export const puzzleToGridMapping: { [puzzleId: number]: number } = {
  1: 1,  // r/Math -> Top-left
  2: 2,  // r/History -> Top-center
  3: 3,  // r/Codes -> Top-right
  4: 4,  // r/Science -> Middle-left
  5: 5,  // r/Geography -> Center
  6: 6,  // r/Chemistry -> Middle-right
  7: 7,  // r/Biology -> Bottom-left
  8: 8,  // r/Linguistics -> Bottom-center
  9: 9   // r/Art -> Bottom-right
};