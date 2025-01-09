import random

from flask_socketio import emit

from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS

from api.graphStuff import getGraph

import re

app = Flask(__name__)

# Cache for runtime so we only need to load files once

import networkx as nx
import csv

# Create a NetworkX graph
graph = nx.Graph()

# Load the CSV and populate the graph
with open("output.csv") as csvfile:
    reader = csv.reader(csvfile, delimiter=',')

    # Skip header
    next(reader)

    for row in reader:

        # Sort users alphabetically for consistent edge representation
        a, b = sorted(row[0:2])
        c = int(row[2])  # Weight of the connection

        # Skip people reposting own content
        if a == b:
            continue

        if graph.has_edge(a, b):
            graph[a][b]["weight"] += c
        else:
            graph.add_edge(a, b, weight=c)

# Cache the usernames into a list that can be used for recommending
usernames = list(graph.nodes)

# Enable CORS with all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('connect')
def connect():
    # sid is the socket id to identify a client
    print(f'Client connected: {request.sid}')


@socketio.on('disconnect')
def disconnect():
    print(f'Client disconnected {request.sid}')


# Example dummy data
dummy_graph_data = {
    'nodes': [
        {"id": "user1", "color": "#3498db"},
        {"id": "user2", "color": "#3498db"},
        {"id": "user3", "color": "#3498db"},
        {"id": "user4", "color": "#3498db"},
        {"id": "user5", "color": "#3498db"},
        {"id": "user6", "color": "#3498db"},
        {"id": "user7", "color": "#3498db"},
    ],
    'links': [
        {"source": "user1", "target": "user2", "weight": 1},
        {"source": "user1", "target": "user3", "weight": 2},
        {"source": "user2", "target": "user4", "weight": 3},
        {"source": "user3", "target": "user5", "weight": 1},
        {"source": "user4", "target": "user6", "weight": 2},
        {"source": "user5", "target": "user7", "weight": 4},
    ]
}


@app.route('/search', methods=['POST'])
def search():
    data = request.json

    names = data['users']['names']

    usernamesNeeded = {user: 0 for user in names}

    graphData = getGraph(graph, usernamesNeeded)

    return jsonify(graphData)


@socketio.on('typing-in-search-box')
def handle_typing(data):
    """Handle the event when a user is typing in the search box."""

    # print(f"{request.sid} | {data['typed']}")
    suggested = []

    if len(data['typed']) > 2:
        for i in usernames:

            user = re.sub(r'\W+', '', data['typed'].lower())
            backend = re.sub(r'\W+', '', i.lower())

            if user in backend:
                suggested.append(i)

    # You can process the typed data here, such as sending a response or searching a database
    emit('send-suggestions', suggested, broadcast=False)


@socketio.on('random-names-added')
def random_data():
    """Handle the event when a user is typing in the search box."""
    print(f"{request.sid}")

    nums = []
    amountOfAccounts = random.randint(1, 5)

    for i in range(amountOfAccounts):
        nums.append(random.randint(0, 25912))  # Generate random indices within range

    # Select random names based on the generated indices
    names = [usernames[num] for num in nums]

    emit('random-names-to-added', names, broadcast=False)  # Send the selected names to the client


if __name__ == '__main__':
    socketio.run(app, host='localhost', port=2000, allow_unsafe_werkzeug=True)
