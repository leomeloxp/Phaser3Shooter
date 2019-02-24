// Import Phaser package
import Phaser from "phaser";
import { StageOne } from "./StageOne";

const GlobalSettings = {
  assetsUrl: "https://leomeloxp.github.io/shmup/assets",
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
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          debug: true
        }
      }
    });

    this.scene.add("StageOne", new StageOne());
    this.scene.start("StageOne");
  }
}

export { ShooterGame, GlobalSettings };
