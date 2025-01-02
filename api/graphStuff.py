import csv
import json

# Example usage
input_csv = "output.csv"  # Replace with the path to your input CSV file


def getGraph(usernames):
    output = {"links": {}}

    # usernames = {"julianarakoczy": 0, "jasminamilinkovic": 0, "julia-horner": 0}
    listedNames = usernames.keys()

    with open(input_csv) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')

        # Skip header
        next(reader)

        for row in reader:

            # Sort users alphabetically so we can detect users that repost each others content (real friends)
            sortedRow = sorted(row[0:2])

            # Weight value
            sortedRow.append(row[2])

            # user 1, user 2, weight
            a, b, c = str(sortedRow[0]), str(sortedRow[1]), int(sortedRow[2])

            # If a user reposted their own content
            if a == b:
                continue

            # Store the total weights
            if a in listedNames and b in listedNames:
                usernames[a] += c
                usernames[b] += c


            elif a in listedNames:
                usernames[a] += c


            elif b in listedNames:
                usernames[b] += c

            else:
                continue

            # If it already exists as an entry we can just add the weight value
            if a + "-" + b in output["links"]:
                # this implies a mutual friendship so we can amplify it
                output["links"][a + "<->" + b]["weight"] += 2 * (c * c)

            # Otherwise we can create a new entry
            else:
                output["links"][a + "<->" + b] = {"source": a, "target": b, "weight": c}

    topLinks = []

    for i in output["links"]:
        a, b = i.split("<->")

        # Store the total weights
        if a in listedNames:
            nameToLookup = a


        elif b in listedNames:
            nameToLookup = b

        else:
            continue

        # Store the total weight for a user
        totalWeightForUser = usernames[nameToLookup]

        # Store teh old weight for a link that is stored for that user
        oldWeight = output["links"][i]["weight"]

        # Calculate the new weight
        newWeight = (oldWeight / totalWeightForUser) * 100.0
        output["links"][i]["weight"] = newWeight

        topLinks.append([newWeight, i])

    # print(output)
    # print(usernames)
    topLinks = sorted(topLinks, key=lambda x: x[0], reverse=True)

    finalLinks = []
    finalNodes = {"nodes": {}}

    recommendations = {}

    for i in topLinks[:min(len(topLinks), 25)]:
        finalLinks.append(output["links"][i[1]])

        # Store the colour for each node
        finalNodes["nodes"][output["links"][i[1]]["source"]] = "#3a0ca3"
        finalNodes["nodes"][output["links"][i[1]]["target"]] = "#3a0ca3"

    for i in topLinks[:min(len(topLinks), 15)]:
        # Store the colour for each node
        finalNodes["nodes"][output["links"][i[1]]["source"]] = "#7209b7"
        finalNodes["nodes"][output["links"][i[1]]["target"]] = "#7209b7"

        # Store the recommendations
        recommendations[output["links"][i[1]]["source"]] = 0
        recommendations[output["links"][i[1]]["target"]] = 0

    for i in listedNames:
        finalNodes["nodes"][i] = "#f72585"
        recommendations.pop(i)

    final = {'graph': {

        'nodes': [
            {'id': user, 'color': finalNodes['nodes'][user]}  # Default color as #3498db
            for user in finalNodes['nodes']
        ],

        'links': finalLinks

    },

        'recommended_users': list(recommendations.keys())}

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
