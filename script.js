// Game state
let gameState = {
    currentQuestion: 0,
    collectedLetters: [],
    startTime: null,
    timerInterval: null,
    answers: {
        q1: false,
        q2: false,
        q3a: false,
        q3b: false,
        q4: false
    },
    player: {
        name: '',
        email: '',
        password: '',
        isStudent: null,
        class: ''
    },
    existingPlayer: false,
    existingPlayerData: null,
    // Lưu progress
    savedProgress: {
        hasProgress: false,
        currentQuestion: 0,
        collectedLetters: [],
        answers: {},
        savedAt: null
    }
};

// Correct answers
const correctAnswers = {
    q1: { x: 125, y: 35 },
    q2: { r: 4.25, h: 8.11, tolerance: 0.1 }, // Allow some tolerance
    q3a: 5,
    q3b: [1, 5],
    q4: [
        "39C7*68C32", "39C7*68C36", "39C32*68C32", "39C32*68C36",
        "68C32*39C7", "68C36*39C7", "68C32*39C32", "68C36*39C32"
    ]
};

// Letter rewards for each question
const letterRewards = {
    q1: "au",
    q2: "ng",
    q3: "ue",
    q4: "ytl"
};

// Toggle class input based on student status
function toggleClassInput(isStudent) {
    const classGroup = document.getElementById('class-group');
    if (isStudent) {
        classGroup.style.display = 'block';
    } else {
        classGroup.style.display = 'none';
        document.getElementById('player-class').value = '';
    }
}

// Submit player info
async function submitPlayerInfo() {
    const name = document.getElementById('player-name').value.trim();
    const email = document.getElementById('player-email').value.trim();
    const password = document.getElementById('player-password').value;
    const isStudentRadio = document.querySelector('input[name="is-student"]:checked');
    const classValue = document.getElementById('player-class').value.trim();
    const errorDiv = document.getElementById('form-error');
    
    // Validation
    if (!name) {
        showFormError('Vui lòng nhập họ và tên!');
        return;
    }
    
    if (!email) {
        showFormError('Vui lòng nhập email!');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormError('Email không hợp lệ!');
        return;
    }
    
    if (!password || password.length < 6) {
        showFormError('Vui lòng nhập mật khẩu (tối thiểu 6 ký tự)!');
        return;
    }
    
    if (!isStudentRadio) {
        showFormError('Vui lòng cho biết bạn có là học sinh trường Chuyên Trần Văn Giàu không!');
        return;
    }
    
    const isStudent = isStudentRadio.value === 'yes';
    
    if (isStudent && !classValue) {
        showFormError('Vui lòng nhập lớp của bạn!');
        return;
    }
    
    // Check localStorage first (for quick offline check)
    let localStorageHasEmail = false;
    if (CONFIG.ENABLE_LOCAL_STORAGE) {
        const existingData = localStorage.getItem('matThuAnhTrang_players');
        if (existingData) {
            const allPlayers = JSON.parse(existingData);
            const existingPlayer = allPlayers.find(p => p.email.toLowerCase() === email.toLowerCase());
            
            if (existingPlayer) {
                localStorageHasEmail = true;
                const savedPassword = (existingPlayer.password || '').trim();
                const inputPassword = password.trim();
                
                if (CONFIG.DEBUG_MODE) {
                    console.log('LocalStorage check - Saved password:', savedPassword, 'Length:', savedPassword.length);
                    console.log('LocalStorage check - Input password:', inputPassword, 'Length:', inputPassword.length);
                }
                
                if (savedPassword && savedPassword !== inputPassword) {
                    showFormError('Email này đã được sử dụng! Mật khẩu không đúng.');
                    return;
                }
                
                if (savedPassword === inputPassword) {
                    showExistingPlayerInfo(existingPlayer);
                    return;
                }
            }
        }
    }
    
    // Check Google Sheets (source of truth)
    if (CONFIG.ENABLE_GOOGLE_SHEETS && CONFIG.GOOGLE_SHEETS_URL) {
        try {
            if (CONFIG.DEBUG_MODE) {
                console.log('🔍 Checking email in Google Sheets...');
            }
            
            const response = await fetch(CONFIG.GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'checkEmail',
                    email: email,
                    password: password
                })
            });
            
            // Note: với no-cors không đọc được response
            // Nên phải rely vào localStorage sync
            console.log('✅ Email check request sent to Google Sheets');
            
        } catch (error) {
            console.warn('⚠️ Could not check Google Sheets:', error);
            // Continue anyway - localStorage check đã pass
        }
    }
    
    // Save player info
    gameState.player.name = name;
    gameState.player.email = email;
    gameState.player.password = password;
    gameState.player.isStudent = isStudent;
    gameState.player.class = classValue;
    
    // Check xem có progress đã lưu không
    checkSavedProgress(email);
    
    // Hide player info section and show story
    document.getElementById('player-info-section').classList.remove('active');
    document.getElementById('story-section').classList.add('active');
    document.getElementById('greeting-name').textContent = name;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Hide error if any
    errorDiv.classList.remove('show');
}

// Show existing player info
function showExistingPlayerInfo(playerData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <h2>⚠️ Email Đã Được Sử Dụng</h2>
            <div style="text-align: left; margin: 20px 0;">
                <p style="margin-bottom: 15px;">Bạn đã hoàn thành trò chơi trước đó với email này!</p>
                <div class="player-summary">
                    <h3 style="color: #ffd700; margin-bottom: 10px;">📋 Thông Tin Đã Lưu:</h3>
                    <p><strong>Họ và Tên:</strong> ${playerData.name}</p>
                    <p><strong>Email:</strong> ${playerData.email}</p>
                    <p><strong>Học sinh TVG:</strong> ${playerData.isStudent ? 'Có' : 'Không'}</p>
                    ${playerData.class && playerData.class !== 'N/A' ? `<p><strong>Lớp:</strong> ${playerData.class}</p>` : ''}
                    <p><strong>Thời gian hoàn thành:</strong> ${playerData.completionTime || 'N/A'}</p>
                    <p><strong>Hoàn thành lúc:</strong> ${playerData.completedAtLocal || 'N/A'}</p>
                </div>
                <p style="margin-top: 15px; color: #ffc107;">💡 Mỗi email chỉ được chơi 1 lần để đảm bảo công bằng!</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Đóng</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Click outside to close
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

function showFormError(message) {
    const errorDiv = document.getElementById('form-error');
    errorDiv.textContent = '⚠️ ' + message;
    errorDiv.classList.add('show');
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Check saved progress
function checkSavedProgress(email) {
    const progressKey = `matThuAnhTrang_progress_${email}`;
    const savedProgressData = localStorage.getItem(progressKey);
    
    if (savedProgressData) {
        const progress = JSON.parse(savedProgressData);
        
        // Check if progress is not completed and not too old (e.g., < 7 days)
        if (!progress.completed) {
            const savedTime = new Date(progress.savedAt);
            const now = new Date();
            const daysDiff = (now - savedTime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff < 7) { // Progress valid for 7 days
                gameState.savedProgress = {
                    hasProgress: true,
                    currentQuestion: progress.currentQuestion,
                    collectedLetters: progress.collectedLetters || [],
                    answers: progress.answers || {},
                    savedAt: progress.savedAt
                };
                
                // Show option to resume
                showResumeOption();
                return;
            }
        }
    }
    
    // No valid progress found - start fresh
    gameState.savedProgress.hasProgress = false;
}

// Show resume option modal
function showResumeOption() {
    const savedTime = new Date(gameState.savedProgress.savedAt);
    const questionNum = gameState.savedProgress.currentQuestion;
    const completedQuestions = questionNum - 1; // Số câu đã hoàn thành
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 550px;">
            <h2>🎮 Tiếp Tục Chơi?</h2>
            <div style="text-align: center; margin: 20px 0;">
                <p style="margin-bottom: 15px; font-size: 18px;">Chúng tôi tìm thấy tiến độ đã lưu của bạn!</p>
                <div class="player-summary" style="text-align: left;">
                    <p><strong>📍 Tiến độ:</strong> Đã hoàn thành ${completedQuestions}/4 câu</p>
                    <p><strong>➡️ Tiếp tục từ:</strong> Câu hỏi ${questionNum}</p>
                    <p><strong>🔤 Chữ cái đã thu thập:</strong> ${gameState.savedProgress.collectedLetters.join(', ').toUpperCase() || 'Chưa có'}</p>
                    <p><strong>⏰ Lưu lúc:</strong> ${savedTime.toLocaleString('vi-VN')}</p>
                    <p><strong>💻 Thiết bị:</strong> Máy tính/thiết bị này</p>
                </div>
                <div style="background: #2c3e50; padding: 12px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #ffc107;">
                    <p style="margin: 0; font-size: 14px; color: #ffc107; text-align: left;">
                        ⚠️ <strong>Lưu ý quan trọng:</strong> Tiến độ chơi được lưu trên thiết bị này. 
                        Nếu bạn đăng nhập trên thiết bị khác, bạn sẽ phải chơi lại từ đầu.
                    </p>
                </div>
                <p style="margin-top: 15px; color: #4CAF50;">💡 Bạn muốn tiếp tục từ đây hay chơi lại từ đầu?</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="resumeGame()" style="background: #4CAF50;">✅ Tiếp Tục</button>
                <button onclick="startFreshGame()" style="background: #2196F3;">🔄 Chơi Lại</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.id = 'resume-modal';
}

// Resume game from saved progress
function resumeGame() {
    const modal = document.getElementById('resume-modal');
    if (modal) modal.remove();
    
    // Restore progress
    gameState.currentQuestion = gameState.savedProgress.currentQuestion;
    gameState.collectedLetters = [...gameState.savedProgress.collectedLetters];
    gameState.answers = { ...gameState.savedProgress.answers };
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🎮 Resuming game from question', gameState.currentQuestion);
        console.log('Collected letters:', gameState.collectedLetters);
    }
    
    // Jump to the current question
    updateLettersDisplay();
    jumpToQuestion(gameState.currentQuestion);
}

// Start fresh game (clear progress)
function startFreshGame() {
    const modal = document.getElementById('resume-modal');
    if (modal) modal.remove();
    
    // Clear saved progress
    const progressKey = `matThuAnhTrang_progress_${gameState.player.email}`;
    localStorage.removeItem(progressKey);
    
    gameState.savedProgress.hasProgress = false;
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🔄 Starting fresh game');
    }
}

// Jump to specific question
function jumpToQuestion(questionNum) {
    // Hide all sections
    document.getElementById('story-section').classList.remove('active');
    for (let i = 1; i <= 4; i++) {
        const section = document.getElementById(`question-${i}`);
        if (section) section.classList.remove('active');
    }
    
    // Show game info
    document.getElementById('game-info').style.display = 'flex';
    
    // Start timer if not started
    if (!gameState.startTime) {
        gameState.startTime = Date.now();
        gameState.timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Show current question
    const targetSection = document.getElementById(`question-${questionNum}`);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Save progress to localStorage
function saveProgress() {
    if (!gameState.player.email) return;
    
    const progressKey = `matThuAnhTrang_progress_${gameState.player.email}`;
    const progressData = {
        email: gameState.player.email,
        currentQuestion: gameState.currentQuestion,
        collectedLetters: [...gameState.collectedLetters],
        answers: { ...gameState.answers },
        savedAt: new Date().toISOString(),
        completed: false
    };
    
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    
    if (CONFIG.DEBUG_MODE) {
        console.log('💾 Progress saved:', progressData);
    }
}

// Clear progress when game completed
function clearProgress() {
    if (!gameState.player.email) return;
    
    const progressKey = `matThuAnhTrang_progress_${gameState.player.email}`;
    const progressData = {
        email: gameState.player.email,
        completed: true,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(progressKey, JSON.stringify(progressData));
    
    if (CONFIG.DEBUG_MODE) {
        console.log('✅ Progress cleared - game completed');
    }
}

function showFormError(message) {
    const errorDiv = document.getElementById('form-error');
    errorDiv.textContent = '⚠️ ' + message;
    errorDiv.classList.add('show');
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Start game
function startGame() {
    document.getElementById('story-section').classList.remove('active');
    document.getElementById('game-info').style.display = 'flex';
    document.getElementById('question-1').classList.add('active');
    
    // Set current question to 1 if starting fresh
    if (gameState.currentQuestion === 0) {
        gameState.currentQuestion = 1;
    }
    
    // Start timer
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 1000);
    
    updateLettersDisplay();
}

// Update timer
function updateTimer() {
    const elapsed = Date.now() - gameState.startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    document.getElementById('timer').textContent = timeString;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// Update letters display
function updateLettersDisplay() {
    const lettersText = gameState.collectedLetters.join(', ').toUpperCase();
    document.getElementById('letters').textContent = lettersText || 'Chưa có';
}

// Check answer for each question
function checkAnswer(questionNum) {
    // Convert to number if string
    if (typeof questionNum === 'string' && questionNum !== '3a' && questionNum !== '3b') {
        questionNum = parseInt(questionNum);
    }
    
    // Handle special case for 3a and 3b with hyphen
    let resultId;
    if (questionNum === '3a') {
        resultId = 'result-3-a';
    } else if (questionNum === '3b') {
        resultId = 'result-3-b';
    } else {
        resultId = `result-${questionNum}`;
    }
    const resultDiv = document.getElementById(resultId);
    
    if (questionNum === 1) {
        const answerInput = document.getElementById('answer-1');
        if (!answerInput) {
            console.error('Input not found: answer-1');
            return;
        }
        
        // Get value and clean it thoroughly
        const answer = answerInput.value.trim().replace(/\s+/g, '');
        
        if (!answer) {
            showIncorrectResult(resultDiv, '⚠️ Vui lòng nhập đáp án!');
            return;
        }
        
        // Remove parentheses if present
        const cleanAnswer = answer.replace(/[()]/g, '');
        const parts = cleanAnswer.split(',').map(p => parseInt(p.trim()));
        
        if (parts.length === 2 && parts[0] === correctAnswers.q1.x && parts[1] === correctAnswers.q1.y) {
            showCorrectResult(resultDiv, 'q1', 1);
        } else {
            showIncorrectResult(resultDiv);
        }
    }
    else if (questionNum === 2) {
        const rInput = document.getElementById('answer-2-r');
        const hInput = document.getElementById('answer-2-h');
        
        if (!rInput || !hInput) {
            console.error('Input not found for question 2');
            return;
        }
        
        const rValue = rInput.value.trim();
        const hValue = hInput.value.trim();
        
        if (!rValue || !hValue) {
            showIncorrectResult(resultDiv, '⚠️ Vui lòng nhập cả r và h!');
            return;
        }
        
        const r = parseFloat(rValue);
        const h = parseFloat(hValue);
        
        // Check if values are close enough to correct answer
        const rCorrect = Math.abs(r - correctAnswers.q2.r) <= correctAnswers.q2.tolerance;
        const hCorrect = Math.abs(h - correctAnswers.q2.h) <= correctAnswers.q2.tolerance;
        
        if (rCorrect && hCorrect) {
            showCorrectResult(resultDiv, 'q2', 2);
        } else {
            showIncorrectResult(resultDiv);
        }
    }
    else if (questionNum === '3a') {
        const answerInput = document.getElementById('answer-3-a');
        if (!answerInput) {
            console.error('Input not found: answer-3-a');
            return;
        }
        
        const answerValue = answerInput.value.trim();
        
        if (!answerValue) {
            showIncorrectResult(resultDiv, '⚠️ Vui lòng nhập đáp án!');
            return;
        }
        
        const answer = parseFloat(answerValue);
        
        if (answer === correctAnswers.q3a) {
            resultDiv.className = 'result correct';
            resultDiv.textContent = '✓ Chính xác! Câu a đúng rồi!';
            gameState.answers.q3a = true;
            checkQuestion3Complete();
        } else {
            showIncorrectResult(resultDiv);
        }
    }
    else if (questionNum === '3b') {
        const answerInput = document.getElementById('answer-3-b');
        if (!answerInput) {
            console.error('Input not found: answer-3-b');
            return;
        }
        
        const answer = answerInput.value.trim();
        
        if (!answer) {
            showIncorrectResult(resultDiv, '⚠️ Vui lòng nhập đáp án!');
            return;
        }
        
        const parts = answer.split(',').map(p => parseFloat(p.trim())).sort((a, b) => a - b);
        
        if (parts.length === 2 && parts[0] === correctAnswers.q3b[0] && parts[1] === correctAnswers.q3b[1]) {
            resultDiv.className = 'result correct';
            resultDiv.textContent = '✓ Chính xác! Câu b đúng rồi!';
            gameState.answers.q3b = true;
            checkQuestion3Complete();
        } else if (parts.length === 1 && correctAnswers.q3b.includes(parts[0])) {
            showIncorrectResult(resultDiv, '❌ Chưa đủ! Còn một giá trị nữa...');
        } else {
            showIncorrectResult(resultDiv);
        }
    }
    else if (questionNum === 4) {
        const answer = document.getElementById('answer-4').value.trim().toUpperCase();
        
        if (correctAnswers.q4.includes(answer)) {
            showCorrectResult(resultDiv, 'q4', 4);
        } else {
            showIncorrectResult(resultDiv);
        }
    }
}

function checkQuestion3Complete() {
    if (gameState.answers.q3a && gameState.answers.q3b && !gameState.answers.q3) {
        gameState.answers.q3 = true;
        gameState.collectedLetters.push(...letterRewards.q3.split(''));
        updateLettersDisplay();
        
        setTimeout(() => {
            document.getElementById('question-3').classList.remove('active');
            document.getElementById('question-4').classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }
}

function showCorrectResult(resultDiv, questionKey, currentQuestionNum) {
    resultDiv.className = 'result correct';
    resultDiv.innerHTML = '✓ Chính xác! Bạn nhận được chữ cái: <strong>' + 
        letterRewards[questionKey].toUpperCase() + '</strong>';
    
    // Đánh dấu câu đã trả lời
    const isFirstTime = !gameState.answers[questionKey];
    gameState.answers[questionKey] = true;
    
    // Chỉ thêm chữ cái nếu chưa có (tránh duplicate)
    if (isFirstTime) {
        gameState.collectedLetters.push(...letterRewards[questionKey].split(''));
        updateLettersDisplay();
    }
    
    // Update current question number to the NEXT question
    if (currentQuestionNum) {
        if (currentQuestionNum < 4) {
            // Vừa hoàn thành câu currentQuestionNum, chuyển sang câu tiếp theo
            gameState.currentQuestion = currentQuestionNum + 1;
        } else {
            // Câu 4 xong rồi, chuyển sang final
            gameState.currentQuestion = 5; // 5 = final section
        }
    }
    
    // Save progress after each correct answer
    saveProgress();
    
    // Tự động chuyển câu (dù đã trả lời trước đó hay không)
    if (currentQuestionNum) {
        setTimeout(() => {
            document.getElementById(`question-${currentQuestionNum}`).classList.remove('active');
            if (currentQuestionNum < 4) {
                document.getElementById(`question-${currentQuestionNum + 1}`).classList.add('active');
            } else {
                document.getElementById('final-section').classList.add('active');
                displayFinalLetters();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }
}

function showIncorrectResult(resultDiv, customMessage = null) {
    resultDiv.className = 'result incorrect';
    resultDiv.textContent = customMessage || '❌ Chưa đúng! Hãy thử lại...';
}

// Display final letters
function displayFinalLetters() {
    const finalLettersDiv = document.getElementById('final-letters');
    finalLettersDiv.textContent = gameState.collectedLetters.join(' ').toUpperCase();
}

// Check final password
function checkFinalPassword() {
    const password = document.getElementById('final-password').value.trim().toUpperCase();
    const resultDiv = document.getElementById('result-final');
    
    if (password === 'NGUYETLAU') {
        // Stop timer
        clearInterval(gameState.timerInterval);
        
        // Calculate final time
        const elapsed = Date.now() - gameState.startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        
        // Show success modal with player info
        document.getElementById('final-time').textContent = timeString;
        document.getElementById('winner-name').textContent = gameState.player.name;
        
        // Display player summary
        const summaryDiv = document.getElementById('player-summary');
        let summaryHTML = '<h3 style="color: #ffd700; margin-bottom: 10px;">📋 Thông Tin Người Chơi:</h3>';
        summaryHTML += `<p><strong>Họ và Tên:</strong> ${gameState.player.name}</p>`;
        summaryHTML += `<p><strong>Email:</strong> ${gameState.player.email}</p>`;
        summaryHTML += `<p><strong>Học sinh Chuyên Trần Văn Giàu:</strong> ${gameState.player.isStudent ? 'Có' : 'Không'}</p>`;
        if (gameState.player.isStudent && gameState.player.class) {
            summaryHTML += `<p><strong>Lớp:</strong> ${gameState.player.class}</p>`;
        }
        summaryDiv.innerHTML = summaryHTML;
        
        document.getElementById('success-modal').style.display = 'block';
        
        // Save player data to file
        const playerData = {
            action: 'saveData',
            name: gameState.player.name,
            email: gameState.player.email,
            password: gameState.player.password,
            isStudent: gameState.player.isStudent,
            school: gameState.player.isStudent ? 'Chuyên Trần Văn Giàu' : 'Khác',
            class: gameState.player.class || 'N/A',
            completionTime: timeString,
            completionTimeSeconds: Math.floor(elapsed / 1000),
            completedAt: new Date().toISOString(),
            completedAtLocal: new Date().toLocaleString('vi-VN', { 
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };
        
        // Log to console
        console.log('Player completed game:', playerData);
        
        // Send to Google Sheets (nếu được bật)
        if (CONFIG.ENABLE_GOOGLE_SHEETS) {
            sendToGoogleSheets(playerData);
        }
        
        // Save to file (download JSON) - nếu được bật
        if (CONFIG.ENABLE_LOCAL_DOWNLOAD) {
            savePlayerDataToFile(playerData);
        }
        
        // Also save to localStorage for backup - nếu được bật
        if (CONFIG.ENABLE_LOCAL_STORAGE) {
            saveToLocalStorage(playerData);
        }
        
        // Clear progress - game completed
        clearProgress();
        
        // Confetti effect
        createConfetti();
    } else {
        resultDiv.className = 'result incorrect';
        resultDiv.textContent = '❌ Mật khẩu chưa đúng! Hãy thử sắp xếp lại các chữ cái...';
    }
}

// Close modal
function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
}

// Send data to Google Sheets
async function sendToGoogleSheets(playerData) {
    if (!CONFIG.GOOGLE_SHEETS_URL) {
        console.warn('⚠️ Google Sheets URL chưa được cấu hình!');
        return;
    }
    
    try {
        if (CONFIG.DEBUG_MODE) {
            console.log('📤 Đang gửi dữ liệu lên Google Sheets...');
        }
        
        const response = await fetch(CONFIG.GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Quan trọng: Google Apps Script yêu cầu no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerData)
        });
        
        // Note: với no-cors, không thể đọc response
        // Nhưng nếu không có lỗi thì dữ liệu đã được gửi thành công
        console.log('✅ Dữ liệu đã được gửi lên Google Sheets!');
        
        if (CONFIG.DEBUG_MODE) {
            console.log('Data sent:', playerData);
        }
        
    } catch (error) {
        console.error('❌ Lỗi khi gửi dữ liệu lên Google Sheets:', error);
        console.warn('💾 Dữ liệu vẫn được lưu trong localStorage và file JSON');
    }
}

// Save player data to file (download as JSON)
function savePlayerDataToFile(playerData) {
    try {
        // Create filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `player_${playerData.name.replace(/\s+/g, '_')}_${timestamp}.json`;
        
        // Convert to JSON string
        const jsonString = JSON.stringify(playerData, null, 2);
        
        // Create blob and download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Dữ liệu đã được lưu vào file:', filename);
    } catch (error) {
        console.error('❌ Lỗi khi lưu file:', error);
    }
}

// Save to localStorage
function saveToLocalStorage(playerData) {
    try {
        // Get existing data
        let allPlayers = [];
        const existingData = localStorage.getItem('matThuAnhTrang_players');
        if (existingData) {
            allPlayers = JSON.parse(existingData);
        }
        
        // Add new player
        allPlayers.push(playerData);
        
        // Save back to localStorage
        localStorage.setItem('matThuAnhTrang_players', JSON.stringify(allPlayers));
        
        console.log('✅ Dữ liệu đã được lưu vào localStorage');
        console.log('📊 Tổng số người chơi đã lưu:', allPlayers.length);
    } catch (error) {
        console.error('❌ Lỗi khi lưu localStorage:', error);
    }
}

// Export all player data from localStorage
function exportAllPlayersData() {
    try {
        const existingData = localStorage.getItem('matThuAnhTrang_players');
        if (!existingData) {
            alert('Chưa có dữ liệu người chơi nào!');
            return;
        }
        
        const allPlayers = JSON.parse(existingData);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `all_players_${timestamp}.json`;
        
        const jsonString = JSON.stringify(allPlayers, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Đã xuất dữ liệu của', allPlayers.length, 'người chơi');
        alert(`Đã xuất dữ liệu của ${allPlayers.length} người chơi!`);
    } catch (error) {
        console.error('❌ Lỗi khi xuất dữ liệu:', error);
        alert('Có lỗi khi xuất dữ liệu!');
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10000';
            confetti.style.opacity = '1';
            
            document.body.appendChild(confetti);
            
            const fallDuration = 2000 + Math.random() * 2000;
            const startTime = Date.now();
            const startLeft = parseFloat(confetti.style.left);
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / fallDuration;
                
                if (progress < 1) {
                    confetti.style.top = (progress * window.innerHeight) + 'px';
                    confetti.style.left = (startLeft + Math.sin(progress * 10) * 50) + 'px';
                    confetti.style.opacity = (1 - progress).toString();
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            animate();
        }, i * 30);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('success-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Handle Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) return;
        
        if (activeSection.id === 'question-1') {
            checkAnswer(1);
        } else if (activeSection.id === 'question-2') {
            checkAnswer(2);
        } else if (activeSection.id === 'question-3') {
            // Check which input is focused
            if (document.activeElement.id === 'answer-3-a') {
                checkAnswer('3a');
            } else if (document.activeElement.id === 'answer-3-b') {
                checkAnswer('3b');
            }
        } else if (activeSection.id === 'question-4') {
            checkAnswer(4);
        } else if (activeSection.id === 'final-section') {
            checkFinalPassword();
        }
    }
});

// Admin Panel Functions
// Toggle admin panel with Ctrl+Shift+A
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdminPanel();
    }
});

function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

function viewPlayersData() {
    try {
        const existingData = localStorage.getItem('matThuAnhTrang_players');
        if (!existingData) {
            alert('Chưa có dữ liệu người chơi nào!');
            return;
        }
        
        const allPlayers = JSON.parse(existingData);
        console.clear();
        console.log('='.repeat(80));
        console.log('📊 DỮ LIỆU TẤT CẢ NGƯỜI CHƠI');
        console.log('='.repeat(80));
        console.log(`Tổng số người chơi: ${allPlayers.length}`);
        console.log('='.repeat(80));
        
        allPlayers.forEach((player, index) => {
            console.log(`\n${index + 1}. ${player.name}`);
            console.log(`   Email: ${player.email}`);
            console.log(`   Trường: ${player.school}`);
            console.log(`   Lớp: ${player.class}`);
            console.log(`   Thời gian: ${player.completionTime} (${player.completionTimeSeconds}s)`);
            console.log(`   Hoàn thành lúc: ${player.completedAtLocal}`);
        });
        
        console.log('\n' + '='.repeat(80));
        alert(`Đã hiển thị dữ liệu của ${allPlayers.length} người chơi trong Console (F12)`);
    } catch (error) {
        console.error('❌ Lỗi khi xem dữ liệu:', error);
        alert('Có lỗi khi xem dữ liệu!');
    }
}

function clearPlayersData() {
    const confirmed = confirm('⚠️ Bạn có chắc muốn XÓA TẤT CẢ dữ liệu người chơi?\n\nHành động này KHÔNG THỂ HOÀN TÁC!');
    if (confirmed) {
        const doubleConfirm = confirm('Xác nhận lần cuối: XÓA TOÀN BỘ dữ liệu?');
        if (doubleConfirm) {
            localStorage.removeItem('matThuAnhTrang_players');
            console.log('✅ Đã xóa toàn bộ dữ liệu người chơi');
            alert('Đã xóa toàn bộ dữ liệu người chơi!');
        }
    }
}

// Clear all input values on page load to prevent cached values
window.addEventListener('DOMContentLoaded', function() {
    // Clear all answer inputs
    const answerInputs = document.querySelectorAll('input[type="text"]:not(#player-name):not(#player-email):not(#player-class):not(#final-password)');
    answerInputs.forEach(input => {
        input.value = '';
    });
    
    if (CONFIG.DEBUG_MODE) {
        console.log('✅ Cleared all answer input values');
    }
});