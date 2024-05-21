from flask import Flask, render_template, request, Response
import time
import ollama

app = Flask(__name__)

@app.route('/')
def home():
    bot_name = "GPCbot"
    return render_template('index.html', bot_name=bot_name)

@app.route('/chat')
def chat():
    bot_name = "GPCbot"
    return render_template('chat.html', bot_name=bot_name)

def generate_response(user_message):
    stream = ollama.chat(model='your_model_name', messages=[{'role': 'user', 'content': user_message}], stream=True)
    buffer = ""
    for chunk in stream:
        buffer += chunk["message"]["content"]
        while "\n" in buffer:
            line, buffer = buffer.split("\n", 1)
            yield f"data: {line}\n\n"
            time.sleep(0.1)  # Adjust this delay as needed
    if buffer:
        yield f"data: {buffer}\n\n"

@app.route('/api/message', methods=['POST'])
def message():
    user_message = request.json.get('message')
    return Response(generate_response(user_message), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
