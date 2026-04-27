const GROQ_API_KEY = "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"; 

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const authModal = document.getElementById('authModal');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    try {
        const response = await fetch("https://groq.com", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: text }]
            })
        });

        const data = await response.json();
        appendMessage(data.choices[0].message.content, 'ai');
    } catch (error) {
        appendMessage("SYSTEM ERROR: Check connection.", 'ai');
    }
}

function appendMessage(content, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    msgDiv.innerText = content;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function toggleModal() {
    authModal.style.display = (authModal.style.display === 'block') ? 'none' : 'block';
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
