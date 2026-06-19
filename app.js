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
  const calcWidget = document.getElementById('calculator-widget');
  const closeCalc = document.getElementById('close-calc');

  // Results Output
  const reviewListContainer = document.getElementById('review-list');

  // --- State ---
  let currentQuestionIndex = 0;
  let userAnswers = new Array(questions.length).fill(null);
  let timerInterval = null;
  let timeRemaining = 36 * 60; // 36 minutes
  let isHighlightMode = false;
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
    
    const displayName = user.displayName || user.email.split('@')[0];
    
    if(displayNameElem) displayNameElem.textContent = displayName;
    if(profileNameElem) profileNameElem.textContent = displayName;
    if(profileInputElem) profileInputElem.value = displayName;
    
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

  // --- Exam Logic ---
  startExamBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    timeRemaining = 36 * 60;
    startTimer();
    renderQuestion();
    showScreen('exam');
  });

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

  function renderQuestion() {
    const q = questions[currentQuestionIndex];
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

    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
      nextBtn.classList.add('hidden');
      submitExamBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitExamBtn.classList.add('hidden');
    }
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

  submitExamBtn.addEventListener('click', () => {
    if(confirm('Are you sure you want to end the exam?')) {
      finishExam();
    }
  });

  // --- Submission & Detailed Review ---
  async function finishExam() {
    clearInterval(timerInterval);
    
    let correctCount = 0;
    const topicStats = {};
    
    questions.forEach((q, i) => {
      const isCorrect = userAnswers[i] === q.answer;
      if (isCorrect) correctCount++;
      
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
      topicStats[q.topic].total++;
      if (isCorrect) topicStats[q.topic].correct++;
    });
    
    const score = correctCount * 2;
    const totalScore = questions.length * 2;
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    const mockId = `Mock ${userDataCache.history.length + 1}`;
    const attemptData = {
      id: mockId,
      score: score,
      percentage: percentage,
      date: new Date().toLocaleDateString()
    };
    
    // Update local cache
    userDataCache.history.push(attemptData);
    
    Object.keys(topicStats).forEach(topic => {
      if (!userDataCache.topics[topic]) userDataCache.topics[topic] = { correct: 0, total: 0 };
      userDataCache.topics[topic].correct += topicStats[topic].correct;
      userDataCache.topics[topic].total += topicStats[topic].total;
    });
    
    // Save to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        submitExamBtn.textContent = 'Saving...';
        await db.collection("users").doc(user.uid).update({
          history: firebase.firestore.FieldValue.arrayUnion(attemptData),
          topics: userDataCache.topics
        });
      } catch (err) {
        console.error("Failed to save mock exam to Firestore", err);
      } finally {
        submitExamBtn.textContent = 'Submit Exam';
      }
    }
    
    document.getElementById('final-score').textContent = `${score}/${totalScore}`;
    document.getElementById('score-percent').textContent = `${percentage}%`;
    
    reviewListContainer.innerHTML = '';
    questions.forEach((q, i) => {
      const userAnswer = userAnswers[i];
      const isCorrect = userAnswer === q.answer;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'review-item';
      
      const headerDiv = document.createElement('div');
      headerDiv.className = 'review-header';
      headerDiv.innerHTML = `
        <span>Question ${i + 1}</span>
        <span class="${isCorrect ? 'review-correct' : 'review-incorrect'}">
          ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
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
      
      reviewListContainer.appendChild(itemDiv);
    });
    
    showScreen('result');
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

  // --- Highlighter Logic ---
  highlightTool.addEventListener('click', () => {
    isHighlightMode = !isHighlightMode;
    if (isHighlightMode) {
      highlightTool.style.background = '#333';
    } else {
      highlightTool.style.background = 'transparent';
    }
  });

  questionTextContainer.addEventListener('mouseup', () => {
    if (!isHighlightMode) return;
    const selection = window.getSelection();
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'highlighted-text';
      try {
        range.surroundContents(span);
        selection.removeAllRanges();
      } catch (e) {
        console.warn("Could not highlight.", e);
      }
    }
  });

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
});
