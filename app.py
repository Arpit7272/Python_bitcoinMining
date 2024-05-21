from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/api/message', methods=['POST'])
def message():
    user_message = request.json.get('message')
    # Simulate a response from the bot
    bot_response = "I'm an AI language model here to assist you! Feel free to ask any questions or share what you’d like help with, and I’ll do my best to provide useful information. 😊"
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
