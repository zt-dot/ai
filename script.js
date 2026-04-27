const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 1. CONFIGURATION
const GROQ_API_KEY = "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"; 
const API_URL = "https://groq.com";

// UI: Modal Toggle
function toggleModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// UI: Add message blocks
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', sender);
    msgDiv.innerText = `${sender === 'ai' ? 'SYSTEM' : 'USER'}: ${text}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// LOGIC: Groq API Call
async function getGroqResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are Neon AI, a futuristic terminal assistant made by Zeeshan Taluckder." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content; // Fixed: added [0] for the array index
    } catch (error) {
        console.error("Transmission Error:", error);
        return "ERROR: CONNECTION TO UPLINK LOST.";
    }
}

// UI: Handle Input
async function handleExecute() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = "";
    
    // Create loading indicator
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.classList.add('msg', 'ai');
    loadingDiv.innerText = "SYSTEM: AUTHENTICATING...";
    chatWindow.appendChild(loadingDiv);

    const aiResponse = await getGroqResponse(message);
    
    // Update loading indicator with response
    document.getElementById(loadingId).innerText = `SYSTEM: ${aiResponse}`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Listeners
sendBtn.addEventListener('click', handleExecute);
userInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') handleExecute(); 
});
