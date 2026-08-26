/**
 * BalikSakay Poster Interactive Editor
 * Allows live in-browser editing, local storage persistence, and quick PDF export.
 */

let isEditMode = false;
const posterRoot = document.getElementById('posterRoot');
const toggleEditBtn = document.getElementById('toggleEditBtn');
const editBtnText = document.getElementById('editBtnText');

const STORAGE_KEY = 'talaride_poster_draft_v2';

// Clear legacy BalikSakay draft so new TalaRide template displays immediately
try {
  localStorage.removeItem('balikSakayPosterDraft_v1');
} catch (e) {}

// Check if a saved draft exists
window.addEventListener('DOMContentLoaded', () => {
  const savedDraft = localStorage.getItem(STORAGE_KEY);
  if (savedDraft) {
    posterRoot.innerHTML = savedDraft;
    showToast('Restored your saved poster draft from memory.');
  }
});

/**
 * Toggle inline content editing on all text elements
 */
function toggleEditMode() {
  isEditMode = !isEditMode;
  document.body.classList.toggle('edit-mode', isEditMode);
  toggleEditBtn.classList.toggle('active', isEditMode);

  const editableSelectors = [
    'h1', 'h2', 'h3', 'p', 'span', '.tagline-bold', 
    '.header-desc', '.group-label', '.group-desc', 
    '.feat-name', '.tech-name', '.pill', '.slogan-main', 
    '.slogan-sub', '.goal-desc', '.relay-step-text', 
    '.step-name', '.step-desc', '.rc-number', '.rc-location',
    '.rc-details span', '.rc-street span', '.ocr-digits',
    '.ocr-sub', '.sp-bold-num', '.sp-bold-num-sm', '.hi-num', '.hi-date',
    '.member-badge-name', '.member-name-label', '.team-meta-tag', '.team-footer-hint',
    '.cit-num', '.cit-text', '.citation-entry'
  ];

  const elements = posterRoot.querySelectorAll(editableSelectors.join(', '));
  
  elements.forEach(el => {
    // Avoid editing interactive badges or svgs directly
    if (!el.querySelector('svg') || el.childNodes.length === 1) {
      el.contentEditable = isEditMode ? 'true' : 'false';
    }
  });

  if (isEditMode) {
    editBtnText.textContent = 'Exit Edit Mode';
    showToast('✏️ Edit Mode ON: Click any text or member avatar to upload photo!');
  } else {
    editBtnText.textContent = 'Enable Edit Mode';
    showToast('Edit Mode OFF. Changes retained in session.');
  }
}

/**
 * Image upload handlers for individual member photos
 */
function triggerMemberUpload(memberIndex) {
  const fileInput = document.getElementById(`memberInput${memberIndex}`);
  if (fileInput) fileInput.click();
}

function handleMemberUpload(event, memberIndex) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById(`memberImg${memberIndex}`);
      const placeholder = img ? img.parentElement.querySelector('.placeholder-silhouette-svg') : null;
      if (img) {
        img.src = e.target.result;
        img.style.display = 'block';
      }
      if (placeholder) {
        placeholder.style.display = 'none';
      }
      showToast(`📸 Member ${memberIndex} photo updated! Click "Save Draft" to keep it.`);
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Save current modified poster DOM to localStorage
 */
function saveToLocalStorage() {
  if (isEditMode) {
    toggleEditMode();
  }
  localStorage.setItem(STORAGE_KEY, posterRoot.innerHTML);
  showToast('💾 Poster changes saved to your browser local draft!');
}

/**
 * Reset poster back to original code
 */
function resetDefaults() {
  if (confirm('Are you sure you want to reset all edits back to original template?')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('balikSakayPosterDraft_v1');
    localStorage.removeItem('balikSakayPosterDraft');
    window.location.reload();
  }
}

/**
 * Lightweight Toast Notification
 */
function showToast(message) {
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-msg no-print';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Keyboard shortcuts (Cmd/Ctrl + E to toggle edit, Cmd/Ctrl + S to save)
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
    e.preventDefault();
    toggleEditMode();
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveToLocalStorage();
  }
});
