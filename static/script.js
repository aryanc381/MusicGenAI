// Changing Words Animation (only run if changing-word element exists)
const wordElement = document.getElementById('changing-word');
if (wordElement) {
  const words = ["everyone.", "artists.", "visionaries.", "explorers.", "musicians.", "dreamers."];
  let wordIndex = 0;

  wordElement.style.transition = 'opacity 0.5s ease';

  setInterval(() => {
    wordElement.style.opacity = 0; // Fade out
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      wordElement.textContent = words[wordIndex];
      wordElement.style.opacity = 1; // Fade in
    }, 150);
  }, 2000);
}

// Theme Toggle Script
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load previous mode
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }
});

const musicElement = document.getElementById('changing-music');
if (musicElement) {
  const music = ["Art", "Emotion", "Inspiration", "Euphoria", "Rhythm", "Stories"];
  let wordIndex = 0;

  musicElement.style.transition = 'opacity 0.5s ease';

  setInterval(() => {
    musicElement.style.opacity = 0; // Fade out
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % music.length; // Corrted here
      musicElement.textContent = music[wordIndex];
      musicElement.style.opacity = 1; // Fade in
    }, 150);
  }, 2000);
}

// 🎶 Floating Music Notes Animation
const canvas = document.getElementById('musicCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Define note emojis and array
  const notes = [];
  const emojiList = ['🎵' , '🎶','🎧','🎤', '🎸' ,'🎹' ,'🥁'];

  // Create a new note
  function createNote() {
    const note = {
      x: Math.random() * canvas.width,
      y: 0,
      speed: 1 + Math.random() * 2,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      size: 20 + Math.random() * 10,
      angle: Math.random() * Math.PI * 2
    };
    notes.push(note);
  }

  // Update note positions
  function updateNotes() {
    for (let note of notes) {
      note.y += note.speed;
      note.x += Math.sin(note.angle) * 0.5; // wave movement
    }
    // Remove notes that fall off screen
    for (let i = notes.length - 1; i >= 0; i--) {
      if (notes[i].y > canvas.height) notes.splice(i, 1);
    }
  }

  // Draw all notes
  function drawNotes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let note of notes) {
      ctx.font = `${note.size}px Arial`;
      ctx.fillText(note.emoji, note.x, note.y);
    }
  }

  // Animate everything
  function animate() {
    updateNotes();
    drawNotes();
    requestAnimationFrame(animate);
  }

  // Create new notes every 300ms
  setInterval(createNote, 300);
  animate();
}




