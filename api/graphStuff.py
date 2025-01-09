import json
import networkx as nx


def getGraph(graph, namesToLookup):
    # Store the weights so we can take the weighted value
    totalWeights = {name: 0 for name in namesToLookup}

    # Store the draft names
    completedNames = {}

    # Store all the connected nodes with their weights
    connectedNodes = []

    # Go Through all The names
    for i in namesToLookup:

        # perform BFS
        names = dict(enumerate(nx.bfs_layers(graph, i)))[1]

        # For the names for each bfs for a given name to lookup
        for n in names:

            # Sort them so we can handle mutual friends
            s = sorted([i, n])
            whichGoesFirst = s[0]
            whichGoesLast = s[1]

            # The first 2 if statements are done if 2 inputted usernames both share the same "friends"
            # This way we only store 1 edge and do not create duplicates.
            # Example: Input UserA, UserB and they both share ABC, DEF
            # ABC: USERA
            # But ABC is also for UserB
            # So We will hit the 2nd if statement and do
            # USERB: ABC
            # If we did not add this node yet
            if whichGoesFirst not in completedNames:
                completedNames[whichGoesFirst] = {"destination": whichGoesLast, "weight": graph[n][i]["weight"]}

            # If the first part is already added then we can use the 2nd name, this is to handle making sure we get all the names and not always doing the first in the alphabet
            elif whichGoesLast not in completedNames:
                completedNames[whichGoesLast] = {"destination": whichGoesFirst, "weight": graph[n][i]["weight"]}

            # This handles the actual mutual connection where 2 users are directly related
            else:
                completedNames[whichGoesFirst]["weight"] += graph[n][i]["weight"]

            # Add the total weights so we can take a weighted value after
            totalWeights[i] += graph[n][i]["weight"]

    # Output the weighted weights for each name
    for i in completedNames:
        # Check what name we need the weight value for
        if i in namesToLookup:
            nameToUse = i
        else:
            nameToUse = completedNames[i]["destination"]

        # Append the node
        connectedNodes.append([i, completedNames[i]["destination"], (completedNames[i]["weight"] / totalWeights[nameToUse]) * 100])

    # Get the top connections
    topLinks = sorted(connectedNodes, key=lambda x: x[2], reverse=True)

    counter = 0
    toCountUntil = 25
    UsersToRecommend = 10

    finalLinks = []
    recommendedUsers = []
    finalNodes = {"nodes": {}}

    # Pick 25 potential matches, but only 10 will be recommended
    while counter < toCountUntil and counter < len(topLinks):

        areMutual = False

        # Prevent adding matches that are connected to each other
        if topLinks[counter][0] in namesToLookup and topLinks[counter][1] in namesToLookup:
            toCountUntil += 1
            areMutual = True

        finalLinks.append(
            {"source": topLinks[counter][0], "target": topLinks[counter][1], "weight": topLinks[counter][2]})
        finalNodes["nodes"][topLinks[counter][0]] = "#3a0ca3"
        finalNodes["nodes"][topLinks[counter][1]] = "#3a0ca3"

        # Append only top n amount of connections and also make sure some of those friend sugestions are not existing friends
        if len(recommendedUsers) < UsersToRecommend and not areMutual:
            if topLinks[counter][0] not in namesToLookup:
                recommendedUsers.append(topLinks[counter][0])
                finalNodes["nodes"][topLinks[counter][0]] = "#7209b7"

            else:
                recommendedUsers.append(topLinks[counter][1])
                finalNodes["nodes"][topLinks[counter][1]] = "#7209b7"

        counter += 1

    for i in namesToLookup:
        finalNodes["nodes"][i] = "#f72585"

    final = {'graph': {

        'nodes': [
            {'id': user, 'color': finalNodes['nodes'][user]}  # Default color as #3498db
            for user in finalNodes['nodes']
        ],

        'links': finalLinks

    },

        'recommended_users': recommendedUsers}

    return json.dumps(final)

"""
go through first column to find inputted names

go through second column to find inputted names

[ [name1, name2], weight]
[ [name2, name1], weight]

then each pair in a list that contains a weight and alphabetically sort the names.

[ [name1, name2], weight]
[ [name1, name2], weight]

after sorting

we can then use dictionary magic of nodes:[{start: list[0][0], end: list[0][1], weight:+=list[1]}, ...]

so this will update the dictionary if we come across a duplicate pair otherwise it will add it

we can also make a check that if name1 == name 2 we skip it so we dont add nodes that connect to themselves


we can also consider weighing the node values based on what pool they are in and how many total reposts are there, can do it as a % for example

so 75 reposts from 100 will be a score of 75

1 from 10 will be a score of 10 etc

so we would need to loop through each name, create the 2d array, remove duplicates, add mutual nodes and then we can total everything up to get the weighted value for each connection.

ffa69e   <-- this one is for names the user picked
93e1d8   <-- this one is for recommended names
ddfff7   <-- this one is for all other names
"""
