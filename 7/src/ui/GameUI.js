import readline from 'readline';

/**
 * Class representing the game's user interface
 */
export class GameUI {
  /**
   * Create a game UI
   */
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Display the game boards
   * @param {string[][]} opponentBoard - The opponent's board state
   * @param {string[][]} playerBoard - The player's board state
   */
  displayBoards(opponentBoard, playerBoard) {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    const header = '  ' + Array(opponentBoard.length).fill().map((_, i) => i).join(' ');
    console.log(header + '     ' + header);

    for (let i = 0; i < opponentBoard.length; i++) {
      let rowStr = i + ' ';
      
      // Opponent's board
      for (let j = 0; j < opponentBoard[i].length; j++) {
        rowStr += opponentBoard[i][j] + ' ';
      }
      
      rowStr += '    ' + i + ' ';
      
      // Player's board
      for (let j = 0; j < playerBoard[i].length; j++) {
        rowStr += playerBoard[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    console.log('\n');
  }

  /**
   * Display a message to the player
   * @param {string} message - The message to display
   */
  displayMessage(message) {
    console.log(message);
  }

  /**
   * Get a guess from the player
   * @returns {Promise<string>} The player's guess
   */
  async getPlayerGuess() {
    return new Promise((resolve) => {
      this.rl.question('Enter your guess (e.g., 00): ', (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }
} 