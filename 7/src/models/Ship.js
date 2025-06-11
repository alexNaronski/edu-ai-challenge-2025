/**
 * Class representing a ship in the game
 */
export class Ship {
  /**
   * Create a ship
   * @param {number} length - Length of the ship
   * @param {string[]} locations - Array of coordinates where the ship is placed
   */
  constructor(length, locations = []) {
    this.length = length;
    this.locations = locations;
    this.hits = new Array(length).fill('');
  }

  /**
   * Check if the ship is sunk
   * @returns {boolean} True if all parts of the ship are hit
   */
  isSunk() {
    return this.hits.every(hit => hit === 'hit');
  }

  /**
   * Process a hit on the ship
   * @param {string} location - The coordinate that was hit
   * @returns {boolean} True if the ship was hit, false otherwise
   */
  processHit(location) {
    const index = this.locations.indexOf(location);
    if (index !== -1 && !this.hits[index]) {
      this.hits[index] = 'hit';
      return true;
    }
    return false;
  }

  /**
   * Check if a location is part of this ship
   * @param {string} location - The coordinate to check
   * @returns {boolean} True if the location is part of this ship
   */
  hasLocation(location) {
    return this.locations.includes(location);
  }
} 