document.addEventListener('DOMContentLoaded', () => {

  const firebaseConfig = {
    apiKey: "AIzaSyCnL8zEma0QfE0GIUsTilPI096d9KhFCvQ",
    authDomain: "accahub-587a4.firebaseapp.com",
    projectId: "accahub-587a4",
    storageBucket: "accahub-587a4.firebasestorage.app",
    messagingSenderId: "86306342854",
    appId: "1:86306342854:web:46b1625c44e5aae69b14c7",
    measurementId: "G-HL9M8NWKJK"
  };

  // Initialize Firebase (v8)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Initialize Firebase App Check with reCAPTCHA v3
  const appCheck = firebase.appCheck();
  appCheck.activate(
    '6LcRySgtAAAAADDwDo2z-_MKx5FKaapKYAFhdH8O',
    true // isTokenAutoRefreshEnabled
  );

  const auth = firebase.auth();
  const db = firebase.firestore();

  lucide.createIcons();

  // --- DOM Elements ---
  const screens = {
    login: document.getElementById('login-screen'),
    register: document.getElementById('register-screen'),
    forgot: document.getElementById('forgot-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    exam: document.getElementById('exam-screen'),
    result: document.getElementById('result-screen')
  };

  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const togglePassword = document.getElementById('toggle-password');

  // Register Logic
  const registerForm = document.getElementById('register-form');
  const regEmailInput = document.getElementById('reg-email');
  const regPasswordInput = document.getElementById('reg-password');
  const regConfirmInput = document.getElementById('reg-confirm');
  const registerBtn = document.getElementById('register-btn');

  // Forgot Password Logic
  const forgotForm = document.getElementById('forgot-form');
  const forgotEmailInput = document.getElementById('forgot-email');
  const forgotBtn = document.getElementById('forgot-btn');

  // Links
  const linkCreateAccount = document.getElementById('link-create-account');
  const linkForgotPassword = document.getElementById('link-forgot-password');
  const linkBackLogin1 = document.getElementById('link-back-login-1');
  const linkBackLogin2 = document.getElementById('link-back-login-2');

  // Theme Logic
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  const savedTheme = localStorage.getItem('accaTheme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  function updateThemeToggleText() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if(themeToggle) themeToggle.textContent = isDark ? 'Dark Mode: On' : 'Dark Mode: Off';
  }
  updateThemeToggleText();

  if(themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('accaTheme', newTheme);
      updateThemeToggleText();
    });
  }

  const navLogout = document.getElementById('nav-logout');
  const exitResultBtn = document.getElementById('exit-result-btn');
  const startExamBtn = document.getElementById('start-exam-btn');

  // Exam Elements
  const submitExamBtn = document.getElementById('submit-exam-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentQNumDisplay = document.getElementById('current-q-num');
  const questionTextContainer = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const timerDisplay = document.getElementById('timer-display');

  // Tools
  const calcTool = document.getElementById('calc-tool');
  const highlightTool = document.getElementById('highlight-tool');
  const strikethroughTool = document.getElementById('strikethrough-tool');
  const flagTool = document.getElementById('flag-tool');
  const symbolTool = document.getElementById('symbol-tool');
  const symbolWidget = document.getElementById('symbol-widget');
  const closeSymbol = document.getElementById('close-symbol');
  const calcWidget = document.getElementById('calculator-widget');
  const closeCalc = document.getElementById('close-calc');
  const scratchpadTool = document.getElementById('scratchpad-tool');
  const scratchpadWidget = document.getElementById('scratchpad-widget');
  const closeScratchpad = document.getElementById('close-scratchpad');

  // Layouts
  const mcqLayout = document.getElementById('mcq-layout');
  const sectionBLayout = document.getElementById('section-b-layout');
  const crLayout = document.getElementById('cr-layout');

  // Results Output
  const reviewListContainer = document.getElementById('review-list');

  // --- State ---
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let userInterpretations = [];
  let timeRemaining = 36 * 60; // 36 minutes default
  let timerInterval;
  let currentMockId = null;
  let isPracticeMode = false;
  
  // Define questions as empty initially, will be populated on startMock
  let questions = [];
  let isHighlightMode = false;
  let isStrikethroughMode = false;
  let flaggedQuestions = [];
  let userDataCache = { history: [], topics: {} };

  // --- View Management ---
  function showScreen(screenName) {
    Object.values(screens).forEach(s => {
      if(s) s.classList.add('hidden');
    });
    screens[screenName].classList.remove('hidden');
    lucide.createIcons();
  }

  async function updateDashboardData() {
    const user = auth.currentUser;
    if (!user) return;
    
    const displayNameElem = document.getElementById('user-display-name');
    const profileNameElem = document.getElementById('profile-name-display');
    const profileInputElem = document.getElementById('profile-name-input');
    const profileAvatar = document.getElementById('profile-avatar');
    
    const displayName = user.displayName || user.email.split('@')[0];
    
    if(displayNameElem) displayNameElem.textContent = displayName;
    if(profileNameElem) profileNameElem.textContent = displayName;
    if(profileInputElem) profileInputElem.value = displayName;
    if(profileAvatar) {
      // Get up to two initials
      const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      profileAvatar.textContent = initials || 'U';
    }
    
    // Fetch Firestore Data
    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        userDataCache = userDoc.data();
        if (!userDataCache.history) userDataCache.history = [];
        if (!userDataCache.topics) userDataCache.topics = {};
      } else {
        userDataCache = { history: [], topics: {} };
      }
      renderAnalytics();
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  // --- Auth State Observer ---
  auth.onAuthStateChanged((user) => {
    if (user) {
      showScreen('dashboard');
      updateDashboardData();
    } else {
      showScreen('login');
    }
  });

  // --- Login Form Logic ---
  function validateForm() {
    if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
      loginBtn.disabled = false;
      loginBtn.classList.add('active');
    } else {
      loginBtn.disabled = true;
      loginBtn.classList.remove('active');
    }
  }

  usernameInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);

  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'text') {
      togglePassword.setAttribute('data-lucide', 'eye-off');
    } else {
      togglePassword.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    
    if (email && pass) {
      try {
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;
        await auth.signInWithEmailAndPassword(email, pass);
        // onAuthStateChanged will handle navigation
      } catch (error) {
        alert("Invalid credentials. Please try again or create an account.");
        console.error(error);
      } finally {
        loginBtn.textContent = 'Sign in';
        loginBtn.disabled = false;
      }
    }
  });

  // --- Auth Navigation ---
  linkCreateAccount.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('register');
  });

  linkForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('forgot');
  });

  linkBackLogin1.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('login');
  });

  linkBackLogin2.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('login');
  });

  // --- Register Form Logic ---
  function validateRegisterForm() {
    if (regEmailInput.value.trim() && regPasswordInput.value.trim() && regConfirmInput.value.trim()) {
      registerBtn.disabled = false;
      registerBtn.classList.add('active');
    } else {
      registerBtn.disabled = true;
      registerBtn.classList.remove('active');
    }
  }

  regEmailInput.addEventListener('input', validateRegisterForm);
  regPasswordInput.addEventListener('input', validateRegisterForm);
  regConfirmInput.addEventListener('input', validateRegisterForm);

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (regPasswordInput.value !== regConfirmInput.value) {
      alert("Passwords do not match!");
      return;
    }
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value.trim();
    const displayName = email.split('@')[0];
    
    try {
      registerBtn.textContent = 'Creating...';
      registerBtn.disabled = true;
      
      // Create Auth User
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update Profile Name
      await user.updateProfile({ displayName: displayName });
      
      // Create initial Firestore Document
      await db.collection("users").doc(user.uid).set({
        email: email,
        displayName: displayName,
        history: [],
        topics: {}
      });
      
      // onAuthStateChanged will handle navigation
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      registerBtn.textContent = 'Create Account';
      registerBtn.disabled = false;
    }
  });

  // --- Forgot Password Logic ---
  function validateForgotForm() {
    if (forgotEmailInput.value.trim()) {
      forgotBtn.disabled = false;
      forgotBtn.classList.add('active');
    } else {
      forgotBtn.disabled = true;
      forgotBtn.classList.remove('active');
    }
  }

  forgotEmailInput.addEventListener('input', validateForgotForm);

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Password reset link sent to ${forgotEmailInput.value}`);
    showScreen('login');
  });

  // --- Sidebar Navigation ---
  const navTabs = document.querySelectorAll('.nav-tab');
  const hubTabs = document.querySelectorAll('.hub-tab');

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active nav link
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all panels
      hubTabs.forEach(panel => panel.classList.add('hidden'));

      // Show target panel
      const targetId = tab.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');

      if (targetId === 'tab-profile') {
        renderAnalytics();
      }
    });
  });

  if(navLogout) {
    navLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await auth.signOut();
        usernameInput.value = '';
        passwordInput.value = '';
        validateForm();
        showScreen('login');
      } catch (error) {
        console.error('Error signing out', error);
      }
    });
  }

  // --- Profile Name Editing ---
  const editNameBtn = document.getElementById('edit-name-btn');
  const saveNameBtn = document.getElementById('save-name-btn');
  const profileNameDisplay = document.getElementById('profile-name-display');
  const profileNameEdit = document.getElementById('profile-name-edit');
  const profileNameInput = document.getElementById('profile-name-input');
  const userDisplayName = document.getElementById('user-display-name');

  if(editNameBtn) {
    editNameBtn.addEventListener('click', () => {
      profileNameDisplay.classList.add('hidden');
      profileNameEdit.classList.remove('hidden');
      editNameBtn.classList.add('hidden');
    });
  }

  if(saveNameBtn) {
    saveNameBtn.addEventListener('click', async () => {
      const newName = profileNameInput.value.trim();
      const user = auth.currentUser;
      
      if(newName && user) {
        try {
          saveNameBtn.textContent = 'Saving...';
          await user.updateProfile({ displayName: newName });
          await db.collection("users").doc(user.uid).update({ displayName: newName });
          
          profileNameDisplay.textContent = newName;
          userDisplayName.textContent = newName;
        } catch (error) {
          console.error("Error updating profile", error);
          alert("Failed to update name.");
        } finally {
          saveNameBtn.textContent = 'Save Name';
        }
      }
      
      profileNameDisplay.classList.remove('hidden');
      profileNameEdit.classList.add('hidden');
      editNameBtn.classList.remove('hidden');
    });
  }

  exitResultBtn.addEventListener('click', () => {
    showScreen('dashboard');
  });

  // --- Certificate Download Logic ---
  const downloadCertBtn = document.getElementById('download-cert-btn');
  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', () => {
      const certContainer = document.getElementById('certificate-container');
      const originalOutline = certContainer.style.outline;
      
      // Temporary style adjustments for better html2canvas rendering
      certContainer.style.outline = 'none';
      
      html2canvas(certContainer, { scale: 2 }).then(canvas => {
        certContainer.style.outline = originalOutline;
        
        const imgData = canvas.toDataURL('image/png');
        // 'l' = landscape
        const pdf = new window.jspdf.jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Center the certificate vertically if the a4 page is taller than the certificate
        let yOffset = 0;
        if (pdfHeight < pdf.internal.pageSize.getHeight()) {
          yOffset = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
        }

        pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
        pdf.save(`ACCA_Certificate_${currentMockId}.pdf`);
      });
    });
  }

  // --- Exam Logic ---
  // --- Exam Logic ---
  window.startMock = function(mockId, practice) {
    currentMockId = mockId;
    isPracticeMode = practice;
    questions = mockExams[mockId];
    
    const totalQNumElement = document.getElementById('total-q-num');
    if (totalQNumElement) {
      totalQNumElement.textContent = questions.length;
    }
    
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    userInterpretations = new Array(questions.length).fill('');
    
    // Tear down existing tool instances to prevent memory leaks and state bleed
    if (quillInstance) {
      document.getElementById('cr-word-editor').innerHTML = '';
      quillInstance = null;
    }
    if (spreadsheetInstance) {
      spreadsheetInstance.destroy();
      spreadsheetInstance = null;
    }
    
    if (mockId === 'mock-1') {
      timeRemaining = 36 * 60; // 36 minutes
    } else if (mockId === 'mock-2') {
      timeRemaining = 12 * 60; // 12 minutes
    } else if (mockId === 'mock-3') {
      timeRemaining = 30 * 60; // 30 minutes
    }
    
    if (isPracticeMode) {
      timeRemaining += 15 * 60; // Add 15 extra minutes for practice mode interpretation
    }
    
    flaggedQuestions = new Array(questions.length).fill(false);
    updateFlagButtonState();
    
    startTimer();
    
    renderQuestion();
    showScreen('exam');
  };

  function startTimer() {
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        finishExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const s = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
  }

  let quillInstance = null;
  let spreadsheetInstance = null;

  function saveCurrentCRAnswer() {
    const q = questions[currentQuestionIndex];
    if (q && q.type === 'cr') {
      if (!userAnswers[currentQuestionIndex]) userAnswers[currentQuestionIndex] = {};
      if (quillInstance) {
        userAnswers[currentQuestionIndex].word = quillInstance.root.innerHTML;
      }
      if (spreadsheetInstance) {
        userAnswers[currentQuestionIndex].spreadsheet = spreadsheetInstance.getData();
      }
    }
  }

  function renderQuestion() {
    // Save CR responses before re-rendering
    saveCurrentCRAnswer();

    const q = questions[currentQuestionIndex];
    
    if (q.type === 'cr') {
      mcqLayout.classList.add('hidden');
      sectionBLayout.classList.add('hidden');
      crLayout.classList.remove('hidden');
      renderCrQuestion(q);
    } else if (q.section === 'B') {
      mcqLayout.classList.add('hidden');
      crLayout.classList.add('hidden');
      sectionBLayout.classList.remove('hidden');
      renderSectionBQuestion(q);
    } else {
      crLayout.classList.add('hidden');
      sectionBLayout.classList.add('hidden');
      mcqLayout.classList.remove('hidden');
      renderMcqQuestion(q);
    }

    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
      nextBtn.classList.add('hidden');
      submitExamBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitExamBtn.classList.add('hidden');
    }

    updateFlagButtonState();
  }

  function updateFlagButtonState() {
    if (!flagTool) return;
    if (flaggedQuestions[currentQuestionIndex]) {
      flagTool.style.background = '#444';
      flagTool.innerHTML = '<i data-lucide="flag" style="width:14px; fill:currentColor;"></i> Flagged';
    } else {
      flagTool.style.background = '#2a2a2a';
      flagTool.innerHTML = '<i data-lucide="flag" style="width:14px;"></i> Flag for Review';
    }
    lucide.createIcons();
  }

  if (flagTool) {
    flagTool.addEventListener('click', () => {
      flaggedQuestions[currentQuestionIndex] = !flaggedQuestions[currentQuestionIndex];
      updateFlagButtonState();
    });
  }

  function renderMcqQuestion(q) {
    currentQNumDisplay.textContent = currentQuestionIndex + 1;
    questionTextContainer.innerHTML = escapeHTML(q.text);
    
    optionsContainer.innerHTML = '';
    q.options.forEach((opt) => {
      const letter = opt.charAt(0);
      
      const optionLabel = document.createElement('label');
      optionLabel.className = 'cbe-option';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question-${currentQuestionIndex}`;
      radio.value = letter;
      
      if (userAnswers[currentQuestionIndex] === letter) {
        radio.checked = true;
      }
      
      radio.addEventListener('change', () => {
        userAnswers[currentQuestionIndex] = letter;
      });
      
      const textSpan = document.createElement('span');
      textSpan.textContent = opt;
      
      optionLabel.appendChild(radio);
      optionLabel.appendChild(textSpan);
      optionsContainer.appendChild(optionLabel);
    });

    const interpretationContainer = document.getElementById('practice-interpretation-container');
    const interpretationInput = document.getElementById('interpretation-input');
    
    if (isPracticeMode) {
      interpretationContainer.classList.remove('hidden');
      interpretationInput.value = userInterpretations[currentQuestionIndex] || '';
    } else {
      interpretationContainer.classList.add('hidden');
    }
  }

  function renderSectionBQuestion(q) {
    document.getElementById('sec-b-current-q-num').textContent = currentQuestionIndex + 1;
    document.getElementById('sec-b-scenario-text').innerHTML = escapeHTML(q.scenario || '').replace(/\n/g, '<br>');
    document.getElementById('sec-b-question-text').innerHTML = escapeHTML(q.text);
    
    const optionsContainer = document.getElementById('sec-b-options-container');
    optionsContainer.innerHTML = '';
    q.options.forEach((opt) => {
      const letter = opt.charAt(0);
      
      const optionLabel = document.createElement('label');
      optionLabel.className = 'cbe-option';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `sec-b-question-${currentQuestionIndex}`;
      radio.value = letter;
      
      if (userAnswers[currentQuestionIndex] === letter) {
        radio.checked = true;
      }
      
      radio.addEventListener('change', () => {
        userAnswers[currentQuestionIndex] = letter;
      });
      
      const textSpan = document.createElement('span');
      textSpan.textContent = opt;
      
      optionLabel.appendChild(radio);
      optionLabel.appendChild(textSpan);
      optionsContainer.appendChild(optionLabel);
    });

    const interpretationContainer = document.getElementById('sec-b-interpretation-container');
    const interpretationInput = document.getElementById('sec-b-interpretation-input');
    
    if (isPracticeMode) {
      interpretationContainer.classList.remove('hidden');
      interpretationInput.value = userInterpretations[currentQuestionIndex] || '';
      
      const newInterpretationInput = interpretationInput.cloneNode(true);
      interpretationInput.parentNode.replaceChild(newInterpretationInput, interpretationInput);
      newInterpretationInput.addEventListener('input', () => {
        userInterpretations[currentQuestionIndex] = newInterpretationInput.value;
      });
    } else {
      interpretationContainer.classList.add('hidden');
    }
  }

  function renderCrQuestion(q) {
    document.getElementById('cr-current-q-num').textContent = currentQuestionIndex + 1;
    document.getElementById('cr-scenario-text').innerHTML = escapeHTML(q.text).replace(/\n/g, '<br>');
    
    // Clear tools
    document.getElementById('cr-word-container').classList.add('hidden');
    document.getElementById('cr-spreadsheet-container').classList.add('hidden');
    document.getElementById('cr-scenario-text').classList.remove('hidden');
    
    // Populate Exhibits
    const exhibitsList = document.getElementById('cr-exhibits-list');
    exhibitsList.innerHTML = '';
    (q.exhibits || []).forEach((ex, idx) => {
      const btn = document.createElement('button');
      btn.className = 'cr-item-btn';
      btn.innerHTML = `<i data-lucide="file-text" class="cr-item-icon"></i> ${ex.title}`;
      btn.onclick = () => openCrModal(ex.title, ex.content);
      exhibitsList.appendChild(btn);
    });

    // Populate Requirements
    const reqsList = document.getElementById('cr-requirements-list');
    reqsList.innerHTML = '';
    (q.requirements || []).forEach((req, idx) => {
      const btn = document.createElement('button');
      btn.className = 'cr-item-btn';
      btn.innerHTML = `<i data-lucide="help-circle" class="cr-item-icon"></i> ${req.title}`;
      btn.onclick = () => openCrModal(req.title, req.content);
      reqsList.appendChild(btn);
    });

    // Populate Response Options
    const respList = document.getElementById('cr-response-list');
    respList.innerHTML = '';
    (q.responseOptions || []).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'cr-item-btn';
      if (opt === 'word') {
        btn.innerHTML = `<i data-lucide="file-edit" class="cr-item-icon"></i> Word Processor`;
        btn.onclick = () => openCrTool('word', q);
      } else if (opt === 'spreadsheet') {
        btn.innerHTML = `<i data-lucide="grid" class="cr-item-icon"></i> Spreadsheet`;
        btn.onclick = () => openCrTool('spreadsheet', q);
      }
      respList.appendChild(btn);
    });
    
    lucide.createIcons();
  }

  function openCrModal(title, content) {
    const modal = document.getElementById('cr-modal-widget');
    document.getElementById('cr-modal-title').textContent = title;
    document.getElementById('cr-modal-body').innerHTML = content;
    modal.classList.remove('hidden');
  }

  function openCrTool(tool, q) {
    saveCurrentCRAnswer();
    
    document.getElementById('cr-scenario-text').classList.add('hidden');
    document.getElementById('cr-word-container').classList.add('hidden');
    document.getElementById('cr-spreadsheet-container').classList.add('hidden');
    
    // Initialize Answer Object if empty
    if (!userAnswers[currentQuestionIndex]) {
      userAnswers[currentQuestionIndex] = {};
    }

    if (tool === 'word') {
      document.getElementById('cr-word-container').classList.remove('hidden');
      if (!quillInstance) {
        quillInstance = new Quill('#cr-word-editor', {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              ['clean']
            ]
          }
        });
      }
      quillInstance.root.innerHTML = userAnswers[currentQuestionIndex].word || '';
    } else if (tool === 'spreadsheet') {
      document.getElementById('cr-spreadsheet-container').classList.remove('hidden');
      
      if (spreadsheetInstance) {
        spreadsheetInstance.destroy();
      }
      
      spreadsheetInstance = jspreadsheet(document.getElementById('cr-spreadsheet-editor'), {
        data: userAnswers[currentQuestionIndex].spreadsheet || [[]],
        minDimensions: [10, 20],
        toolbar: [
          { type: 'i', content: 'format_bold', k: 'font-weight', v: 'bold' },
          { type: 'i', content: 'format_italic', k: 'font-style', v: 'italic' },
          { type: 'i', content: 'format_underline', k: 'text-decoration', v: 'underline' },
          { type: 'color', content: 'format_color_text', k: 'color' },
          { type: 'color', content: 'format_color_fill', k: 'background-color' },
        ]
      });
    }
  }

  document.getElementById('close-cr-modal').addEventListener('click', () => {
    document.getElementById('cr-modal-widget').classList.add('hidden');
  });

  // Make CR Modal Draggable
  const crModalWidget = document.getElementById("cr-modal-widget");
  const crModalHeader = document.getElementById("cr-modal-header");
  let isCrModalDragging = false;
  let crModalOffsetX, crModalOffsetY;

  if (crModalHeader) {
    crModalHeader.addEventListener('mousedown', (e) => {
      isCrModalDragging = true;
      crModalOffsetX = e.clientX - crModalWidget.getBoundingClientRect().left;
      crModalOffsetY = e.clientY - crModalWidget.getBoundingClientRect().top;
      document.addEventListener('mousemove', onCrModalMouseMove);
      document.addEventListener('mouseup', onCrModalMouseUp);
    });
  }

  function onCrModalMouseMove(e) {
    if (!isCrModalDragging) return;
    crModalWidget.style.left = `${e.clientX - crModalOffsetX}px`;
    crModalWidget.style.top = `${e.clientY - crModalOffsetY}px`;
    crModalWidget.style.right = 'auto';
  }

  function onCrModalMouseUp() {
    isCrModalDragging = false;
    document.removeEventListener('mousemove', onCrModalMouseMove);
    document.removeEventListener('mouseup', onCrModalMouseUp);
  }

  // Save interpretation on input
  const interpretationInput = document.getElementById('interpretation-input');
  if (interpretationInput) {
    interpretationInput.addEventListener('input', () => {
      if (isPracticeMode) {
        userInterpretations[currentQuestionIndex] = interpretationInput.value;
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    }
  });

  // --- Navigator Logic ---
  const navBtn = document.getElementById('nav-btn');
  const navigatorWidget = document.getElementById('navigator-widget');
  const closeNavigatorBtn = document.getElementById('close-navigator');
  const navigatorGrid = document.getElementById('navigator-grid');

  if (navBtn && navigatorWidget) {
    navBtn.addEventListener('click', () => {
      navigatorGrid.innerHTML = '';
      questions.forEach((q, i) => {
        const btn = document.createElement('button');
        btn.style.padding = '10px';
        btn.style.border = '1px solid var(--border-color)';
        // Red if answered, alt bg if unanswered
        btn.style.background = userAnswers[i] ? 'var(--acca-red)' : 'var(--bg-alt)';
        btn.style.color = userAnswers[i] ? 'white' : 'var(--text-main)';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';
        
        let content = `${i + 1}`;
        if (flaggedQuestions[i]) {
           content += ` <i data-lucide="flag" style="width:12px; height:12px; margin-left: 4px; fill:currentColor;"></i>`;
        }
        btn.innerHTML = content;
        
        // Highlight current question
        if(i === currentQuestionIndex) {
          btn.style.border = '2px solid var(--text-main)';
          btn.style.fontWeight = 'bold';
        }

        btn.addEventListener('click', () => {
          currentQuestionIndex = i;
          renderQuestion();
          navigatorWidget.classList.add('hidden');
        });
        navigatorGrid.appendChild(btn);
      });
      lucide.createIcons();
      navigatorWidget.classList.remove('hidden');
    });

    closeNavigatorBtn.addEventListener('click', () => {
      navigatorWidget.classList.add('hidden');
    });
  }

  submitExamBtn.addEventListener('click', () => {
    if(confirm('Are you sure you want to end the exam?')) {
      finishExam();
    }
  });

  // --- Submission & Detailed Review ---
  async function finishExam() {
    clearInterval(timerInterval);
    
    reviewListContainer.innerHTML = '';
    let correctCount = 0;
    const topicStats = {};
    
    questions.forEach((q, i) => {
      const userAnswer = userAnswers[i];
      // In practice mode, we evaluate the option correctness, but final mark depends on self-grade
      const isOptionCorrect = userAnswer === q.answer;
      if (!isPracticeMode && isOptionCorrect) correctCount++;
      
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
      topicStats[q.topic].total++;
      if (!isPracticeMode && isOptionCorrect) topicStats[q.topic].correct++;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'review-item';
      
      const headerDiv = document.createElement('div');
      headerDiv.className = 'review-header';
      headerDiv.innerHTML = `
        <span>Question ${i + 1}</span>
        <span class="${isOptionCorrect ? 'review-correct' : 'review-incorrect'}">
          ${isOptionCorrect ? '✓ Option Correct' : '✗ Option Incorrect'}
        </span>
      `;
      itemDiv.appendChild(headerDiv);
      
      const textDiv = document.createElement('div');
      textDiv.className = 'review-q-text';
      textDiv.innerHTML = escapeHTML(q.text);
      itemDiv.appendChild(textDiv);
      
      q.options.forEach(opt => {
        const letter = opt.charAt(0);
        const optDiv = document.createElement('div');
        optDiv.className = 'review-opt';
        optDiv.textContent = opt;
        
        if (letter === q.answer) {
          optDiv.classList.add('is-correct');
          optDiv.innerHTML += ' <strong>(Correct Answer)</strong>';
        } else if (letter === userAnswer) {
          optDiv.classList.add('is-user-wrong');
          optDiv.innerHTML += ' <strong>(Your Answer)</strong>';
        }
        itemDiv.appendChild(optDiv);
      });

      // Show interpretation section if exists in mock data
      if (q.explanation) {
        const explBtn = document.createElement('button');
        explBtn.className = 'cbe-nav-btn';
        explBtn.style.marginTop = '15px';
        explBtn.textContent = 'View Correct Interpretation';
        
        const explDiv = document.createElement('div');
        explDiv.className = 'hidden';
        explDiv.style.marginTop = '10px';
        explDiv.style.padding = '15px';
        explDiv.style.background = 'var(--bg-main)';
        explDiv.style.border = '1px solid var(--acca-red)';
        explDiv.innerHTML = `<strong style="color:var(--acca-red);">Correct Logic:</strong><br><pre style="font-family:inherit; white-space:pre-wrap;">${q.explanation}</pre>`;

        if (isPracticeMode) {
          explDiv.innerHTML = `
            <div style="margin-bottom:15px;"><strong>Your Interpretation:</strong><br><pre style="font-family:inherit; white-space:pre-wrap; color:var(--text-light);">${escapeHTML(userInterpretations[i] || 'No interpretation provided.')}</pre></div>
            ` + explDiv.innerHTML + `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border-color);">
              <strong>Self-Grade: Did your interpretation match the correct logic?</strong><br>
              <label style="margin-right: 15px;"><input type="radio" name="selfgrade-${i}" value="yes"> Yes, my logic was correct</label>
              <label><input type="radio" name="selfgrade-${i}" value="no" checked> No, I made a mistake</label>
            </div>
          `;
        }

        explBtn.addEventListener('click', () => {
          explDiv.classList.toggle('hidden');
          explBtn.textContent = explDiv.classList.contains('hidden') ? 'View Correct Interpretation' : 'Hide Interpretation';
        });

        itemDiv.appendChild(explBtn);
        itemDiv.appendChild(explDiv);
      }
      
      reviewListContainer.appendChild(itemDiv);
    });
    
    if (isPracticeMode) {
      document.getElementById('final-score').textContent = `Pending Self-Grade`;
      document.getElementById('score-percent').textContent = `-%`;
      
      const saveBtn = document.createElement('button');
      saveBtn.className = 'start-btn';
      saveBtn.style.width = '100%';
      saveBtn.style.marginTop = '30px';
      saveBtn.textContent = 'Submit Self-Grading and Save Results';
      saveBtn.addEventListener('click', async () => {
        let finalCorrectCount = 0;
        const finalTopicStats = {};

        questions.forEach((q, i) => {
          const isOptionCorrect = userAnswers[i] === q.answer;
          const selfGradeRadios = document.getElementsByName(`selfgrade-${i}`);
          let interpretationCorrect = false;
          if (selfGradeRadios && selfGradeRadios.length > 0) {
            interpretationCorrect = Array.from(selfGradeRadios).find(r => r.checked)?.value === 'yes';
          } else {
            interpretationCorrect = true; // No explanation provided for this question, option is enough
          }

          const isFullyCorrect = isOptionCorrect && interpretationCorrect;
          if (isFullyCorrect) finalCorrectCount++;

          if (!finalTopicStats[q.topic]) finalTopicStats[q.topic] = { correct: 0, total: 0 };
          finalTopicStats[q.topic].total++;
          if (isFullyCorrect) finalTopicStats[q.topic].correct++;
        });
        
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        await saveResultToFirestore(finalCorrectCount, finalTopicStats);
        saveBtn.style.display = 'none';
      });
      reviewListContainer.appendChild(saveBtn);
      showScreen('result');
    } else {
      await saveResultToFirestore(correctCount, topicStats);
      showScreen('result');
    }
  }

  async function saveResultToFirestore(correctCount, topicStats) {
    const score = correctCount * 2;
    const totalScore = questions.length * 2;
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    let mockIdName = 'Mock';
    if (currentMockId === 'mock-1') mockIdName = 'Chapter 1 CF';
    else if (currentMockId === 'mock-2') mockIdName = 'Chapter 2 IAS16';
    else if (currentMockId === 'mock-3') mockIdName = 'Chapter 3 IAS40';

    const attemptData = {
      id: `${mockIdName} (${isPracticeMode ? 'Practice' : 'Timed'}) - #${userDataCache.history.length + 1}`,
      score: score,
      percentage: percentage,
      date: new Date().toLocaleDateString()
    };
    
    userDataCache.history.push(attemptData);
    
    Object.keys(topicStats).forEach(topic => {
      if (!userDataCache.topics[topic]) userDataCache.topics[topic] = { correct: 0, total: 0 };
      userDataCache.topics[topic].correct += topicStats[topic].correct;
      userDataCache.topics[topic].total += topicStats[topic].total;
    });
    
    const user = auth.currentUser;
    if (user) {
      try {
        await db.collection("users").doc(user.uid).update({
          history: firebase.firestore.FieldValue.arrayUnion(attemptData),
          topics: userDataCache.topics
        });
      } catch (err) {
        console.error("Failed to save mock exam to Firestore", err);
      }
    }
    
    document.getElementById('final-score').textContent = `${score}/${totalScore}`;
    document.getElementById('score-percent').textContent = `${percentage}%`;

    // --- Certificate Logic ---
    const certWrapper = document.getElementById('certificate-wrapper');
    if (percentage >= 70) {
      certWrapper.classList.remove('hidden');
      const user = auth.currentUser;
      let studentName = "Student";
      if (user) {
        studentName = user.displayName || user.email.split('@')[0];
      }
      document.getElementById('cert-student-name').textContent = studentName;
      document.getElementById('cert-exam-name').textContent = currentMockId.toUpperCase().replace('-', ' ');
      document.getElementById('cert-score').textContent = `${percentage}%`;
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      document.getElementById('cert-date').textContent = dateStr;
    } else {
      certWrapper.classList.add('hidden');
    }
  }

  // --- Render Analytics Page ---
  function renderAnalytics() {
    const hist = userDataCache.history;
    const attempts = hist.length;
    let avg = 0, best = 0, latest = 0;
    
    if (attempts > 0) {
      latest = hist[hist.length - 1].percentage;
      best = Math.max(...hist.map(h => h.percentage));
      avg = Math.round(hist.reduce((sum, h) => sum + h.percentage, 0) / attempts);
    }
    
    // Update Dashboard Quick Stats
    const dashMocks = document.getElementById('dash-mocks-completed');
    const dashAvg = document.getElementById('dash-avg-score');
    if (dashMocks) dashMocks.textContent = attempts;
    if (dashAvg) dashAvg.textContent = `${avg}%`;

    document.getElementById('stat-average').textContent = `${avg}%`;
    document.getElementById('stat-best').textContent = `${best}%`;
    document.getElementById('stat-latest').textContent = `${latest}%`;
    document.getElementById('stat-attempts').textContent = attempts;
    
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    if (attempts === 0) {
      historyList.innerHTML = '<p style="color:#666;">No mock exams completed yet.</p>';
    } else {
      [...hist].reverse().forEach(h => {
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid #ccc';
        div.innerHTML = `<span>${h.id} (${h.date})</span> <strong style="float:right;">${h.percentage}%</strong>`;
        historyList.appendChild(div);
      });
    }
    
    const topicList = document.getElementById('topic-list');
    topicList.innerHTML = '';
    const topics = Object.keys(userDataCache.topics);
    if (topics.length === 0) {
      topicList.innerHTML = '<p style="color:#666;">Not enough data.</p>';
    } else {
      topics.forEach(t => {
        const stats = userDataCache.topics[t];
        const pct = Math.round((stats.correct / stats.total) * 100) || 0;
        
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid #ccc';
        
        let color = '#333';
        if (pct < 50) color = 'red';
        else if (pct >= 80) color = 'green';
        
        div.innerHTML = `<span>${t}</span> <strong style="float:right; color:${color}">${pct}%</strong>`;
        topicList.appendChild(div);
      });
    }
  }

  // --- Highlighter & Strikethrough Logic ---
  highlightTool.addEventListener('click', () => {
    isHighlightMode = !isHighlightMode;
    isStrikethroughMode = false; // mutually exclusive
    highlightTool.style.background = isHighlightMode ? '#444' : '#2a2a2a';
    strikethroughTool.style.background = '#2a2a2a';
  });

  strikethroughTool.addEventListener('click', () => {
    isStrikethroughMode = !isStrikethroughMode;
    isHighlightMode = false; // mutually exclusive
    strikethroughTool.style.background = isStrikethroughMode ? '#444' : '#2a2a2a';
    highlightTool.style.background = '#2a2a2a';
  });

  const contentArea = document.querySelector('.cbe-content-area');
  contentArea.addEventListener('mouseup', () => {
    if (!isHighlightMode && !isStrikethroughMode) return;
    const selection = window.getSelection();
    if (!selection.isCollapsed) {
      // Check if inside a valid text container
      let validContainer = selection.anchorNode.parentNode.closest('.cbe-q-text, .cbe-options');
      if (!validContainer) return;

      const className = isHighlightMode ? 'highlighted-text' : 'strikethrough-text';
      
      // Prevent overlapping same class
      if (selection.anchorNode.parentNode && selection.anchorNode.parentNode.classList && selection.anchorNode.parentNode.classList.contains(className)) return;

      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = className;
      try {
        range.surroundContents(span);
        selection.removeAllRanges();
      } catch (e) {
        console.warn("Could not modify text.", e);
      }
    }
  });

  // Remove highlight/strikethrough on click
  contentArea.addEventListener('click', (e) => {
    if (isHighlightMode && e.target.classList.contains('highlighted-text')) {
      unwrap(e.target);
    } else if (isStrikethroughMode && e.target.classList.contains('strikethrough-text')) {
      unwrap(e.target);
    }
  });

  function unwrap(el) {
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  // --- Symbol Widget Logic ---
  symbolTool.addEventListener('click', () => {
    symbolWidget.classList.toggle('hidden');
  });
  
  closeSymbol.addEventListener('click', () => {
    symbolWidget.classList.add('hidden');
  });

  document.querySelectorAll('.symbol-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const symbol = e.target.textContent;
      navigator.clipboard.writeText(symbol).then(() => {
        const feedback = document.getElementById('symbol-feedback');
        feedback.textContent = `Copied ${symbol} to clipboard`;
        setTimeout(() => feedback.textContent = '', 2000);
      });
    });
  });

  // Drag logic for symbol widget
  const symbolHeader = document.getElementById("symbol-header");
  let isSymbolDragging = false;
  let symbolOffsetX, symbolOffsetY;

  if (symbolHeader) {
    symbolHeader.addEventListener('mousedown', (e) => {
      isSymbolDragging = true;
      symbolOffsetX = e.clientX - symbolWidget.getBoundingClientRect().left;
      symbolOffsetY = e.clientY - symbolWidget.getBoundingClientRect().top;
      document.addEventListener('mousemove', onSymbolMouseMove);
      document.addEventListener('mouseup', onSymbolMouseUp);
    });
  }

  function onSymbolMouseMove(e) {
    if (!isSymbolDragging) return;
    symbolWidget.style.left = `${e.clientX - symbolOffsetX}px`;
    symbolWidget.style.top = `${e.clientY - symbolOffsetY}px`;
    symbolWidget.style.right = 'auto';
  }

  function onSymbolMouseUp() {
    isSymbolDragging = false;
    document.removeEventListener('mousemove', onSymbolMouseMove);
    document.removeEventListener('mouseup', onSymbolMouseUp);
  }

  // --- Calculator Logic ---
  calcTool.addEventListener('click', () => {
    calcWidget.classList.toggle('hidden');
  });

  closeCalc.addEventListener('click', () => {
    calcWidget.classList.add('hidden');
  });

  const calcHeader = document.getElementById('calc-header');
  let isDragging = false;
  let offsetX, offsetY;

  calcHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - calcWidget.getBoundingClientRect().left;
    offsetY = e.clientY - calcWidget.getBoundingClientRect().top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    calcWidget.style.left = `${e.clientX - offsetX}px`;
    calcWidget.style.top = `${e.clientY - offsetY}px`;
    calcWidget.style.right = 'auto';
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  // --- Scratchpad Logic ---
  if (scratchpadTool) {
    scratchpadTool.addEventListener('click', () => {
      scratchpadWidget.classList.toggle('hidden');
    });
  }

  if (closeScratchpad) {
    closeScratchpad.addEventListener('click', () => {
      scratchpadWidget.classList.add('hidden');
    });
  }

  const scratchpadHeader = document.getElementById('scratchpad-header');
  let isScratchDragging = false;
  let scratchOffsetX, scratchOffsetY;

  if (scratchpadHeader) {
    scratchpadHeader.addEventListener('mousedown', (e) => {
      isScratchDragging = true;
      scratchOffsetX = e.clientX - scratchpadWidget.getBoundingClientRect().left;
      scratchOffsetY = e.clientY - scratchpadWidget.getBoundingClientRect().top;
      document.addEventListener('mousemove', onScratchMouseMove);
      document.addEventListener('mouseup', onScratchMouseUp);
    });
  }

  function onScratchMouseMove(e) {
    if (!isScratchDragging) return;
    scratchpadWidget.style.left = `${e.clientX - scratchOffsetX}px`;
    scratchpadWidget.style.top = `${e.clientY - scratchOffsetY}px`;
    scratchpadWidget.style.right = 'auto';
  }

  function onScratchMouseUp() {
    isScratchDragging = false;
    document.removeEventListener('mousemove', onScratchMouseMove);
    document.removeEventListener('mouseup', onScratchMouseUp);
  }

  const calcDisplay = document.getElementById('calc-display');
  const calcBtns = document.querySelectorAll('.calc-btn');
  let calcValue = '0';
  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;

  function updateCalcDisplay() {
    calcDisplay.textContent = calcValue;
  }

  function inputDigit(digit) {
    if (waitingForSecondOperand) {
      calcValue = digit;
      waitingForSecondOperand = false;
    } else {
      calcValue = calcValue === '0' ? digit : calcValue + digit;
    }
  }

  function inputDecimal(dot) {
    if (waitingForSecondOperand) {
      calcValue = '0.';
      waitingForSecondOperand = false;
      return;
    }
    if (!calcValue.includes(dot)) {
      calcValue += dot;
    }
  }

  function handleOperator(nextOperator) {
    const inputValue = parseFloat(calcValue);
    
    if (operator && waitingForSecondOperand) {
      operator = nextOperator;
      return;
    }
    
    if (firstOperand == null && !isNaN(inputValue)) {
      firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      calcValue = `${parseFloat(result.toFixed(7))}`;
      firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
  }

  function calculate(first, second, op) {
    if (op === '+') return first + second;
    if (op === '-') return first - second;
    if (op === '*') return first * second;
    if (op === '/') return first / second;
    return second;
  }

  function resetCalculator() {
    calcValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
  }

  calcBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = e.target.dataset.val;
      if (!val) return;
      
      if (val === 'C' || val === 'CE') {
        resetCalculator();
      } else if (val === '%') {
        calcValue = String(parseFloat(calcValue) / 100);
      } else if (val === '+' || val === '-' || val === '*' || val === '/') {
        handleOperator(val);
      } else if (val === '=') {
        handleOperator(operator);
        operator = null;
      } else if (val === '.') {
        inputDecimal(val);
      } else {
        inputDigit(val);
      }
      updateCalcDisplay();
    });
  });

  // Calculator Keyboard Support
  document.addEventListener('keydown', (e) => {
    if (calcWidget.classList.contains('hidden')) return;
    // Don't trigger if typing in an input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key;
    if (/[0-9]/.test(key)) {
      inputDigit(key);
      updateCalcDisplay();
    } else if (key === '.') {
      inputDecimal(key);
      updateCalcDisplay();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleOperator(key);
      updateCalcDisplay();
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleOperator(operator);
      operator = null;
      updateCalcDisplay();
    } else if (key === 'Escape') {
      resetCalculator();
      updateCalcDisplay();
    } else if (key === 'Backspace') {
      calcValue = calcValue.length > 1 ? calcValue.slice(0, -1) : '0';
      updateCalcDisplay();
    }
  });



  // Utility
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag])
    );
  }

  // --- Exam Countdown ---
  function updateCountdown() {
    // Exam date is September 10, 2026
    const examDate = new Date('2026-09-10T00:00:00');
    const now = new Date();
    
    // Calculate difference in time
    const diffTime = examDate - now;
    let diffDays = 0;
    
    if (diffTime > 0) {
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    const countdownElem = document.getElementById('countdown-days');
    if (countdownElem) {
      countdownElem.textContent = diffDays;
    }
  }
  updateCountdown();

  // --- Anti-Cheat & Anti-Screenshot Logic ---
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      alert("Screenshots are disabled for this portal.");
    }
  });

  document.addEventListener('keydown', (e) => {
    // Prevent Ctrl+S, Ctrl+P, Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
      e.preventDefault();
    }
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J (Dev Tools)
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
      e.preventDefault();
    }
    // Attempt to clear clipboard if Mac screenshot shortcuts are used (Cmd+Shift+3/4/5)
    if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
      navigator.clipboard.writeText('');
      setTimeout(() => alert("Screenshots are disabled for this portal."), 100);
    }
    // Attempt to clear clipboard if Windows Snipping Tool shortcuts are used (Win+Shift+S)
    if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
      navigator.clipboard.writeText('');
      setTimeout(() => alert("Screenshots are disabled for this portal."), 100);
    }
  });

  // Prevent Right-Click (Context Menu)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Prevent Copying and Cutting text
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    alert("Copying text is not permitted during the exam.");
  });
  document.addEventListener('cut', (e) => {
    e.preventDefault();
  });

  // Detect Tab Switching (Visibility API)
  let cheatWarnings = 0;
  document.addEventListener("visibilitychange", () => {
    // Only warn if they are currently taking an exam (exam screen is visible)
    const examScreen = document.getElementById('exam-screen');
    if (document.hidden && examScreen && !examScreen.classList.contains('hidden') && !isPracticeMode) {
      cheatWarnings++;
      alert(`Warning: You have navigated away from the exam tab. This is violation #${cheatWarnings}. Repeated tab switching may result in exam termination.`);
    }
  });

  // Anti-Snipping Tool / Screen Capture (Window Focus Loss)
  // When external tools like Snipping Tool or OS screen capture are activated, the browser window loses focus.
  window.addEventListener('blur', () => {
    const examScreen = document.getElementById('exam-screen');
    if (examScreen && !examScreen.classList.contains('hidden') && !isPracticeMode) {
      // Blur the screen heavily so it cannot be captured
      document.body.classList.add('blur-screen');
    }
  });

  window.addEventListener('focus', () => {
    // Restore the screen when the browser regains focus
    document.body.classList.remove('blur-screen');
  });
});
