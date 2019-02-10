// Import Phaser package
import Phaser from 'phaser';
import { GlobalSettings } from './ShooterGame';

class Boot extends Phaser.Scene {
  preload() {
    this.load.crossOrigin = 'anonymous';

    this.load.image('sea', 'https://leomeloxp.github.io/shmup/assets/sea.png');

    this.load.spritesheet('player1', 'https://leomeloxp.github.io/shmup/assets/player1.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    // Add Background

    // Set up physics
    this.physics.world.setBounds(0, 0, GlobalSettings.width, GlobalSettings.height);

    this.bg = this.add.tileSprite(0, 0, 1200, 800, 'sea');
    // Add Player
    this.player = this.physics.add.sprite(300, 350, 'player1', 0);

    this.player.setCollideWorldBounds(true);

    // Enable keyboard input for this scene
    this.keys = this.input.keyboard.createCursorKeys();
    this.customKeys = {};
    this.customKeys.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.customKeys.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.customKeys.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.customKeys.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  // Is called 60 times per second
  update() {
    // Add motion to bg tiles
    this.bg.tilePositionY -= 0.2;

    // Handle moving right
    if (this.keys.right.isDown || this.customKeys.keyD.isDown) {
      this.player.x += 10;
    }
    // Handle moving left
    if (this.keys.left.isDown || this.customKeys.keyA.isDown) {
      this.player.x -= 10;
    }

    // Add up and down keys as well as WASD
    if (this.keys.up.isDown || this.customKeys.keyW.isDown) {
      this.player.y -= 10;
    }
    if (this.keys.down.isDown || this.customKeys.keyS.isDown) {
      this.player.y += 10;
    }
  }
}

export { Boot };
