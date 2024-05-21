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

          fetch('/api/message', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: messageText }),
          })
              .then(response => response.json())
              .then(data => {
                  addMessage('GPCbot', data.response, 'bot-message');
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
  }
});
