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
          debug: false
        }
      }
    });
    // Create a random data generator to be used across the game.
    this.rdg = new Phaser.Math.RandomDataGenerator();
    // Add first Scene and start it.
    this.stageOne = new StageOne("StageOne");
    this.scene.add("StageOne", this.stageOne);
    this.scene.start("StageOne");

    // Handle the completion of the first Scene.
    this.stageOne.done
      .then(() => {
        // TODO add actual StageTwo instead of reclycing StageOne.
        this.showEndGameMessage("YOU WIN!");
      })
      .catch(() => {
        this.showEndGameMessage("Game Over!");
      });
  }

  showEndGameMessage(message = "Game Over!") {
    const mainMessage = this.stageOne.add.text(GlobalSettings.width / 2, GlobalSettings.height / 2 - 30, message, {
      align: "center",
      fontSize: 32
    });
    mainMessage.setOrigin(0.5);
    const finalScore = this.stageOne.add.text(
      GlobalSettings.width / 2,
      GlobalSettings.height / 2,
      `Your final score was ${this.stageOne.player.score}.`,
      {
        align: "center",
        fontSize: 16
      }
    );
    finalScore.setOrigin(0.5);

    const restartMessage = this.stageOne.add.text(
      GlobalSettings.width / 2,
      GlobalSettings.height / 2 + 20,
      `Reload the page to play again.`,
      {
        align: "center",
        fontSize: 16
      }
    );
    restartMessage.setOrigin(0.5);
  }
}

export { ShooterGame };
