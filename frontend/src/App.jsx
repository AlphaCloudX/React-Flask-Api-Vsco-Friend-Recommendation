import {useState} from 'react';
import SearchBox from './components/search/SearchBox.jsx';
import DrawGraph from "./components/graph/DrawGraph.jsx";

function App() {

    // This is the list of names to be used by the graph
    // The graph will make the api call and handle the drawing stuff
    const [names, setNames] = useState([]);

    return (

        <div className="bg-white flex flex-col items-center justify-start">
            {/* Background decorations */}

            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-[120px] opacity-50"></div>
            <div
                className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-300 rounded-full blur-[120px] opacity-50"></div>
            <div
                className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-300 rounded-full blur-[120px] opacity-50"></div>
            <div className="absolute top-10 right-1/3 w-64 h-64 bg-blue-300 rounded-full blur-[120px] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-300 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute top-0 left-0 w-80 h-80 bg-green-300 rounded-full blur-[120px] opacity-50"></div>
            <div
                className="absolute top-2/3 left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-[120px] opacity-50"></div>
            <div
                className="absolute bottom-1/3 right-1/2 w-72 h-72 bg-teal-300 rounded-full blur-[120px] opacity-50"></div>
            <div
                className="absolute top-1/5 right-1/5 w-64 h-64 bg-indigo-300 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-5 left-1/5 w-96 h-96 bg-red-300 rounded-full blur-[120px] opacity-50"></div>
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-amber-300 rounded-full blur-[120px] opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300 rounded-full blur-[120px] opacity-50"></div>


            <div className="relative z-10 mt-60 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900">Friend Recommendation</h1>
                <p className="py-3 text-base sm:text-lg lg:text-xl font-medium text-gray-600">Search for friends or
                    generate random recommendations!</p>
                <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-600">Over 25,000 users!</p>
            </div>

            {/* Handle The Searching Here */}
            <SearchBox names={names} setNames={setNames}/>

            <DrawGraph names={names}/>

            <br></br>
        </div>


    );

}

export default App;