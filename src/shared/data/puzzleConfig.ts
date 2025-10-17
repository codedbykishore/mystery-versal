import { Puzzle, SetConfig } from '../types';

// Puzzle configuration with scrambled grid positions
export const puzzleConfiguration: Puzzle[] = [
  {
    id: 1,
    subreddit: "r/Math",
    postLink: "https://reddit.com/r/MVMath/post1",
    answer: "1",
    hintText: "Look to the past for wisdom. In r/History, the year that changed everything was 1300.",
    targetSubreddit: "r/History",
    set: 1,
    gridPosition: 5, // Center position
    imagePiece: "piece-1"
  },
  {
    id: 2,
    subreddit: "r/History",
    postLink: "https://reddit.com/r/MVHistory/post2",
    answer: "2",
    hintText: "Crack the cipher in r/Codes. The key number is 13.",
    targetSubreddit: "r/Codes",
    set: 1,
    gridPosition: 1, // Top-left
    imagePiece: "piece-2"
  },
  {
    id: 3,
    subreddit: "r/Codes",
    postLink: "https://reddit.com/r/MVCodes/post3",
    answer: "3",
    hintText: "Elements combine in r/Science. The atomic number you seek is 3.",
    targetSubreddit: "r/Science",
    set: 1,
    gridPosition: 9, // Bottom-right
    imagePiece: "piece-3"
  },
  {
    id: 4,
    subreddit: "r/Science",
    postLink: "https://reddit.com/r/MVScience/post4",
    answer: "4",
    hintText: "Navigate to r/Geography. The continent count is 4.",
    targetSubreddit: "r/Geography",
    set: 2,
    gridPosition: 3, // Top-right
    imagePiece: "piece-4"
  },
  {
    id: 5,
    subreddit: "r/Geography",
    postLink: "https://reddit.com/r/MVGeography/post5",
    answer: "5",
    hintText: "Decode the language in r/Linguistics. The vowel count is 5.",
    targetSubreddit: "r/Linguistics",
    set: 2,
    gridPosition: 7, // Bottom-left
    imagePiece: "piece-5"
  },
  {
    id: 6,
    subreddit: "r/Linguistics",
    postLink: "https://reddit.com/r/MVLinguistics/post6",
    answer: "6",
    hintText: "Mix the formula in r/Chemistry. The carbon count is 6.",
    targetSubreddit: "r/Chemistry",
    set: 2,
    gridPosition: 2, // Top-center
    imagePiece: "piece-6"
  },
  {
    id: 7,
    subreddit: "r/Chemistry",
    postLink: "https://reddit.com/r/MVChemistry/post7",
    answer: "7",
    hintText: "Study life in r/Biology. The pH level is 7.",
    targetSubreddit: "r/Biology",
    set: 3,
    gridPosition: 4, // Middle-left
    imagePiece: "piece-7"
  },
  {
    id: 8,
    subreddit: "r/Biology",
    postLink: "https://reddit.com/r/MVBiology/post8",
    answer: "8",
    hintText: "Create beauty in r/Art. The sides of perfection are 8.",
    targetSubreddit: "r/Art",
    set: 3,
    gridPosition: 6, // Middle-right
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
    gridPosition: 8, // Bottom-center
    imagePiece: "piece-9"
  }
];

// Set configuration for three-tier unlock system
export const setConfiguration: SetConfig = {
  sets: {
    1: {
      puzzles: [1, 2, 3],
      unlockRequirement: [] // Always unlocked at start
    },
    2: {
      puzzles: [4, 5, 6],
      unlockRequirement: [1, 2, 3] // Requires set 1 completion
    },
    3: {
      puzzles: [7, 8, 9],
      unlockRequirement: [4, 5, 6] // Requires set 2 completion
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