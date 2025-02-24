import { useState } from "react"
import MapComponent from "./MapComponent"
import Sidebar from "./Sidebar"
import "./style.css"

let App = () => {
    const [activeVideo, setActiveVideo] = useState("")

    return <div>
        <MapComponent activeVideo={activeVideo} setActiveVideo={setActiveVideo}></MapComponent>
        <Sidebar activeVideo={activeVideo} setActiveVideo={setActiveVideo}></Sidebar> 
    </div>
}

export default App