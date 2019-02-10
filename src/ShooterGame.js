// Import Phaser package
import Phaser from 'phaser';
import { Boot } from './Boot';
// Create base game class
class ShooterGame extends Phaser.Game {
  constructor() {
    super({
      // Type of render (don't worry about it)
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      // Where in the HTML file the game will render
      parent: 'game'
    });

    this.scene.add('Boot', new Boot());
    this.scene.start('Boot');
  }
}

export { ShooterGame };
