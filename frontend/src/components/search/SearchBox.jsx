import {useEffect, useState} from 'react';
import socket from "../../socketConfig.js";
import SearchSuggestions from "./SearchSuggestions.jsx";

function SearchBox({names, setNames}) {

    // This is storing the input the user types
    const [userInput, setUserInput] = useState("");

    // This stores the suggested names to be displayed, these need to be passed into the
    const [suggestedNames, setSuggestedNames] = useState([]);

    useEffect(() => {
        // Listen for suggested names
        const handleSuggestions = (dataSuggestions) => {
            if (dataSuggestions) {
                setSuggestedNames(dataSuggestions);
            }
        };

        socket.on('send-suggestions', handleSuggestions);

        // Listen for random names
        const handleRandomNames = (dataNamesToAdd) => {
            if (dataNamesToAdd) {
                const updatedNames = [...names];
                dataNamesToAdd.forEach((name) => {

                    if (!updatedNames.includes(name)) {
                        updatedNames.push(name);
                    }
                });
                setNames(updatedNames);
            }
        };

        socket.on('random-names-to-added', handleRandomNames);

        // Cleanup listeners on unmount
        return () => {
            socket.off('send-suggestions', handleSuggestions);
            socket.off('random-names-to-added', handleRandomNames);
        };
    }, [names, setNames]);


    return (
        <div className="z-10 w-[70%] max-w-2xl">
            <div className=" mt-6 mx-auto flex items-center space-x-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        className="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Search For Friends..."
                        value={userInput}
                        onChange={(e) => {
                            setUserInput(e.target.value);
                            handleInputChange(e.target.value, setSuggestedNames);
                        }}
                    />
                </div>
                <div className="ml-4">
                    <button
                        onClick={generateRandom}
                        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 focus:outline-none">
                        Random Names
                    </button>
                    <button

                        className="ml-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 focus:outline-none"
                        onClick={() => {
                            clearAll(setUserInput, setNames);
                        }}
                    >
                        Clear All
                    </button>
                </div>

            </div>


            <SearchSuggestions suggestions={suggestedNames} names={names} setNames={setNames}
                               setUserInput={setUserInput} setSuggestions={setSuggestedNames}/>


        </div>

    );


}

/**
 * This function handles when a change in input is detected
 * @param userInput current user input in the text box
 * @param setSuggestions setter method for the suggestions array
 */
function handleInputChange(userInput, setSuggestions) {

    // Poll for updated suggestions
    if (userInput.trim() !== "") {
        socket.emit('typing-in-search-box', {typed: userInput});
    } else {

        // Clear the suggestions box
        setSuggestions([]);
    }

}

/**
 * Function to generate random names from backend
 */
function generateRandom() {
    socket.emit('random-names-added');
}

/**
 * Function to clear all/reset a search query
 * @param setUserInput
 * @param setNames
 */
function clearAll(setUserInput, setNames) {

    console.log("PRESSED")

    setUserInput("");
    setNames([]);

}

export default SearchBox;

