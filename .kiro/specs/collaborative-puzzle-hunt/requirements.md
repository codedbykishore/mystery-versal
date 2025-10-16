# Requirements Document

## Introduction

Mystery Versal is a collaborative puzzle hunt game built as a Devvit Web app that displays a 3x3 jigsaw puzzle grid where users solve cross-community puzzles to unlock pieces and reveal a final image. The game features global progress sharing across all users, meaning when one user solves a puzzle, it's marked as solved for everyone. The game uses a three-tier unlock system with scrambled grid positions to create discovery and exploration elements.

## Requirements

### Requirement 1: 3x3 Grid Display with Scrambled Positions

**User Story:** As a player, I want to see a 3x3 grid of puzzle tiles representing different subreddits, so that I can understand the overall puzzle structure and see my progress.

#### Acceptance Criteria

1. WHEN the game loads THEN the system SHALL display a 3x3 grid with 9 puzzle tiles
2. WHEN displaying tiles THEN each tile SHALL represent a different subreddit (r/Math, r/History, r/Codes, r/Science, r/Geography, r/Linguistics, r/Chemistry, r/Biology, r/Art)
3. WHEN arranging tiles THEN the puzzle solve order (1→2→3→4→5→6→7→8→9) SHALL be different from grid display positions
4. WHEN displaying tiles THEN grid positions SHALL be scrambled so users cannot predict the linear order
5. WHEN a tile is locked THEN it SHALL display with grey/faded appearance and lock icon
6. WHEN a tile is unlocked but unsolved THEN it SHALL be clickable with visual indication
7. WHEN a tile is solved THEN it SHALL show colored appearance with the image piece and checkmark

### Requirement 2: Three-Tier Unlock System

**User Story:** As a player, I want puzzles to unlock in sets as I progress, so that I have a structured progression through the game.

#### Acceptance Criteria

1. WHEN the game starts THEN puzzles 1, 2, and 3 SHALL be unlocked (first set) in scrambled grid positions
2. WHEN puzzles 1, 2, and 3 are all solved THEN puzzles 4, 5, and 6 SHALL unlock (second set)
3. WHEN puzzles 4, 5, and 6 are all solved THEN puzzles 7, 8, and 9 SHALL unlock (third set)
4. WHEN a set is not yet unlocked THEN those tiles SHALL display as locked regardless of grid position
5. WHEN a new set unlocks THEN the system SHALL show unlock animation for the newly available tiles
6. WHEN users complete each set THEN they SHALL be required to finish the current set before the next set unlocks

### Requirement 3: Full Page Puzzle Interaction

**User Story:** As a player, I want to interact with puzzles on a dedicated full page, so that I have a focused experience for solving each puzzle.

#### Acceptance Criteria

1. WHEN I click an unlocked tile THEN the system SHALL navigate to a full page view for that puzzle
2. WHEN on the puzzle page THEN it SHALL display the subreddit name as a large header
3. WHEN on the puzzle page THEN it SHALL provide a "Go to r/[Subreddit] Post" button that opens the Reddit link in a new tab
4. WHEN on the puzzle page THEN it SHALL display a large text input field for the answer
5. WHEN on the puzzle page THEN it SHALL provide a submit button for answer validation
6. WHEN on the puzzle page THEN it SHALL provide a back button to return to the grid
7. WHEN I submit a correct answer THEN the system SHALL show success message "✅ CORRECT!!!!!"
8. WHEN I solve a puzzle THEN the system SHALL display the hint text for the next puzzle
9. WHEN I complete a puzzle THEN the system SHALL return me to the grid view
10. WHEN all tiles in the current set are solved THEN the system SHALL unlock the next set with animation

### Requirement 4: Global Progress System

**User Story:** As a player, I want to see progress that is shared across all users, so that I can contribute to a collaborative effort and see the community's achievements.

#### Acceptance Criteria

1. WHEN any user solves a puzzle THEN it SHALL be marked as solved for all users globally
2. WHEN a new user joins THEN they SHALL see already-solved puzzles marked as complete
3. WHEN a new user joins THEN they SHALL see currently active puzzles as available to solve
4. WHEN a new user joins THEN they SHALL see locked puzzles as not yet unlocked
5. WHEN viewing solved puzzles THEN users SHALL be able to view them but not need to re-solve them
6. WHEN users want practice THEN they SHALL be able to choose to re-solve already-solved puzzles
7. WHEN puzzle state changes THEN the system SHALL store the global state in Redis
8. WHEN multiple users are playing THEN progress updates SHALL be reflected for all users

### Requirement 5: Linear Hint System

**User Story:** As a player, I want to receive hints that guide me to the next logical puzzle, so that I can progress through the game systematically.

#### Acceptance Criteria

1. WHEN I solve puzzle 1 THEN the system SHALL provide a hint for puzzle 2
2. WHEN I solve puzzle 2 THEN the system SHALL provide a hint for puzzle 3
3. WHEN I solve any puzzle N THEN the system SHALL provide a hint for puzzle N+1
4. WHEN displaying hints THEN they SHALL flow linearly based on puzzle order (not grid position)
5. WHEN the hint system operates THEN the puzzle order SHALL be fixed and logical but hidden from users due to scrambled grid
6. WHEN displaying hints THEN they SHALL clearly indicate which subreddit the hint is for

### Requirement 6: Server-Side Answer Validation

**User Story:** As a player, I want my answers to be validated securely and accurately, so that the game maintains integrity and fairness.

#### Acceptance Criteria

1. WHEN the system stores puzzles THEN it SHALL maintain a data structure with 9 puzzles and their answers
2. WHEN in development phase THEN the system SHALL use simple test answers (1, 2, 3, 4, 5, 6, 7, 8, 9)
3. WHEN validating user input THEN the system SHALL check answers case-insensitively and trim whitespace
4. WHEN an answer is correct THEN the system SHALL mark the puzzle as globally solved
5. WHEN validation completes THEN the system SHALL return success status, hint text, next subreddit, and set completion status
6. WHEN validation occurs THEN it SHALL happen on the server side for security### Re
quirement 7: Jigsaw Puzzle Visual Completion

**User Story:** As a player, I want to see puzzle pieces come together to form a complete image, so that I have a satisfying visual representation of progress and completion.

#### Acceptance Criteria

1. WHEN displaying tiles THEN each of the 9 tiles SHALL contain 1/9th of a final image
2. WHEN arranging image pieces THEN they SHALL correspond to grid positions (not puzzle solve order)
3. WHEN a tile is locked THEN it SHALL show a grey placeholder with lock icon
4. WHEN a tile is unlocked but unsolved THEN it SHALL show a faded version of the image piece
5. WHEN a tile is solved THEN it SHALL show the full-color image piece
6. WHEN all 9 puzzles are solved THEN the complete image SHALL form showing the text "KNOWLEDGE IS POWER, SCATTERED ACROSS MANY MINDS, UNITED IN PURPOSE"
7. WHEN the puzzle is completed THEN the system SHALL add a golden glow effect around the completed puzzle

### Requirement 8: Premium User Interface Design

**User Story:** As a player, I want a polished and premium-looking interface, so that I have an engaging and professional gaming experience.

#### Acceptance Criteria

1. WHEN the game loads THEN it SHALL display a clean, minimal design with proper spacing and typography
2. WHEN interacting with elements THEN all buttons and tiles SHALL have smooth hover and click animations
3. WHEN viewing the interface THEN it SHALL use a cohesive color palette with proper contrast ratios
4. WHEN using the game THEN all animations SHALL use proper easing curves (no linear animations)
5. WHEN transitioning between pages THEN the system SHALL provide smooth page transitions
6. WHEN elements load THEN they SHALL use elegant loading states instead of harsh spinners
7. WHEN displaying success states THEN they SHALL include celebratory animations with proper timing
8. WHEN the interface renders THEN it SHALL be fully responsive and mobile-optimized

### Requirement 9: Mobile Responsiveness and Accessibility

**User Story:** As a mobile user, I want the game to work perfectly on my device with proper touch interactions, so that I can play comfortably regardless of my device.

#### Acceptance Criteria

1. WHEN using mobile devices THEN all interactive elements SHALL have minimum 44x44px touch targets
2. WHEN navigating with keyboard THEN users SHALL be able to tab through all interactive elements
3. WHEN using screen readers THEN all icons and buttons SHALL have proper ARIA labels
4. WHEN viewing on different screen sizes THEN the layout SHALL adapt responsively
5. WHEN using touch devices THEN all interactions SHALL feel natural and responsive
6. WHEN the game loads on mobile THEN it SHALL work properly within Reddit's mobile web view
7. WHEN displaying content THEN text sizes SHALL be readable on mobile devices

### Requirement 10: Performance and Technical Requirements

**User Story:** As a player, I want the game to load quickly and run smoothly, so that I have an uninterrupted gaming experience.

#### Acceptance Criteria

1. WHEN the game loads THEN it SHALL complete loading in under 3 seconds
2. WHEN bundling the application THEN the bundle size SHALL be less than 500KB
3. WHEN storing global state THEN it SHALL use Redis reliably without data loss
4. WHEN running on Devvit platform THEN it SHALL work properly inside Reddit posts
5. WHEN multiple users play simultaneously THEN the system SHALL handle concurrent access without conflicts
6. WHEN the game operates THEN it SHALL maintain smooth 60fps animations
7. WHEN users interact THEN response times SHALL be under 200ms for local interactions