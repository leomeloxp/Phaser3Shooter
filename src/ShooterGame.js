// Import Phaser package
import Phaser from 'phaser';
import { Boot } from './Boot';

const GlobalSettings = {
  height: 400,
  width: 600
};

// Create base game class
class ShooterGame extends Phaser.Game {
  constructor() {
    super({
      // Type of render (don't worry about it)
      type: Phaser.AUTO,
      width: GlobalSettings.width,
      height: GlobalSettings.height,
      // Where in the HTML file the game will render
      parent: 'game',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
      }
    });

    this.scene.add('Boot', new Boot());
    this.scene.start('Boot');
  }
}

export { ShooterGame, GlobalSettings };
