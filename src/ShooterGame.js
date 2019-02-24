// Import Phaser package
import Phaser from "phaser";
import { StageOne } from "./StageOne";

const GlobalSettings = {
  assetsUrl: "https://leomeloxp.github.io/shmup/assets",
  height: 400,
  width: 600
};

/**
 * Base game class used for our Shooter Game.
 * @class ShooterGame
 * @extends {Phaser.Game}
 */
class ShooterGame extends Phaser.Game {
  /**
   * Creates an instance of ShooterGame.
   * @memberof ShooterGame
   */
  constructor() {
    super({
      // Type of render (don't worry about it)
      type: Phaser.AUTO,
      width: GlobalSettings.width,
      height: GlobalSettings.height,
      // Where in the HTML file the game will render
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          debug: true
        }
      }
    });
    // Create a random data generator to be used across the game.
    this.rdg = new Phaser.Math.RandomDataGenerator();
    // Add furst Scene and start it.
    this.scene.add("StageOne", new StageOne());
    this.scene.start("StageOne");
  }
}

export { ShooterGame, GlobalSettings };
