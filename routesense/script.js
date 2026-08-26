/**
 * RouteSense Infographic Poster Interactive Controller
 * Features:
 *  - Inline live content editing (Cmd+E / Ctrl+E)
 *  - Local draft persistence (Cmd+S / Ctrl+S)
 *  - Image upload for team photo
 *  - Clean 1-Page A4 PDF Print triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'routesense_poster_draft_v1';

  // DOM Elements
  const btnToggleEdit = document.getElementById('btnToggleEdit');
  const editBtnLabel = document.getElementById('editBtnLabel');
  const btnPrint = document.getElementById('btnPrint');
  const btnSaveDraft = document.getElementById('btnSaveDraft');
  const btnReset = document.getElementById('btnReset');
  const posterRoot = document.getElementById('posterRoot');
  const teamPhotoImg = document.getElementById('teamPhotoImg');
  const teamPhotoInput = document.getElementById('teamPhotoInput');
  const teamArtWrap = document.querySelector('.team-art-wrap');

  let isEditMode = false;

  // Restore draft from localStorage if available
  const savedDraft = localStorage.getItem(STORAGE_KEY);
  if (savedDraft) {
    try {
      posterRoot.innerHTML = savedDraft;
      bindDynamicListeners();
    } catch (err) {
      console.error('Failed to load RouteSense draft:', err);
    }
  }

  // Toggle Edit Mode
  function toggleEditMode() {
    isEditMode = !isEditMode;
    posterRoot.setAttribute('contenteditable', isEditMode ? 'true' : 'false');
    
    if (isEditMode) {
      btnToggleEdit.classList.add('active');
      editBtnLabel.textContent = 'Done Editing';
    } else {
      btnToggleEdit.classList.remove('active');
      editBtnLabel.textContent = 'Enable Edit Mode';
      saveDraft();
    }
  }

  // Save Draft to LocalStorage
  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, posterRoot.innerHTML);
    const originalText = btnSaveDraft.querySelector('span').textContent;
    btnSaveDraft.querySelector('span').textContent = 'Saved!';
    setTimeout(() => {
      btnSaveDraft.querySelector('span').textContent = originalText;
    }, 1500);
  }

  // Reset to Default
  function resetDefault() {
    if (confirm('Reset RouteSense poster back to original template?')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }

  // Bind Dynamic Listeners (for custom photo upload)
  function bindDynamicListeners() {
    const currentPhotoWrap = document.querySelector('.team-art-wrap');
    const currentPhotoInput = document.getElementById('teamPhotoInput');
    const currentPhotoImg = document.getElementById('teamPhotoImg');

    if (currentPhotoWrap && currentPhotoInput) {
      currentPhotoWrap.onclick = () => {
        currentPhotoInput.click();
      };

      currentPhotoInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (currentPhotoImg) {
              currentPhotoImg.src = event.target.result;
              saveDraft();
            }
          };
          reader.readAsDataURL(file);
        }
      };
    }
  }

  // Event Listeners
  if (btnToggleEdit) btnToggleEdit.addEventListener('click', toggleEditMode);
  if (btnSaveDraft) btnSaveDraft.addEventListener('click', saveDraft);
  if (btnReset) btnReset.addEventListener('click', resetDefault);
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      if (isEditMode) toggleEditMode();
      window.print();
    });
  }

  bindDynamicListeners();

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      toggleEditMode();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveDraft();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
      // Native browser print will handle it, but make sure edit mode is off
      if (isEditMode) toggleEditMode();
    }
  });
});
