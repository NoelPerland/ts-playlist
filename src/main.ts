// DOM-element
const form = document.querySelector("#track-form") as HTMLFormElement;
const titleInput = document.querySelector("#title") as HTMLInputElement;
const artistInput = document.querySelector("#artist") as HTMLInputElement;
const durationInput = document.querySelector("#duration") as HTMLInputElement;
const list = document.querySelector("#list") as HTMLUListElement;
const totalEl = document.querySelector("#total") as HTMLSpanElement;

// Kontrollera att element finns
if (
  !form ||
  !titleInput ||
  !artistInput ||
  !durationInput ||
  !list ||
  !totalEl
) {
  throw new Error("Kunde inte hitta alla DOM-element");
}

// Typdefinition och data
type Track = {
  title: string;
  artist: string;
  duration: number;
};

let tracks: Track[] = [];

// Hjälpfunktioner
const parseDuration = (str: string): number | null => {
  const match = str.match(/^(\d+):([0-5]?\d)$/);
  return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : null;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Formulärhantering
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const artist = artistInput.value.trim();
  const duration = parseDuration(durationInput.value.trim());

  // Validering
  if (!title) return alert("Ange en titel för låten");
  if (!artist) return alert("Ange en artist");
  if (!duration) return alert("Ange en giltig längd i formatet mm:ss");

  // Lägg till låt
  tracks.push({ title, artist, duration });

  // Rensa formulär och rendera
  form.reset();
  titleInput.focus();
  render();
});

// Rendering
function render(): void {
  const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
  totalEl.textContent = formatDuration(totalSeconds);

  list.innerHTML = tracks
    .map(
      (track, index) => `
    <li class="track-item">
      <div class="track-info">
        <p><strong>Titel:</strong> ${track.title}</p>
        <p><strong>Artist:</strong> ${track.artist}</p>
        <p><strong>Längd:</strong> ${formatDuration(track.duration)}</p>
      </div>
      <button class="delete-btn" data-index="${index}">Ta bort</button>
    </li>
  `
    )
    .join("");

  // Lägg till event-lyssnare för delete-knappar
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(
        (e.target as HTMLButtonElement).dataset.index || "0"
      );
      tracks.splice(index, 1);
      render();
    });
  });
}

// Starta appen
render();
