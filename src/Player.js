import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);

    this.setTexture('player1');
  }
}
