import Phaser from "phaser";
import { GlobalSettings } from "./ShooterGame";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    // Creates the Sprite instance for our Player object
    super(scene, GlobalSettings.width / 2, GlobalSettings.height - 50, "player1", 0);

    // Add player to passed in scene as Sprite
    scene.add.existing(this);
    // Add player to passed in scene as Physics object
    scene.physics.add.existing(this);
    // Set player to collide with world boundaries
    this.setCollideWorldBounds(true);

    // Create array that will hold bullets
    this.bullets = this.scene.add.group({ maxSize: 100 });
    this.shotDelayTime = 100;
    this.shotDeltaTime = 0;
  }

  update(_, delta) {
    this.setVelocity(0);
    this.shotDeltaTime += delta;
    // Handle moving right
    if (this.scene.keys.right.isDown || this.scene.keys.D.isDown) {
      this.body.velocity.x += 300;
    }
    // Handle moving left
    if (this.scene.keys.left.isDown || this.scene.keys.A.isDown) {
      this.body.velocity.x -= 300;
    }

    // Add up and down keys as well as WASD
    if (this.scene.keys.up.isDown || this.scene.keys.W.isDown) {
      this.body.velocity.y -= 300;
    }
    if (this.scene.keys.down.isDown || this.scene.keys.S.isDown) {
      this.body.velocity.y += 300;
    }
    // Mouse movement
    if (this.scene.input.activePointer.isDown) {
      // Check if player is more than 5 units away from the mouse click location to determine if it should move
      const playerPos = new Phaser.Math.Vector2(this.x, this.y);
      const pointerPos = new Phaser.Math.Vector2(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
      if (playerPos.distance(pointerPos) > 5) {
        this.scene.physics.moveTo(this, this.scene.input.activePointer.x, this.scene.input.activePointer.y, 300);
      }
    }

    // Bullet firing trigger logic
    if (this.scene.input.activePointer.isDown || this.scene.keys.space.isDown) {
      if (this.shotDeltaTime > this.shotDelayTime) {
        this.shotDeltaTime = 0;
        this.fireBullet();
      }
    }
    this.checkBulletsPosition();
  }

  fireBullet() {
    const bullet = this.scene.physics.add.image(this.x, this.y, "bullet");
    bullet.setVelocity(0, -500);
    this.bullets.add(bullet);
  }

  checkBulletsPosition() {
    this.bullets.getChildren().forEach(bullet => {
      if (bullet.y < 0) {
        bullet.destroy();
      }
    });
  }
  }
}
