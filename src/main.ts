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

// Array skapas för låtar
let tracks: Track[] = [];

// Håller koll på vilken låt som redigeras
let editingIndex: number | null = null;

// Hjälpfunktioner
//formatDuration: Konverterar 225 sekunder → "3:45"
//parseDuration: Konverterar "3:45" → 225 sekunder
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

  // Om vi redigerar en befintlig låt
  if (editingIndex !== null) {
    tracks[editingIndex] = { title, artist, duration };
    editingIndex = null;

    // Ändra knapptext tillbaka
    const submitBtn = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitBtn) submitBtn.textContent = "Lägg till";
  } else {
    // Lägg till ny låt
    tracks.push({ title, artist, duration });
  }

  // Rensa formulär och rendera
  form.reset();
  titleInput.focus();
  render();
});

// Funktion för att starta redigering
function editTrack(index: number): void {
  const track = tracks[index];

  // Fyll i formuläret med nuvarande värden
  titleInput.value = track.title;
  artistInput.value = track.artist;
  durationInput.value = formatDuration(track.duration);

  // Markera att vi redigerar
  editingIndex = index;

  // Ändra knapptext
  const submitBtn = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (submitBtn) submitBtn.textContent = "Uppdatera";

  // Fokusera på första fältet
  titleInput.focus();
}

// Funktion för att avbryta redigering
function cancelEdit(): void {
  editingIndex = null;
  form.reset();

  // Ändra knapptext tillbaka
  const submitBtn = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (submitBtn) submitBtn.textContent = "Lägg till";

  titleInput.focus();
}

// Rendering
function render(): void {
  const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
  totalEl.textContent = formatDuration(totalSeconds);

  list.innerHTML = tracks
    .map(
      (track, index) => `
    <li class="track-item" ${
      editingIndex === index
        ? 'style="background-color: #f0f8ff; border: 2px solid #007acc;"'
        : ""
    }>
      <div class="track-info">
        <p><strong>Titel:</strong> ${track.title}</p>
        <p><strong>Artist:</strong> ${track.artist}</p>
        <p><strong>Längd:</strong> ${formatDuration(track.duration)}</p>
      </div>
      <div class="track-buttons">
        <button class="edit-btn" data-index="${index}">Ändra</button>
        <button class="delete-btn" data-index="${index}">Ta bort</button>
      </div>
    </li>
  `
    )
    .join("");

  // Event-lyssnare för ändra-knappar
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(
        (e.target as HTMLButtonElement).dataset.index || "0"
      );
      editTrack(index);
    });
  });

  // Event-lyssnare för delete-knappar
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(
        (e.target as HTMLButtonElement).dataset.index || "0"
      );

      // Om vi håller på att redigera låten som ska raderas
      if (editingIndex === index) {
        cancelEdit();
      } else if (editingIndex !== null && editingIndex > index) {
        // Justera editingIndex om vi raderar en låt före den som redigeras
        editingIndex--;
      }

      tracks.splice(index, 1);
      render();
    });
  });

  // Lägg till en "Avbryt"-knapp om vi redigerar
  if (editingIndex !== null) {
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Avbryt redigering";
    cancelBtn.type = "button";
    cancelBtn.style.marginLeft = "10px";
    cancelBtn.addEventListener("click", cancelEdit);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
    }
  }
}

// Starta appen
render();
