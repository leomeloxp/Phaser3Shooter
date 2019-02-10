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
    this.player.setVelocity(0);
    // Add motion to bg tiles
    this.bg.tilePositionY -= 0.2;

    // Handle moving right
    if (this.keys.right.isDown || this.keys.D.isDown) {
      this.player.body.velocity.x += 300;
    }
    // Handle moving left
    if (this.keys.left.isDown || this.keys.A.isDown) {
      this.player.body.velocity.x -= 300;
    }

    // Add up and down keys as well as WASD
    if (this.keys.up.isDown || this.keys.W.isDown) {
      this.player.body.velocity.y -= 300;
    }
    if (this.keys.down.isDown || this.keys.S.isDown) {
      this.player.body.velocity.y += 300;
    }

    if (this.input.activePointer.isDown) {
      // Check if player is more than 5 units away from the mouse click location to determine if it should move
      const playerPos = new Phaser.Math.Vector2(this.player.x, this.player.y);
      const pointerPos = new Phaser.Math.Vector2(this.input.activePointer.x, this.input.activePointer.y);
      if (playerPos.distance(pointerPos) > 5) {
        this.physics.moveTo(this.player, this.input.activePointer.x, this.input.activePointer.y, 300);
      }
    }
  }
}

export { Boot };
