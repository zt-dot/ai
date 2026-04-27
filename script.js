const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 1. YOUR GROQ CONFIGURATION
const GROQ_API_KEY = "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"; // Get this from https://console.groq.com/keys
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Toggle the Auth Modal
function toggleModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// UI: Add messages to the screen
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', sender);
    msgDiv.innerText = `${sender === 'ai' ? 'SYSTEM' : 'USER'}: ${text}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to bottom
}

// LOGIC: Communicate with Groq
async function getGroqResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Or "mixtral-8x7b-32768"
                messages: [
                    { role: "system", content: "You are Neon AI, a futuristic terminal assistant made by Zeeshan Taluckder. Keep responses concise and technical." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Transmission Error:", error);
        return "ERROR: CONNECTION TO UPLINK LOST.";
    }
}

// UI: Handle user input execution
async function handleExecute() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    addMessage(message, 'user');
    userInput.value = "";
    
    // Show "loading" state
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.classList.add('msg', 'ai');
    loadingDiv.innerText = "SYSTEM: AUTHENTICATING...";
    chatWindow.appendChild(loadingDiv);

    // Get real response
    const aiResponse = await getGroqResponse(message);
    
    // Replace loading text with actual response
    document.getElementById(loadingId).innerText = `SYSTEM: ${aiResponse}`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', handleExecute);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleExecute(); });
