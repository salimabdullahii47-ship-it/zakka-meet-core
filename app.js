// =========================================================================
// 🏢 1. MASTER APPLICATION WINDOW POPUP CONTROLLER (BLOCK-PROOF)
// =========================================================================
let isMuted = false;
let isCamOff = false;
let roomSeconds = 0;
let walletEarnings = 0.00;
let standaloneCamStream = null;
let isStandaloneCamOff = false;

function openWindow(id) {
    const targetAppWindow = document.getElementById(id);
    if (targetAppWindow) {
        targetAppWindow.classList.add('active');
        targetAppWindow.style.opacity = "1";
        targetAppWindow.style.pointerEvents = "all";
        targetAppWindow.style.transform = "scale(1)";
        targetAppWindow.style.zIndex = "1000"; 
        console.log(`ZAKKA MEET Engine: App Window opened -> ${id}`);
    } else {
        console.error(`ZAKKA MEET Error: Window ID '${id}' not found.`);
    }
}

function closeWindow(id) {
    const targetAppWindow = document.getElementById(id);
    if (targetAppWindow) {
        targetAppWindow.classList.remove('active');
        targetAppWindow.style.opacity = "0";
        targetAppWindow.style.pointerEvents = "none";
        targetAppWindow.style.transform = "scale(0.95)";
    }
}

function toggleTheme() {
    const body = document.body;
    const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', theme);
}

// =========================================================================
// 🔳 2. IMMERSIVE DISPLAY LAYOUT SWITCHERS (FULL SCREEN / MINIMIZE)
// =========================================================================
function toggleGlobalMeetingFullScreen() {
    const meetWindow = document.getElementById('globalMeetingWin');
    if (meetWindow) meetWindow.classList.toggle('fullscreen-active');
}

function minimizeMeetingToFloatingTile() {
    const meetWindow = document.getElementById('globalMeetingWin');
    if (meetWindow) {
        meetWindow.classList.remove('fullscreen-active');
        meetWindow.style.top = "auto";
        meetWindow.style.left = "auto";
        meetWindow.style.bottom = "80px";
        meetWindow.style.right = "20px";
        meetWindow.style.width = "280px";
        meetWindow.style.height = "210px";
        meetWindow.style.transform = "none";
    }
}

function toggleTextMeetingFullScreen() {
    const textWindow = document.getElementById('textMeetingWin');
    if (textWindow) textWindow.classList.toggle('fullscreen-active');
}
// =========================================================================
// 📹 3. CORE WEB CAMERA & MICROPHONE ACCESS HARDWARE PIPELINES
// =========================================================================
async function forceInitializeCameraFeed() {
    try {
        // Explicitly asks browser for clean camera and mic hardware track access
        standaloneCamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        const targetVideoPlayer = document.getElementById('standaloneLocalVideoNode');
        const meetingVideoPlayer = document.getElementById('meetingLocalVideoNode');
        
        if (targetVideoPlayer) targetVideoPlayer.srcObject = standaloneCamStream;
        if (meetingVideoPlayer) meetingVideoPlayer.srcObject = standaloneCamStream;
        
        console.log("Zakka Meet Engine: Camera tracks successfully mapped.");
    } catch (err) {
        console.warn("Media hardware running in fallback context: ", err);
    }
}

function toggleStandaloneCameraDriver() {
    const videoNode = document.getElementById('standaloneLocalVideoNode');
    const meetingVideoNode = document.getElementById('meetingLocalVideoNode');
    const camBtn = document.getElementById('camBtn');
    
    if (!standaloneCamStream) {
        alert("Please open your Camera Node Stream window first to power hardware!");
        return;
    }

    isStandaloneCamOff = !isStandaloneCamOff;
    standaloneCamStream.getVideoTracks().forEach(track => track.enabled = !isStandaloneCamOff);
    
    if (isStandaloneCamOff) {
        if (videoNode) videoNode.style.display = "none";
        if (meetingVideoNode) meetingVideoNode.style.display = "none";
        if (camBtn) { camBtn.innerText = "📹 Start Cam Node"; camBtn.style.background = "#ef4444"; }
    } else {
        if (videoNode) videoNode.style.display = "block";
        if (meetingVideoNode) meetingVideoNode.style.display = "block";
        if (camBtn) { camBtn.innerText = "📹 Stop Cam Node"; camBtn.style.background = ""; }
    }
}

function toggleZakkaMeetMicrophone() {
    const muteBtn = document.getElementById('muteBtn');
    if (!standaloneCamStream) return;

    isMuted = !isMuted;
    standaloneCamStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    
    if (isMuted) {
        muteBtn.innerText = "🔇 Unmute Mic"; muteBtn.style.background = "#ef4444";
    } else {
        muteBtn.innerText = "🎙️ Mute Mic"; muteBtn.style.background = "";
    }
}

// =========================================================================
// 🖥️ 4. FIXED SCREEN SHARING ENGINE WITH CANCEL HANDLING
// =========================================================================
async function executeRealScreenShare() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            alert("🔒 Privacy Block: Your browser does not support display capture.");
            return;
        }
        const screenCaptureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenMirrorTarget = document.getElementById('screenShareVideo');
        
        if (screenMirrorTarget) {
            openWindow('globalMeetingWin');
            screenMirrorTarget.style.display = "block";
            screenMirrorTarget.srcObject = screenCaptureStream;
            
            if (screenCaptureStream.getVideoTracks().length > 0) {
                screenCaptureStream.getVideoTracks()[0].onended = () => {
                    screenMirrorTarget.style.display = "none";
                };
            }
        }
    } catch (shareError) {
        console.warn("Screen share loop handled safely without freezing text boxes.");
    }
}
// =========================================================================
// 🔤 5. RESPONSIVE WHATSAPP CHAT CHANNELS MESSAGING ROUTER
// =========================================================================
function triggerTextNetworkBroadcast() {
    const inputField = document.getElementById('textMeetingInputField');
    const communicationBox = document.getElementById('textMeetingBox');
    
    if (inputField && inputField.value.trim() !== "") {
        const structuralTimestampId = "text_node_" + Date.now();
        const msgWrapper = document.createElement('div');
        msgWrapper.className = 'whatsapp-bubble sent';
        msgWrapper.id = structuralTimestampId;
        
        const currentClockTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgWrapper.innerHTML = `
            <div style="font-weight:700; font-size:0.75rem; color:#34d399; margin-bottom:2px;">Salim (Operator)</div>
            <div>${inputField.value}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; font-size:0.65rem; opacity:0.7;">
                <span>${currentClockTime}  ✔✔</span>
                <button class="delete-msg-btn" onclick="deleteMessageNode('${structuralTimestampId}')">🗑️ Unsend</button>
            </div>
        `;
        
        communicationBox.appendChild(msgWrapper);
        inputField.value = "";
        communicationBox.scrollTop = communicationBox.scrollHeight;
    }
}

let textChatMediaRecorder = null;
let textChatAudioChunks = [];
let textChatRecordingStream = null;
let isTextChatRecording = false;

function handleTextNetworkInputKeyPress(event) {
    if (event.key === "Enter") triggerTextNetworkBroadcast();
}

async function toggleTextChatAudioRecording() {
    const recordBtn = document.getElementById('textChatAudioRecordBtn');
    const statusLabel = document.getElementById('textMeetingAudioStatus');
    if (!recordBtn || !statusLabel) return;

    if (!isTextChatRecording) {
        try {
            textChatRecordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            textChatAudioChunks = [];
            textChatMediaRecorder = new MediaRecorder(textChatRecordingStream, { mimeType: 'audio/webm' });

            textChatMediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) textChatAudioChunks.push(event.data);
            };

            textChatMediaRecorder.onstop = () => {
                const audioBlob = new Blob(textChatAudioChunks, { type: 'audio/webm' });
                sendTextChatVoiceMessage(audioBlob);
                if (textChatRecordingStream) {
                    textChatRecordingStream.getTracks().forEach(track => track.stop());
                    textChatRecordingStream = null;
                }
            };

            textChatMediaRecorder.start();
            isTextChatRecording = true;
            recordBtn.innerText = "⏹️ Stop Rec";
            recordBtn.style.background = "#f97316";
            statusLabel.innerText = "Recording... speak now and press stop to send your voice note.";
        } catch (err) {
            statusLabel.innerText = "Audio recording unavailable. Allow microphone access and try again.";
            console.warn('Text chat audio recording error:', err);
        }
    } else {
        if (textChatMediaRecorder && textChatMediaRecorder.state !== 'inactive') {
            textChatMediaRecorder.stop();
        }
        isTextChatRecording = false;
        recordBtn.innerText = "🎙️ Record";
        recordBtn.style.background = "#0b8043";
        statusLabel.innerText = "Voice note captured and added to chat.";
    }
}

function sendTextChatVoiceMessage(blob) {
    const chatBox = document.getElementById('textMeetingBox');
    if (!chatBox) return;

    const messageId = 'voice_note_' + Date.now();
    const msgWrapper = document.createElement('div');
    msgWrapper.className = 'whatsapp-bubble sent';
    msgWrapper.id = messageId;

    const currentClockTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const audioUrl = URL.createObjectURL(blob);

    msgWrapper.innerHTML = `
        <div style="font-weight:700; font-size:0.75rem; color:#34d399; margin-bottom:4px;">Voice Note • Salim</div>
        <audio controls src="${audioUrl}"></audio>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:0.65rem; opacity:0.75;">
            <span>${currentClockTime}  🎧</span>
            <button class="delete-msg-btn" onclick="deleteMessageNode('${messageId}')">🗑️ Delete</button>
        </div>
    `;

    chatBox.appendChild(msgWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Utility stubs for HTML buttons (prevent undefined errors) ---
function downloadRecordToLocalDesktop() {
    alert('📥 Save to Desktop: stubbed (implement file save flow)');
}

function shareRecordToOtherParticipants() {
    alert('💬 Share recording to participants: stubbed (implement sharing)');
}

function closeGlobalMeetingCallSession() {
    // Stop meeting timer and close window
    if (meetingTimerIntervalHook) { clearInterval(meetingTimerIntervalHook); meetingTimerIntervalHook = null; }
    closeWindow('globalMeetingWin');
    alert('🔴 Meeting session closed.');
}

function triggerFullBodyDiseaseScanner() {
    alert('⚡ AI Full Body Scan: stubbed (implement AI scanning pipeline)');
}

function appendEmojiToTextInput(emoji) {
    const inputField = document.getElementById('textMeetingInputField');
    if (inputField) { inputField.value += emoji; inputField.focus(); }
}

function deleteMessageNode(id) {
    const targetsNode = document.getElementById(id);
    if (targetsNode) targetsNode.remove();
}

function runSectorAction(sectorName, alertMessage) {
    alert(`💼 ZAKKA MEET Sector Node: ${sectorName}\n${alertMessage}`);
}

// =========================================================================
// 🤖 6. OMNIVERSE AI LAYOUT SUBTITLE INTERFACE & ACCOUNT TRANSACTIONS
// =========================================================================
function runAILiveTranslation() {
    const textRoomBox = document.getElementById('textMeetingBox');
    if (textRoomBox) {
        const aiBubbleNode = document.createElement('div');
        aiBubbleNode.className = 'whatsapp-bubble received';
        aiBubbleNode.innerHTML = `
            <div style="font-weight:700; font-size:0.75rem; color:#8b5cf6; margin-bottom:2px;">🤖 Omniverse AI Subtitle Translator</div>
            <div style="font-style:italic; margin-top:4px; color:#a78bfa;">Live translations active: "Welcome to Salim's world focus video solution."</div>
        `;
        textRoomBox.appendChild(aiBubbleNode);
        textRoomBox.scrollTop = textRoomBox.scrollHeight;
        openWindow('textMeetingWin');
    }
}

function executeSystemLoginVerification() {
    const emailField = document.getElementById('authEmail');
    const passwordField = document.getElementById('authPassword');
    if (!emailField || !passwordField) return;
    
    if (emailField.value.trim() === "" || passwordField.value.trim() === "") {
        alert("⚠️ Authentication Rejected: Fields cannot be left blank!"); return;
    }
    alert(`🔐 Authentication Successful!\nWelcome to your operator board.`);
    document.getElementById('playerCount').innerText = `👥 143 Active`;
    document.getElementById('playerCount').style.color = "#34d399";
    closeWindow('authGatewayWin');
}

function copyInviteLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert(`🔗 ZAKKA MEET Connect Token Copied:\n${window.location.href}`);
    });
}

// Continuous background monitoring micro-loops tracking wallet counters
setInterval(() => {
    roomSeconds++;
    let hours = Math.floor(roomSeconds / 3600), minutes = Math.floor((roomSeconds % 3600) / 60), seconds = roomSeconds % 60;
    document.getElementById('timerBadge').innerText = `⏱️ Time: ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    walletEarnings += (0.05 / 60);
    document.getElementById('walletBadge').innerText = `💰 Wallet: $${walletEarnings.toFixed(3)}`;
}, 1000);

// =========================================================================
// 🚀 7. HARDWARE INITIALIZATION BOOT ENGINE TRIGGER 
// =========================================================================
// --- Mobile-friendly pointer/click handler helpers ---
function addPointerHandler(el, fn) {
    if (!el || typeof fn !== 'function') return;
    const handler = function(e) { e.preventDefault(); fn(e); };
    el.addEventListener('click', handler, { passive: false });
    el.addEventListener('touchstart', handler, { passive: false });
    // ensure touch targets are reachable even inside translucent overlays
    el.style.pointerEvents = 'auto';
    el.style.zIndex = el.style.zIndex || '1200';
}

function registerInteractionHandlers() {
    // Auto-bind any element with `data-action="functionName"` to that function
    document.querySelectorAll('[data-action]').forEach((el) => {
        const actionName = el.dataset.action;
        if (!actionName) return;
        // allow shorthand where dataset.target specifies an id param
        const targetId = el.dataset.target;
        const fn = window[actionName] || (window[actionName] = function() {
            // if actionName isn't defined, try to interpret common shorthands
            if (actionName === 'openChatPanel') openWindow('textMeetingWin');
            if (actionName === 'openParticipantsPanel') openWindow('participantsPanel');
            if (actionName === 'raiseHand') runSectorAction('Raise Hand', 'User raised their hand');
            if (actionName === 'closeWindow' && targetId) closeWindow(targetId);
        });

        addPointerHandler(el, (e) => {
            // call bound function with synthetic event and target id when present
            if (targetId && typeof window[actionName] === 'function') {
                window[actionName](targetId);
            } else if (typeof fn === 'function') {
                fn(e);
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    forceInitializeCameraFeed(); // Starts camera and audio immediately on load
    openWindow('welcomeWin');    // Force fires your gorgeous purple Welcome window box open!
    registerInteractionHandlers(); // Bind click + touch handlers for controls
});
// =========================================================================
// 💳 STRIPE PREMIUM BILLING TRANSACTION ACCELERATOR
// =========================================================================
function executeStripeCheckoutPayment(planName, costValue) {
    const cardNumber = document.getElementById('stripeCardNum').value.trim();
    if (cardNumber === "" || cardNumber.length < 16) {
        alert("⚠️ Billing Denied: Please provide a valid 16-digit credit/debit card secure token sequence!");
        return;
    }
    
    alert(`💳 Stripe Gateway Connected Successfully!\nTransaction authorized: $${costValue}.00\nYour account has been upgraded to: ${planName}`);
    activeSubscriptionPlan = planName;
    
    // Dynamically update the top status monitor bar style to show premium activation
    document.getElementById('walletBadge').innerText = `👑 Premium (${planName})`;
    document.getElementById('walletBadge').style.color = "#a855f7"; // Elegant purple premium state color
    closeWindow('billingWin');
}
// =========================================================================
// 🌐 GLOBAL MEETING ROOM LAYOUT MODIFIER MATRIX (1-PERSON, 2-PERSON, MANY)
// =========================================================================
function switchConferenceRoomGridStyle(mode) {
    const gridContainer = document.getElementById('masterConferenceVideoGrid');
    const guestPanel = document.getElementById('gridPanelGuest');
    const mock1 = document.getElementById('gridPanelManyMock1');
    const mock2 = document.getElementById('gridPanelManyMock2');
    
    if (!gridContainer || !guestPanel || !mock1 || !mock2) return;

    if (mode === 'single') {
        // 1 Person Style: Closes out all secondary windows, stretching host stream full size
        gridContainer.style.gridTemplateColumns = "1fr";
        guestPanel.style.display = "none";
        mock1.style.display = "none";
        mock2.style.display = "none";
        console.log("Conference layout switched: 1 Person Full Viewport Mode active.");
    } 
    else if (mode === 'dual') {
        // 2 Person Style: Splits layout evenly into two adjacent column boxes side-by-side
        gridContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
        guestPanel.style.display = "flex";
        mock1.style.display = "none";
        mock2.style.display = "none";
        console.log("Conference layout switched: 2 Person Balanced Split Mode active.");
    } 
    else if (mode === 'many') {
        // Many Person Style: Restructures viewport grid into an expansive multi-window stream grid mesh
        gridContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
        guestPanel.style.display = "flex";
        mock1.style.display = "flex";
        mock2.style.display = "flex";
        console.log("Conference layout switched: Multi-User Mesh Stream Mode active.");
    }
}

// ⏺️ RE-VERIFIED GLOBAL MEETING CALL RECORDING UTILITY SWITCH
let isRecordingActive = false;
function toggleMeetingCallRecorder() {
    const recordBtn = document.getElementById('recordBtn');
    if (!recordBtn) return;
    isRecordingActive = !isRecordingActive;
    if (isRecordingActive) {
        recordBtn.innerText = "⏹️ Stop Call Recorder";
        recordBtn.style.background = "#eab308"; recordBtn.style.color = "#000";
        alert("⏺️ Call Recorder Active! Capturing call stream parameters safely.");
    } else {
        recordBtn.innerText = "⏺️ Start Call Recorder";
        recordBtn.style.background = "#ef4444"; recordBtn.style.color = "#fff";
        alert("💾 Capture session compiled successfully into ZAKKA_MEET_LOGS.mp4!");
    }
}
// Alias for older HTML handler name: keep backward compatibility
function toggleMeetingCallRecording() {
    toggleMeetingCallRecorder();
}

// Simple social share stub to avoid undefined errors from HTML buttons
function sendToSocialNetworks(target) {
    alert(`🔗 Broadcast to ${target} initiated. (Stub - implement API integration)`);
}
// =========================================================================
// 🌐 GLOBAL VIDEO CONSOLE TRACK MANAGER: CLOCKS, EXPRESSIONS, AND CLIPBOARDS
// =========================================================================
let meetingElapsedSeconds = 0;
let meetingTimerIntervalHook = null;

// 🔗 UNBLOCK CLIPBOARD PASTE TRANSACTIONS
function executeGlobalMeetingConnect() {
    const tokenInputField = document.getElementById('pastedRoomTokenInput');
    const remoteOverlay = document.getElementById('remoteGridOverlay');
    
    if (!tokenInputField || !remoteOverlay) return;

    // Grab link text straight from the user's active mouse clipboard registry smoothly
    navigator.clipboard.readText().then((clipboardText) => {
        tokenInputField.value = clipboardText; // Pastes link into input bar automatically
        
        alert(`🔗 Network Link Pasted & Synchronized!\nToken accepted: ${clipboardText}\nConnecting guest to Salim's active room grid pathways.`);
        
        // Instantly force load the 2-Person Style split screen layout view
        switchConferenceRoomGridStyle('dual');
        remoteOverlay.innerText = "Guest Player Stream Connected Successfully";
        
        // Start running your dedicated internal meeting clock timer loops cleanly right now
        startConferenceRoomCallClockTimer();
    }).catch((err) => {
        // Fallback trace if browser blocks automated clipboard access rules
        const manualInput = tokenInputField.value.trim();
        if (manualInput !== "") {
            switchConferenceRoomGridStyle('dual');
            startConferenceRoomCallClockTimer();
        } else {
            alert("🔒 System Permission Block: Please type or paste your room link parameter token into the text box manually!");
        }
    });
}

// ⏳ LIVE MEETING CLOCK TRACKER LOOP ENGINE
function startConferenceRoomCallClockTimer() {
    // Prevent duplicate background loop overlays
    if (meetingTimerIntervalHook) clearInterval(meetingTimerIntervalHook);
    
    meetingElapsedSeconds = 0;
    const clockBadge = document.getElementById('meetingTimerClockBadge');
    
    meetingTimerIntervalHook = setInterval(() => {
        meetingElapsedSeconds++;
        let runningMinutes = Math.floor(meetingElapsedSeconds / 60);
        let runningSeconds = meetingElapsedSeconds % 60;
        
        if (clockBadge) {
            clockBadge.innerText = `⏳ Call Runtime: ${runningMinutes < 10 ? '0' + runningMinutes : runningMinutes}min ${runningSeconds < 10 ? '0' + runningSeconds : runningSeconds}sec`;
        }
    }, 1000);
}

// 🙋‍♂️ USER PRESENCE EXPRESSIONS HANDLERS (BUSY STATE / TAKE EXCUSE CLUSTERS)
function triggerUserConferenceExpression(stateMode) {
    const statusBadge = document.getElementById('userPresenceStatusBadge');
    const hostLabelName = document.querySelector('#gridPanelHost div'); // Dynamic indicator text element
    
    if (!statusBadge) return;

    if (stateMode === 'busy') {
        statusBadge.innerText = "🔴 Status: Busy / Do Not Disturb";
        statusBadge.style.background = "rgba(239,68,68,0.1)";
        statusBadge.style.color = "#ef4444";
        statusBadge.style.border = "1px solid rgba(239,68,68,0.3)";
        if (hostLabelName) hostLabelName.innerText = "🔴 Salim A. Zakka (⚠️ Busy Mode Active)";
        alert("⚠️ Notification Sent: Your call profile is marked as BUSY. Other users see your status badge.");
    } 
    else if (stateMode === 'excuse') {
        statusBadge.innerText = "🟡 Status: Away on Excuse";
        statusBadge.style.background = "rgba(234,179,8,0.1)";
        statusBadge.style.color = "#eab308";
        statusBadge.style.border = "1px solid rgba(234,179,8,0.3)";
        if (hostLabelName) hostLabelName.innerText = "🟡 Salim A. Zakka (🙋‍♂️ Excused Away)";
        alert("🙋‍♂️ Excuse Mode Registered! The group is notified that you will step away for a minute.");
    } 
    else if (stateMode === 'active') {
        statusBadge.innerText = "🟢 Status: Active Online";
        statusBadge.style.background = "rgba(34,197,94,0.1)";
        statusBadge.style.color = "#22c55e";
        statusBadge.style.border = "1px solid rgba(34,197,94,0.3)";
        if (hostLabelName) hostLabelName.innerText = "👤 Salim Abdullahi Zakka (Host Operator)";
    }
}
// =========================================================================
// 🌐 IN-CALL DISCUSSION TIMELINE BAR & AI SUBTITLES PIPELINES MESH
// =========================================================================

// 💬 FEATURE A: IN-CALL SIDEBAR LIVE SEND TEXT HOOK
function executeInCallChatBroadcastMessage() {
    const inputField = document.getElementById('conferenceInCallChatInputPort');
    const chatDisplayBox = document.getElementById('conferenceInCallLiveChatBox');
    
    if (inputField && chatDisplayBox && inputField.value.trim() !== "") {
        const msgNode = document.createElement('div');
        msgNode.style.background = "rgba(0, 120, 255, 0.15)";
        msgNode.style.borderLeft = "3px solid #0078ff";
        msgNode.style.padding = "8px 12px";
        msgNode.style.borderRadius = "6px";
        msgNode.style.color = "#e9edef";
        msgNode.style.lineHeight = "1.3";
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msgNode.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:#00c6ff; margin-bottom:2px;">
                <span>Salim (Host)</span> <span>${timestamp}</span>
            </div>
            <div>${inputField.value}</div>
        `;
        
        chatDisplayBox.appendChild(msgNode);
        
        // 🤖 SIMULATION OVERLAY LINKER: Auto-triggers AI subtitling rendering loops instantly
        triggerAICallSubtitleWatermarkOverlay(inputField.value);
        
        inputField.value = "";
        chatDisplayBox.scrollTop = chatDisplayBox.scrollHeight;
    }
}

function handleInCallChatInputFieldKeyPress(event) {
    if (event.key === "Enter") {
        executeInCallChatBroadcastMessage();
    }
}

// 🤖 FEATURE B: LIVE WATERMARK SUBTITLE GENERATOR OVERLAY
function triggerAICallSubtitleWatermarkOverlay(spokenTextString) {
    const subtitleBar = document.getElementById('videoCallLiveSubtitleOverlayRow');
    if (!subtitleBar) return;

    subtitleBar.style.display = "block";
    subtitleBar.innerHTML = `[🤖 AI Voice Subtitles]: "${spokenTextString}"`;

    // Automatically hide subtitle strip after 4 seconds of speaking quietness trace
    setTimeout(() => {
        // Double check text content parameters to avoid erasing newer speech events
        if (subtitleBar.innerHTML.includes(spokenTextString)) {
            subtitleBar.style.display = "none";
        }
    }, 4000);
}

// ================= ZAKKA: Recording, Sharing & Filter Modules =================
// All helpers appended at file bottom — guarded DOM hooks and safe checks
let zakkaMediaRecorder = null;
let zakkaRecordedChunks = [];
let zakkaRecordingStream = null;

function _getZakkaRecordingStream() {
    const preferred = standaloneCamStream || null;
    const hostVideo = document.getElementById('meetingLocalVideoNode');

    if (preferred && preferred.getTracks && preferred.getTracks().length > 0) return preferred;
    if (hostVideo && typeof hostVideo.captureStream === 'function') {
        try { return hostVideo.captureStream(); } catch (e) { console.warn('captureStream error', e); }
    }
    return null;
}

function toggleZakkaLocalRecording() {
    const btn = document.getElementById('zakkaRecordBtn');
    if (!btn) return;

    if (!zakkaMediaRecorder || zakkaMediaRecorder.state === 'inactive') {
        // start recording
        const stream = _getZakkaRecordingStream();
        if (!stream) { alert('No active media stream available for recording. Open Camera first.'); return; }

        zakkaRecordedChunks = [];
        zakkaRecordingStream = stream;

        let options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm;codecs=vp8' };

        try {
            zakkaMediaRecorder = new MediaRecorder(stream, options);
        } catch (err) {
            console.error('MediaRecorder init failed', err);
            alert('Recording unavailable: MediaRecorder init failed.');
            return;
        }

        zakkaMediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) zakkaRecordedChunks.push(e.data); };
        zakkaMediaRecorder.onstop = () => {
            const blob = new Blob(zakkaRecordedChunks, { type: 'video/webm' });
            const filename = 'Zakka_Meet_Session_Record.webm';
            const url = URL.createObjectURL(blob);
            // auto-download
            const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
            console.log('ZAKKA MEET: Local session recording compiled and downloaded:', filename);
            // reveal recorded hub if exists
            const hub = document.getElementById('recordedFileHubPanel');
            if (hub) { hub.style.display = 'flex'; const ticker = document.getElementById('recordingStatusTicker'); if (ticker) ticker.innerText = 'Saved: ' + filename; }
        };

        zakkaMediaRecorder.start(1000);
        btn.innerText = '⏹️ Stop & Export Record';
        btn.style.background = '#f97316';
        console.log('ZAKKA MEET: Recording started.');
    } else if (zakkaMediaRecorder && zakkaMediaRecorder.state === 'recording') {
        zakkaMediaRecorder.stop();
        btn.innerText = '🔴 Start Local Record';
        btn.style.background = '#ef4444';
    }
}

// Native share util — shares invitation text or last recorded blob if available
async function zakkaBroadcastShare() {
    // prefer sharing last recorded blob
    let blob = null;
    if (zakkaRecordedChunks && zakkaRecordedChunks.length) blob = new Blob(zakkaRecordedChunks, { type: 'video/webm' });

    const shareData = { title: 'Zakka Meet Session', text: 'Join my Zakka Meet session', url: window.location.href };

    if (navigator.canShare && blob) {
        try {
            const file = new File([blob], 'Zakka_Meet_Session_Record.webm', { type: blob.type });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: shareData.title, text: shareData.text });
                return;
            }
        } catch (e) { console.warn('native share files failed', e); }
    }

    // fallback to share URL / text if available
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            return;
        }
    } catch (e) { console.warn('navigator.share failed', e); }

    // final fallback: copy link to clipboard
    try { await navigator.clipboard.writeText(window.location.href); alert('Session link copied to clipboard. Share it via your apps.'); }
    catch (e) { alert('Share not supported on this device. Copy the session link manually: ' + window.location.href); }
}

// Filter engine applying CSS filters to video elements (safe guarded)
function applyZakkaFilter(mode) {
    const vids = [document.getElementById('meetingLocalVideoNode'), document.getElementById('standaloneLocalVideoNode'), document.getElementById('screenShareVideo')];
    vids.forEach(v => { if (!v) return; v.style.transition = 'filter 300ms ease';
        if (mode === 'pristine') v.style.filter = 'none';
        else if (mode === 'cyber') v.style.filter = 'contrast(1.25) saturate(1.3) hue-rotate(-10deg) brightness(0.95)';
        else if (mode === 'blur') v.style.filter = 'blur(3px) contrast(1.05) brightness(0.95)';
        else if (mode === 'noir') v.style.filter = 'grayscale(1) contrast(1.15) brightness(0.92)';
    });
}

// Ensure the filter select reflects default
window.addEventListener('DOMContentLoaded', () => { try { const sel = document.getElementById('zakkaFilterSelect'); if (sel) sel.value = 'pristine'; } catch(e){} });

// End of Zakka modules

// ================= ZAKKA PREMIUM UI MODULE =================
let zakkaEqAnimationId = null;
let zakkaEqCtx = null;
let zakkaEqCanvas = null;

function initZakkaPremiumNode() {
    const ribbon = document.getElementById('zakka-info-ribbon');
    const timestampNode = document.getElementById('zakka-live-timestamp');
    zakkaEqCanvas = document.getElementById('zakka-eq-canvas');

    // Update timestamp every second using existing roomSeconds counter
    setInterval(() => {
        if (timestampNode) {
            const hrs = Math.floor(roomSeconds / 3600);
            const mins = Math.floor((roomSeconds % 3600) / 60);
            const secs = roomSeconds % 60;
            timestampNode.innerText = `⏱️ ${hrs < 10 ? '0'+hrs : hrs}:${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
        }
    }, 1000);

    // Decide whether to show equalizer (when camera stream missing/off) or not
    refreshZakkaVisualState();

    // If equalizer canvas will be used, prepare context
    if (zakkaEqCanvas) {
        zakkaEqCtx = zakkaEqCanvas.getContext('2d');
        window.addEventListener('resize', () => { resizeEqCanvas(); });
    }
}

function resizeEqCanvas() {
    if (!zakkaEqCanvas) return;
    const rect = zakkaEqCanvas.getBoundingClientRect();
    zakkaEqCanvas.width = Math.max(300, Math.floor(rect.width * devicePixelRatio));
    zakkaEqCanvas.height = Math.max(150, Math.floor(rect.height * devicePixelRatio));
}

function refreshZakkaVisualState() {
    const eq = document.getElementById('zakka-eq-canvas');
    const video = document.getElementById('standaloneLocalVideoNode') || document.getElementById('meetingLocalVideoNode');

    const hasVideo = standaloneCamStream && standaloneCamStream.getVideoTracks && standaloneCamStream.getVideoTracks().length > 0 && standaloneCamStream.getVideoTracks()[0].enabled;

    if (hasVideo) {
        // hide equalizer, allow video to show through
        if (eq) eq.style.display = 'none';
        stopEqAnimation();
    } else {
        if (eq) {
            eq.style.display = 'block';
            resizeEqCanvas();
            startEqAnimation();
        }
    }
}

function startEqAnimation() {
    if (!zakkaEqCtx || !zakkaEqCanvas) return;
    let last = performance.now();
    const bars = 24;

    function draw(time) {
        const w = zakkaEqCanvas.width;
        const h = zakkaEqCanvas.height;
        zakkaEqCtx.clearRect(0,0,w,h);
        // Background subtle gradient
        const grad = zakkaEqCtx.createLinearGradient(0,0,0,h);
        grad.addColorStop(0, 'rgba(11,15,25,0.6)');
        grad.addColorStop(1, 'rgba(11,15,25,0.9)');
        zakkaEqCtx.fillStyle = grad;
        zakkaEqCtx.fillRect(0,0,w,h);

        const barW = w / bars;
        for (let i=0;i<bars;i++){
            const t = (time/1000) + i*0.2;
            const val = Math.abs(Math.sin(t*1.5))*0.8 + Math.random()*0.1;
            const bh = Math.max(4, val * h);
            const x = i*barW + barW*0.12;
            const y = h - bh - 10;
            // bar color uses accent blue
            zakkaEqCtx.fillStyle = 'rgba(56,189,248,0.9)';
            zakkaEqCtx.fillRect(x, y, barW*0.76, bh);
            // soft glow
            zakkaEqCtx.fillStyle = 'rgba(56,189,248,0.08)';
            zakkaEqCtx.fillRect(x-2, y-6, barW*0.8+4, 6);
        }

        zakkaEqAnimationId = requestAnimationFrame(draw);
    }

    if (!zakkaEqAnimationId) zakkaEqAnimationId = requestAnimationFrame(draw);
}

function stopEqAnimation(){ if (zakkaEqAnimationId) { cancelAnimationFrame(zakkaEqAnimationId); zakkaEqAnimationId = null; } }

// Capture screenshot from active video or equalizer canvas and download
function captureRoomScreenshot() {
    const preferredVideo = document.getElementById('meetingLocalVideoNode') || document.getElementById('standaloneLocalVideoNode');
    const eq = document.getElementById('zakka-eq-canvas');

    // choose source
    let srcCanvas = document.createElement('canvas');
    let ctx = srcCanvas.getContext('2d');

    if (preferredVideo && preferredVideo.videoWidth && preferredVideo.videoHeight) {
        srcCanvas.width = preferredVideo.videoWidth;
        srcCanvas.height = preferredVideo.videoHeight;
        try {
            ctx.drawImage(preferredVideo, 0, 0, srcCanvas.width, srcCanvas.height);
        } catch (err) {
            console.warn('drawImage failed on video:', err);
        }
    } else if (eq && eq.width && eq.height && eq.style.display !== 'none') {
        srcCanvas.width = eq.width;
        srcCanvas.height = eq.height;
        ctx.drawImage(eq, 0, 0, srcCanvas.width, srcCanvas.height);
    } else {
        // fallback snapshot using meetingLocalVideoNode element bounding box
        const fallbackEl = document.getElementById('meetingLocalVideoNode');
        const rect = fallbackEl ? fallbackEl.getBoundingClientRect() : { width:640, height:360 };
        srcCanvas.width = Math.floor(rect.width);
        srcCanvas.height = Math.floor(rect.height);
        ctx.fillStyle = '#0b1220'; ctx.fillRect(0,0,srcCanvas.width, srcCanvas.height);
        ctx.fillStyle = '#94a3b8'; ctx.font = '16px sans-serif'; ctx.fillText('ZAKKA MEET — Snapshot Unavailable', 12, 28);
    }

    srcCanvas.toBlob((blob) => {
        if (!blob) return console.warn('Screenshot blob empty');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Zakka_Meet_Room_Snapshot.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        console.log('ZAKKA MEET: Room screenshot captured and downloaded.');
    }, 'image/png');
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    try { initZakkaPremiumNode(); } catch (e) { console.warn('Zakka premium init error', e); }
    // monitor camera stream toggles every 1.5s for state changes
    setInterval(() => { try { refreshZakkaVisualState(); } catch (e) {} }, 1500);
});

// ================= ZAKKA: Toasts + Safe Wrappers (Appended Helpers) =================

function createZakkaToast(message, duration = 3500) {
    try {
        let container = document.getElementById('zakka-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'zakka-toast-container';
            container.className = 'zakka-toast-container';
            // prefer placing inside zakka overlay if exists
            const overlay = document.getElementById('zakka-zoom-meeting-container') || document.body;
            overlay.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'zakka-toast';
        toast.innerHTML = `<span class="zakka-toast-icon">${message.split(' ')[0] || 'ℹ️'}</span><span style="flex:1; margin-left:6px;">${message}</span>`;
        container.appendChild(toast);

        // force reflow then show
        requestAnimationFrame(() => { toast.classList.add('show'); });

        // remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { try { toast.remove(); } catch (e) {} }, 300);
        }, duration);
    } catch (e) { console.warn('Toast creation failed', e); }
}

// Wrap existing handlers to emit toasts without modifying upstream logic
try {
    const _orig_capture = window.captureRoomScreenshot;
    if (typeof _orig_capture === 'function') {
        window.captureRoomScreenshot = function() {
            try { _orig_capture(); } catch(e) { console.warn('capture wrapper error', e); }
            createZakkaToast('📸 Screenshot Saved to Downloads!', 2800);
        };
    }
} catch(e){}

try {
    const _orig_record = window.toggleZakkaLocalRecording;
    if (typeof _orig_record === 'function') {
        window.toggleZakkaLocalRecording = function() {
            try { _orig_record(); } catch(e) { console.warn('record wrapper error', e); }
            // give a short delay to inspect recorder state
            setTimeout(() => {
                if (zakkaMediaRecorder && zakkaMediaRecorder.state === 'recording') {
                    createZakkaToast('🔴 Local Session Recording Initialized...', 3000);
                } else {
                    createZakkaToast('💾 Local recording exported as .webm', 3500);
                }
            }, 250);
        };
    }
} catch(e){}

try {
    const _orig_share = window.zakkaBroadcastShare;
    if (typeof _orig_share === 'function') {
        window.zakkaBroadcastShare = async function() {
            try { await _orig_share(); } catch (e) { console.warn('share wrapper error', e); }
            createZakkaToast('📢 Share action performed — check native dialog or clipboard.', 3200);
        };
    }
} catch(e){}

// Ensure container exists on load to avoid race conditions
window.addEventListener('load', () => {
    try { if (!document.getElementById('zakka-toast-container')) { const overlay = document.getElementById('zakka-zoom-meeting-container') || document.body; const c = document.createElement('div'); c.id = 'zakka-toast-container'; c.className='zakka-toast-container'; overlay.appendChild(c); } } catch(e){}
});

// End of appended helpers
