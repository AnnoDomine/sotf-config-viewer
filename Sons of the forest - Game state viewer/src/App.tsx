import { useState } from "react";
import "./App.css";
import FileMap from "./components/fileMap/FileMap";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <FileMap />
        </div>
    );
}

export default App;
