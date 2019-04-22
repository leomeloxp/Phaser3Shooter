// Import Phaser package
import Phaser from "phaser";
import { GlobalSettings } from "./GlobalSettings";
import { StageOne } from "./StageOne";

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
    // Add first Scene and start it.
    const stageOne = new StageOne("StageOne");
    this.scene.add("StageOne", stageOne);
    this.scene.start("StageOne");

    // Handle the completion of the first Scene.
    stageOne.done
      .then(() => {
        // TODO add actual StageTwo instead of reclycing StageOne.
        this.scene.add("StageTwo", new StageOne("StageTwo"));
        this.scene.switch("StageOne", "StageTwo");
      })
      .catch(() => {
        // TODO add proper game over handling logic;
        const text = stageOne.add.text(GlobalSettings.width / 2, GlobalSettings.height / 2, "Game Over!", {
          align: "center",
          fontSize: 32
        });
        text.setOrigin(0.5);
      });
  }
}

export { ShooterGame };
