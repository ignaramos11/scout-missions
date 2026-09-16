// src/teaser_2d/js/game_logic.js
/**
 * SCOUT - Misión Escape Room Catamarca (Teaser 2D)
 * Controlador SPA y Lógica Central del Juego
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. ESTADO DE LA APLICACIÓN
  // =========================================================================
  const state = {
    currentLevelIndex: 0,
    totalEsquius: 0,
    isLevelCompleted: false,
    soundEnabled: true,
    totalLevels: scoutTeaserData.levels.length
  };

  // =========================================================================
  // 2. REFERENCIAS DEL DOM
  // =========================================================================
  const dom = {
    // Pantallas
    screenIntro: document.getElementById('screen-intro'),
    screenGameplay: document.getElementById('screen-gameplay'),
    screenVictory: document.getElementById('screen-victory'),

    // HUD y Progreso
    hudLevelIndicator: document.getElementById('hud-level-indicator'),
    hudScoreDisplay: document.getElementById('hud-score-display'),
    audioToggleBtn: document.getElementById('audio-toggle-btn'),
    audioIcon: document.getElementById('audio-icon'),
    progressFill: document.getElementById('progress-fill'),
    progressPercent: document.getElementById('progress-percent'),
    stepIndicators: [
      document.getElementById('step-indicator-1'),
      document.getElementById('step-indicator-2'),
      document.getElementById('step-indicator-3')
    ],

    // Intro
    btnStartMission: document.getElementById('btn-start-mission'),
    introStory: document.getElementById('intro-story'),

    // Gameplay
    levelBadge: document.getElementById('level-badge'),
    levelRewardTag: document.getElementById('level-reward-tag'),
    puzzleTitle: document.getElementById('puzzle-title'),
    puzzleImage: document.getElementById('puzzle-image'),
    puzzleImageAlt: document.getElementById('puzzle-image-alt'),
    puzzleHint: document.getElementById('puzzle-hint'),
    puzzleQuestion: document.getElementById('puzzle-question'),
    optionsContainer: document.getElementById('options-container'),
    feedbackCard: document.getElementById('feedback-card'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackDesc: document.getElementById('feedback-desc'),
    feedbackLore: document.getElementById('feedback-lore'),
    btnNextLevel: document.getElementById('btn-next-level'),

    // Victoria y Registro Beta
    victoryTotalEsquius: document.getElementById('victory-total-esquius'),
    betaForm: document.getElementById('beta-registration-form'),
    betaSuccessTicket: document.getElementById('beta-success-ticket'),
    betaAccessCode: document.getElementById('beta-access-code'),
    betaUserEmail: document.getElementById('beta-user-email'),
    btnCopyCode: document.getElementById('btn-copy-code'),
    btnRestartGame: document.getElementById('btn-restart-game')
  };

  // =========================================================================
  // 3. SINTETIZADOR DE AUDIO (Web Audio API - Cero dependencias externas)
  // =========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
  }

  function playTone(frequency, duration, type = 'sine', gainVal = 0.15) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  }

  function soundClick() {
    playTone(580, 0.08, 'triangle', 0.1);
  }

  function soundCorrect() {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.22, 'sine', 0.18), i * 90);
      });
    } catch (e) {}
  }

  function soundError() {
    if (!state.soundEnabled) return;
    playTone(220, 0.25, 'sawtooth', 0.15);
    setTimeout(() => playTone(180, 0.35, 'sawtooth', 0.15), 120);
  }

  function soundVictory() {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      const notes = [
        { f: 523.25, d: 0.2 },
        { f: 659.25, d: 0.2 },
        { f: 783.99, d: 0.2 },
        { f: 1046.5, d: 0.5 }
      ];
      notes.forEach((n, idx) => {
        setTimeout(() => playTone(n.f, n.d, 'triangle', 0.22), idx * 160);
      });
    } catch (e) {}
  }

  // =========================================================================
  // 4. CONTROLADOR DE PANTALLAS (SPA)
  // =========================================================================
  function switchScreen(activeScreen) {
    [dom.screenIntro, dom.screenGameplay, dom.screenVictory].forEach(screen => {
      screen.classList.remove('active');
    });
    activeScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 5. ACTUALIZACIÓN DE INTERFAZ & PROGRESO
  // =========================================================================
  function updateProgress() {
    // Cálculo de porcentaje
    let percentage = 0;
    if (state.currentLevelIndex === 0 && !state.isLevelCompleted) {
      percentage = 10;
    } else {
      const completedSteps = state.currentLevelIndex + (state.isLevelCompleted ? 1 : 0);
      percentage = Math.min(100, Math.round((completedSteps / state.totalLevels) * 100));
    }

    dom.progressFill.style.width = `${percentage}%`;
    dom.progressPercent.textContent = `${percentage}%`;

    // Indicadores numéricos 1, 2, 3
    dom.stepIndicators.forEach((ind, i) => {
      ind.classList.remove('active', 'completed');
      if (i < state.currentLevelIndex || (i === state.currentLevelIndex && state.isLevelCompleted)) {
        ind.classList.add('completed');
      } else if (i === state.currentLevelIndex) {
        ind.classList.add('active');
      }
    });

    // Indicador en el HUD superior
    dom.hudLevelIndicator.textContent = `NIVEL ${state.currentLevelIndex + 1} / ${state.totalLevels}`;
  }

  function animateScore(targetScore) {
    const startScore = state.totalEsquius;
    const duration = 600;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = Math.round(startScore + (targetScore - startScore) * progress);
      dom.hudScoreDisplay.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        dom.hudScoreDisplay.textContent = targetScore;
        state.totalEsquius = targetScore;
      }
    }
    requestAnimationFrame(step);
  }

  // =========================================================================
  // 6. CARGA DE NIVEL Y RESOLUCIÓN DE ACERTIJOS
  // =========================================================================
  function loadLevel(index) {
    state.currentLevelIndex = index;
    state.isLevelCompleted = false;

    const level = scoutTeaserData.levels[index];

    // Datos del Nivel
    dom.levelBadge.textContent = level.badge;
    dom.levelRewardTag.textContent = `+${level.reward} Esquiús`;
    dom.puzzleTitle.textContent = level.name;
    dom.puzzleImage.src = level.image;
    dom.puzzleImage.alt = level.imageAlt;
    dom.puzzleHint.textContent = `Pista Táctica: ${level.hint}`;
    dom.puzzleQuestion.textContent = level.question;

    // Ocultar feedback y botón siguiente
    dom.feedbackCard.className = 'feedback-card';
    dom.btnNextLevel.style.display = 'none';

    // Generar opciones múltiples
    dom.optionsContainer.innerHTML = '';
    const prefixes = ['A', 'B', 'C', 'D'];

    level.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${prefixes[optIdx] || optIdx + 1}</span>
        <span class="opt-text">${optText}</span>
        <span class="opt-status-icon">✓</span>
      `;

      btn.addEventListener('click', () => handleOptionClick(optIdx, btn, level));
      dom.optionsContainer.appendChild(btn);
    });

    updateProgress();
  }

  function handleOptionClick(selectedIndex, clickedBtn, level) {
    if (state.isLevelCompleted) return;

    const allButtons = dom.optionsContainer.querySelectorAll('.option-btn');

    if (selectedIndex === level.correct) {
      // RESPUESTA CORRECTA
      state.isLevelCompleted = true;
      soundCorrect();

      clickedBtn.classList.add('correct');
      clickedBtn.querySelector('.opt-status-icon').textContent = '✓';

      // Deshabilitar el resto de las opciones
      allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
      });

      // Calcular y animar recompensa (+30, +35, +35)
      const newScore = state.totalEsquius + level.reward;
      animateScore(newScore);
      updateProgress();

      // Mostrar Feedback de Éxito
      dom.feedbackCard.className = 'feedback-card success';
      dom.feedbackTitle.innerHTML = `<span>🔓</span> ${level.unlockText}`;
      dom.feedbackDesc.textContent = `Has sincronizado los datos de tu terminal con éxito.`;
      dom.feedbackLore.textContent = level.loreFact;

      // Configurar y mostrar botón de avance
      dom.btnNextLevel.style.display = 'inline-flex';
      const isLastLevel = state.currentLevelIndex >= state.totalLevels - 1;

      if (isLastLevel) {
        dom.btnNextLevel.innerHTML = `<span>🏆</span> Abrir Puerta Principal (Finalizar Misión)`;
      } else {
        dom.btnNextLevel.innerHTML = `<span>Siguiente Enigma</span> ➔`;
      }
    } else {
      // RESPUESTA INCORRECTA
      soundError();
      clickedBtn.classList.add('incorrect');
      clickedBtn.querySelector('.opt-status-icon').textContent = '✕';

      // Mostrar Feedback de Error con orientación constructiva
      dom.feedbackCard.className = 'feedback-card error';
      dom.feedbackTitle.innerHTML = `<span>⚠️</span> Acceso Denegado`;
      dom.feedbackDesc.textContent = `La respuesta no coincide con los archivos culturales de Catamarca. Revisa la pista táctica y prueba con otra alternativa.`;
      dom.feedbackLore.textContent = `Tip: Los exploradores de SCOUT aprenden de cada intento. ¡No hay penalización de puntos!`;

      // Quitar clase de error luego de la animación para permitir reintento limpio
      setTimeout(() => {
        clickedBtn.classList.remove('incorrect');
      }, 1200);
    }
  }

  function handleNextStep() {
    soundClick();
    if (state.currentLevelIndex < state.totalLevels - 1) {
      // Ir al siguiente acertijo
      loadLevel(state.currentLevelIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Llegó a la victoria
      showVictoryScreen();
    }
  }

  // =========================================================================
  // 7. PANTALLA DE VICTORIA & REGISTRO BETA ANDROID
  // =========================================================================
  function showVictoryScreen() {
    soundVictory();
    switchScreen(dom.screenVictory);
    dom.victoryTotalEsquius.textContent = `${state.totalEsquius} Esquiús`;
    dom.hudLevelIndicator.textContent = `MISIÓN COMPLETADA`;
    dom.progressFill.style.width = `100%`;
    dom.progressPercent.textContent = `100%`;
  }

  function handleBetaRegistration(e) {
    e.preventDefault();
    soundClick();

    const nameInput = document.getElementById('beta-name').value.trim();
    const emailInput = document.getElementById('beta-email').value.trim();
    const deviceInput = document.getElementById('beta-device').value.trim() || 'Android Genérico';
    const cityInput = document.getElementById('beta-city').value;

    if (!nameInput || !emailInput) {
      alert('Por favor, completa los campos requeridos de nombre y correo electrónico.');
      return;
    }

    // Generar código de pase único
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const betaCode = `SCOUT-CAT-${randomCode}`;

    // Almacenar en localStorage para persistencia y modo offline
    const leadData = {
      name: nameInput,
      email: emailInput,
      device: deviceInput,
      city: cityInput,
      esquiusEarned: state.totalEsquius,
      accessCode: betaCode,
      registeredAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('scout_beta_lead', JSON.stringify(leadData));
    } catch (err) {
      console.warn('No se pudo escribir en localStorage:', err);
    }

    // Mostrar boleto de confirmación
    dom.betaForm.style.display = 'none';
    dom.betaSuccessTicket.style.display = 'block';
    dom.betaAccessCode.textContent = betaCode;
    dom.betaUserEmail.textContent = emailInput;
    soundCorrect();
  }

  function copyBetaCode() {
    const code = dom.betaAccessCode.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        dom.btnCopyCode.textContent = '¡Código Copiado!';
        soundClick();
        setTimeout(() => {
          dom.btnCopyCode.textContent = 'Copiar Código de Acceso';
        }, 2000);
      });
    } else {
      alert(`Tu código es: ${code}`);
    }
  }

  function restartGame() {
    soundClick();
    state.currentLevelIndex = 0;
    state.totalEsquius = 0;
    state.isLevelCompleted = false;

    dom.hudScoreDisplay.textContent = '0';
    dom.betaForm.reset();
    dom.betaForm.style.display = 'block';
    dom.betaSuccessTicket.style.display = 'none';

    switchScreen(dom.screenIntro);
    updateProgress();
  }

  // =========================================================================
  // 8. EVENT LISTENERS
  // =========================================================================
  // Iniciar Misión
  dom.btnStartMission.addEventListener('click', () => {
    soundClick();
    switchScreen(dom.screenGameplay);
    loadLevel(0);
  });

  // Botón Siguiente Misión
  dom.btnNextLevel.addEventListener('click', handleNextStep);

  // Formulario Beta
  dom.betaForm.addEventListener('submit', handleBetaRegistration);

  // Copiar Código Beta
  dom.btnCopyCode.addEventListener('click', copyBetaCode);

  // Reiniciar Aventura
  dom.btnRestartGame.addEventListener('click', restartGame);

  // Toggle Sonido
  dom.audioToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    dom.audioIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    dom.audioToggleBtn.title = state.soundEnabled ? 'Silenciar Efectos' : 'Activar Efectos';
    if (state.soundEnabled) soundClick();
  });

  // Inicialización de textos intro desde quiz_data
  if (scoutTeaserData && scoutTeaserData.intro) {
    dom.introStory.textContent = scoutTeaserData.intro.story;
  }
});
