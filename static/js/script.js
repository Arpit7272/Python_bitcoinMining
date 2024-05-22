function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messageText = userInput.value.trim();
    if (messageText) {
        addMessage('You', messageText, 'user-message');
        userInput.value = '';
        userInput.style.height = 'auto';

        let botMessageElement = addMessage('GPCbot', '', 'bot-message');
        let contentElement = document.createElement('div');
        contentElement.style.whiteSpace = 'pre-wrap';
        botMessageElement.appendChild(contentElement);

        fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const eventSource = new EventSource('/api/stream');

            eventSource.onmessage = function(event) {
                contentElement.innerHTML += event.data + '\n';
                messages.scrollTop = messages.scrollHeight;
            };

            eventSource.onerror = function(event) {
                console.error('EventSource failed:', event);
                eventSource.close();
            };
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
}

function addMessage(sender, text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = `<span>${sender}</span><div style="white-space: pre-wrap;">${text}</div>`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
    return messageElement;
}

document.getElementById('user-input').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;

    if (this.scrollHeight > 200) {
        this.style.overflowY = 'scroll';
    } else {
        this.style.overflowY = 'hidden';
    }
});
