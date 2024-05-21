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

user_message = ""

def generate_response():
    global user_message
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
    global user_message
    user_message = request.json.get('message')
    return '', 204  # No content response

@app.route('/api/stream')
def stream():
    return Response(generate_response(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
