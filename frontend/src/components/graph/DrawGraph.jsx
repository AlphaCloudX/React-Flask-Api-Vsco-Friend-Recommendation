import {useState} from "react";
import {select, forceSimulation, forceLink, forceManyBody, forceCenter} from 'd3'; // Ensure D3 is installed

/**
 * Handle Drawing The Graph And The Suggestions
 * @param names
 * @constructor
 */
function DrawGraph(names) {

    const [recommendedFriends, setRecommendedFriends] = useState([]);

    return (

        <div className="z-10 flex flex-col items-center">

            <div className="mt-3">
                <button onClick={() => getNodes(names, setRecommendedFriends)}
                        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 focus:outline-none">
                    Draw Graph
                </button>


            </div>

            <div className="flex flex-col items-center mt-6">


                {recommendedFriends.length > 0 &&
                    <h2 className="text-2xl text-center font-bold  mt-6">Visualize Friend Network:</h2>}

                {/* Graph container */}
                <div id="graph" className="mt-2">
                </div>

                {displayRecommendedUsers(recommendedFriends)}


            </div>


        </div>
    )


}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight, // Scroll to the bottom of the page
        behavior: 'smooth', // Smooth scrolling effect
    });
}

function displayRecommendedUsers(recommendedFriends) {

    return (
        <div className="mt-4">

            <div className="flex flex-wrap gap-2">
                {recommendedFriends.length > 0 &&
                    <h3 className="text-xl text-center font-bold py-2">Recommended Friends:</h3>}

                {recommendedFriends.length > 0 && recommendedFriends.map((friend, index) => (
                    <div key={index} className="flex items-center bg-[#7209b7] px-4 py-2 rounded-full">
                        <span>{friend}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Get the nodes from the backend which the graph then draws
 * @param names
 * @returns {*}
 * @constructor
 */
async function getNodes(names, setRecommendedFriends) {
    try {
        const response = await fetch('http://localhost:2000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({users: names}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        var data = await response.json();

        data = JSON.parse(data);

        // Use the received data to update the graph
        // .graph.nodes
        // .graph.links
        drawGraph(data["graph"]["nodes"], data["graph"]["links"]);


        // .recommended_users
        setRecommendedFriends(data["recommended_users"]);

        scrollToBottom();

    } catch (error) {
        console.error("Error fetching nodes:", error);
    }
}


function drawGraph(nodes, links) {


    const graphContainer = select('#graph');
    graphContainer.selectAll('*').remove(); // Clear previous graph

    const width = window.innerWidth;
    const height = nodes.length * 55; // Calculate height based on nodes count

    graphContainer.style('height', `${height}px`);

    const svg = graphContainer
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Set up simulation
    const simulation = forceSimulation(nodes)
        .force('link', forceLink(links).id((d) => d.id).distance(100))
        .force('charge', forceManyBody().strength(-100))
        .force('center', forceCenter(width / 2, height / 2));

    // Draw links (edges)
    const link = svg
        .append('g')
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('stroke-width', (d) => Math.min(d.weight, 5)) // (d) => Math.min(1, d.weight*10) Scale weight for link thickness
        .attr('stroke', '#ccc');

    // Draw nodes (vertices)
    const node = svg
        .append('g')
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .attr('fill', (d) => d.color || '#3498db') // Use color from node data
        .call(
            d3
                .drag()
                .on('start', dragstart)
                .on('drag', dragged)
                .on('end', dragend)
        );

    // Add labels
    svg
        .selectAll('.label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .text((d) => d.id);

    // Simulation functions
    function dragstart(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragend(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Update the positions on each tick
    simulation.on('tick', () => {
        link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y).attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

        svg.selectAll('.label').attr('x', (d) => d.x).attr('y', (d) => d.y);
    });


}


export default DrawGraph;