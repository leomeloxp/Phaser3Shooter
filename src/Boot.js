// Import Phaser package
import Phaser from 'phaser';
import { Player } from './Player';
import { GlobalSettings } from './ShooterGame';
class Boot extends Phaser.Scene {
  preload() {
    this.load.crossOrigin = 'anonymous';

    this.load.image('sea', `${GlobalSettings.assetsUrl}/sea.png`);

    this.load.spritesheet('player1', `${GlobalSettings.assetsUrl}/player1.png`, {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // Set up physics basics
    this.physics.world.setBounds(0, 0, GlobalSettings.width, GlobalSettings.height);

    // Add Background
    this.bg = this.add.tileSprite(0, 0, 1200, 800, 'sea');

    // Add Player
    this.player = new Player(this);

    // Enable keyboard input for the player
    // Enable arrow, shift and space keys
    this.keys = this.input.keyboard.createCursorKeys();
    // Enable custom keys (WASD, etc)
    this.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  // Is called 60 times per second
  update() {
    // If the player object exists and is active, let it update itself
    if (this.player && this.player.active) {
      this.player.update();
    }

    // Add motion to bg tiles
    this.bg.tilePositionY -= 0.2;
  }
}

export { Boot };
