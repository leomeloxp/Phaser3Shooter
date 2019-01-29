import Phaser from 'phaser';
import Boot from './Boot';
import LevelOne from './LevelOne';

export default class TopDownShooter extends Phaser.Game {
  constructor() {
    // Passes up configuration details to Phaser.Game's constructor
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game'
    });

    this.setupScenes();
  }

  setupScenes() {
    // Create Scene Instances
    const bootScene = new Boot();
    const mainScene = new LevelOne();
    // Add scenes to SceneManager
    this.scene.add('Boot', bootScene);
    this.scene.add('Main', mainScene);

    // Add scene completion methods
    bootScene.done.then(() => {
      this.scene.start('Main');
    });

    // Start the first scene
    this.scene.start('Boot');
  }
}
