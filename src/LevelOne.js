import Phaser from 'phaser';
import Player from './Player';

export default class LevelOne extends Phaser.Scene {
  create() {
    this.add.existing(new Player(this, 100, 100));
  }
}
