import Phaser from 'phaser';
import player1Sprite from '../assets/player1.png';

export default class Boot extends Phaser.Scene {
  constructor() {
    super();
    this.done = new Promise(resolve => {
      this.doneLoading = resolve;
    });
  }

  preload() {
    this.load.spritesheet('player1', player1Sprite, { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.doneLoading();
  }
}
