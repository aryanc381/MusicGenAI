function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
  }
  
  // 🔊 Sound on buttons
  const clickSound = new Audio("\\static\\mouse_click.wav");
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".apple-button").forEach(btn => {
      btn.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.play();
      });
    });
  });
  
  async function generateMIDI() {
    const melody = document.getElementById("melodyInput").value.trim();
    if (!melody) return alert("Please enter some melody notes.");
  
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ melody })
    });
  
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.getElementById("downloadLink");
      link.href = url;
      document.getElementById("downloadSection").style.display = "block";
  
      const chordsText = response.headers.get("X-Chords");
      if (chordsText) {
        document.getElementById("chordText").innerText = `🎶 Best chords: ${chordsText}`;
      }
    } else {
      alert("Error generating MIDI.");
    }
  }
  