/**
 * Function takes in setter to set the suggested names
 * @param suggestions suggested names
 * @param names current list of names to be looked up
 */
function SearchSuggestions({ suggestions, names, setNames, setUserInput, setSuggestions }) {
    return (
        <div className="mt-2">
            {suggestions.length > 0 && (
                <ul className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg max-h-40 overflow-y-auto shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-lg"
                            onClick={() => handleSuggestionClick(names, setNames, suggestion, setUserInput, setSuggestions)}
                        >
                            <span className="w-full text-left">{suggestion}</span>
                        </li>
                    ))}
                </ul>
            )}

            {names.length > 0 && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {names.map((selected, index) => (
                            <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                                <span>{selected}</span>
                                <button
                                    onClick={() => handleRemoveClick(selected, names, setNames)}
                                    className="ml-2 text-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Function to handle a user clicking on an option
 * @param names
 * @param suggestion
 * @param setUserInput
 * @param setSuggestions
 */
function handleSuggestionClick(names, setNames, suggestion, setUserInput, setSuggestions) {
    addName(names, setNames, suggestion);
    setUserInput("");
    setSuggestions([]); // Clear suggestions to hide the search box
}

/**
 * Function to handle adding a name to the list
 * @param names
 * @param setNames
 * @param suggestion
 */
function addName(names, setNames, suggestion) {
    if (!names.includes(suggestion)) {
        const updatedNames = [...names, suggestion];
        setNames(updatedNames);
    }
}

/**
 * Function to handle removing an element
 * @param suggestion
 * @param names
 * @param setNames
 */
function handleRemoveClick(suggestion, names, setNames) {
    const tempArray = names.filter(name => name.toLowerCase() !== suggestion.toLowerCase());
    setNames(tempArray);
}

export default SearchSuggestions;
