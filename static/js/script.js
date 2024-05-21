document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const messages = document.getElementById('messages');

    sendButton.addEventListener('click', () => {
        const messageText = userInput.value.trim();
        if (messageText) {
            addMessage('You', messageText, 'user-message');
            userInput.value = '';
            userInput.style.height = 'auto';

            let botMessageElement = addMessage('GPCbot', '', 'bot-message');
            let loadingGif = document.createElement('img');
            loadingGif.src = "{{ url_for('static', filename='images/loading.gif') }}";
            loadingGif.alt = "Loading...";
            loadingGif.classList.add('loading-gif');
            botMessageElement.querySelector('p').appendChild(loadingGif);

            const eventSource = new EventSource('/api/message');

            eventSource.onmessage = function(event) {
                loadingGif.remove();  // Remove the loading gif
                botMessageElement.querySelector('p').innerText += event.data;
                messages.scrollTop = messages.scrollHeight;
            };

            eventSource.onerror = function(event) {
                console.error('EventSource failed:', event);
                eventSource.close();
            };

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
            }).catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        }
    });

    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${userInput.scrollHeight}px`;

        if (userInput.scrollHeight > 200) {
            userInput.style.overflowY = 'scroll';
        } else {
            userInput.style.overflowY = 'hidden';
        }
    });

    function addMessage(sender, text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        messageElement.innerHTML = `<span>${sender}</span><p>${text}</p>`;
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
        return messageElement;
    }
});
