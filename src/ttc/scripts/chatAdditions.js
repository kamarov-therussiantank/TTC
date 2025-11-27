whenContentInitialized().then(() => {
    const container = document.querySelector('#chat');
    if (!container) return;

    // Create buttons with text symbols instead of images
    const globalMuteButton = createButton('muteGlobalChat-button', '#', 'Mute Global Chat');
    const userMuteButton = createButton('muteUserChat-button', '@', 'Mute User Chat');
    const muteSystemMessagesButton = createButton('muteSystemMessages-button', '<!>', 'Disable System Messages');

    // Container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'muteButtonContainer';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.marginBottom = '5px';

    buttonContainer.appendChild(globalMuteButton);
    buttonContainer.appendChild(userMuteButton);
    buttonContainer.appendChild(muteSystemMessagesButton);
    container.appendChild(buttonContainer);

    // State variables
    let isGlobalMuted = false;
    let isUserMuted = false;
    let isSystemMessagesMuted = false;

    // Save original methods
    const originalAddGlobal = TankTrouble.ChatBox.addGlobalChatMessage;
    const originalAddUser = TankTrouble.ChatBox.addUserChatMessage;
    const originalAddSystem = TankTrouble.ChatBox.addSystemMessage;

    // Create button with text symbol instead of image
    function createButton(className, symbol, title) {
        const button = document.createElement('div');
        button.classList.add(className);
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.userSelect = 'none';
        button.title = title;
        button.textContent = symbol;
        button.style.color = '#333';
        button.style.padding = '5px 10px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '10px';
        button.style.height = '18px';
        return button;
    }

    function toggleMuteGlobalChat() {
        if (isGlobalMuted) {
            TankTrouble.ChatBox.addGlobalChatMessage = originalAddGlobal;
            TankTrouble.ChatBox.addSystemMessage(0, "Global chat unmuted");
            globalMuteButton.style.backgroundColor = '';
            globalMuteButton.style.border = '';
            globalMuteButton.style.color = '#333';
        } else {
            TankTrouble.ChatBox.addGlobalChatMessage = function (from, message, chatMessageId) {
                console.log(String(from) + ": " + message);
            };
            TankTrouble.ChatBox.addSystemMessage(0, "Global chat muted");
            globalMuteButton.style.backgroundColor = '#ff0000';
            globalMuteButton.style.border = '2px solid #c40000ff';
            globalMuteButton.style.color = '#fff';
        }
        isGlobalMuted = !isGlobalMuted;
    }

    function toggleMuteUserChat() {
        if (isUserMuted) {
            TankTrouble.ChatBox.addUserChatMessage = originalAddUser;
            TankTrouble.ChatBox.addSystemMessage(0, "User chat unmuted");
            userMuteButton.style.backgroundColor = '';
            userMuteButton.style.border = '';
            userMuteButton.style.color = '#333';
        } else {
            TankTrouble.ChatBox.addUserChatMessage = function (from, message, chatMessageId) {
                console.log(String(from) + ": " + message);
            };
            TankTrouble.ChatBox.addSystemMessage(0, "User chat muted");
            userMuteButton.style.backgroundColor = '#ff0000';
            userMuteButton.style.border = '2px solid #c40000ff';
            userMuteButton.style.color = '#fff';
        }
        isUserMuted = !isUserMuted;
    }

    function toggleMuteSystemMessages() {
        if (isSystemMessagesMuted) {
            TankTrouble.ChatBox.addSystemMessage = originalAddSystem;
            TankTrouble.ChatBox.addSystemMessage(0, "System messages enabled");
            muteSystemMessagesButton.style.backgroundColor = '';
            muteSystemMessagesButton.style.border = '';
            muteSystemMessagesButton.style.color = '#333';
        } else {
            TankTrouble.ChatBox.addSystemMessage = function (from, message, chatMessageId) {
                console.log(String(from) + ": " + message);
            };
            TankTrouble.ChatBox.addSystemMessage(0, "System messages disabled");
            muteSystemMessagesButton.style.backgroundColor = '#ff0000';
            muteSystemMessagesButton.style.border = '2px solid #c40000ff';
            muteSystemMessagesButton.style.color = '#fff';
        }
        isSystemMessagesMuted = !isSystemMessagesMuted;
    }

    globalMuteButton.addEventListener('click', toggleMuteGlobalChat);
    userMuteButton.addEventListener('click', toggleMuteUserChat);
    muteSystemMessagesButton.addEventListener('click', toggleMuteSystemMessages);

    // Show/hide buttons based on chat visibility
    const chatElement = document.querySelector('#chat');
    function updateButtonVisibility() {
        const visible = chatElement.classList.contains('open');
        buttonContainer.style.display = visible ? 'flex' : 'none';
    }
    updateButtonVisibility();
    setInterval(updateButtonVisibility, 600);
});
