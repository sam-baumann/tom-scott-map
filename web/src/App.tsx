import { useState, useEffect, useRef, StrictMode, useMemo } from "react"
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

let VideoData = (data as VideoInfo[]).filter((item) => {return item.geocode?.[0] != 0 || item.geocode?.[1] != 0})

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

    //need to use a memo here, otherwise filtering the data creates bad side effects down the line
    const display_data = useMemo(() => {
        //filter data based on the sidebar selectors
        let ret: VideoInfo[] = []
        if (playlist != "") {
            ret = VideoData.filter((item) => { return item.playlist === playlist })
        } else {
            ret = VideoData
        }
        return ret;
    }, [playlist])


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