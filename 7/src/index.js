import { Game } from './Game.js';

const game = new Game();
game.start().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
}); 