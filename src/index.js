import TopDownShooter from './Game';

// Destroy previous instances of the game before we can create a new one
document.querySelector('#game').innerHTML = '';
// Create new instance of our game
new TopDownShooter();
