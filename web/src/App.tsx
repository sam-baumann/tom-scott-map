import { useState, useEffect, useRef, StrictMode } from "react"
import MapComponent from "./MapComponent"
import data from "./data/data.json"
import "./style.css"

export interface VideoInfo {
    publishedAt: string;
    title: string;
    videoId: string;
    location: string;
    geocode: [] | [number, number] | null;
    playlist: "ap" | "tymnk" | "bfs";
    marked: boolean;
}

let VideoData = data as VideoInfo[]

let App = () => {
    //active video that is highlighted on the screen
    const [activeVideo, setActiveVideo] = useState("")
    //selector for playlist (updated in sidebar)
    const [playlist, setPlaylist] = useState("")

    const cur_video = useRef<HTMLElement>(null)

    //if active video is updateed, scroll the video into view on the sidebar
    useEffect(() => {
        cur_video.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [activeVideo])

    //create copy of data that we can pass into the children
    let display_data = VideoData;

    //filter data based on the sidebar selectors
    if (playlist != "") {
        display_data = display_data.filter((item) => { return item.playlist === playlist })
    }


    return <div>
        <StrictMode>
            <MapComponent data={display_data} activeVideo={activeVideo} setActiveVideo={setActiveVideo}></MapComponent>
            <div id="sidebar" className='roboto-sidebar'>
                <div className='sticky-selectors'>
                    <select name='playlist-select' onChange={(changeEvent) => {
                        setPlaylist(changeEvent.target.value)
                    }
                    }>
                        <option value="">Playlist</option>
                        <option value="tymnk">Things You Might Not Know</option>
                        <option value="ap">Amazing Places</option>
                        <option value="bfs">Built for Science</option>
                    </select>
                </div>

                {
                    display_data.map((item) => {
                        return <div className={"sidebar-item" + (item.videoId == activeVideo ? " active-video" : "")} onClick={() => setActiveVideo(item.videoId)} ref={(elem) => {
                            if (item.videoId == activeVideo) {
                                cur_video.current = elem
                            }
                        }}>
                            {item.title}
                        </div>
                    })
                }
            </div>
        </StrictMode>
    </div>
}

export default App