import { useEffect, useRef, useState } from 'react'
import data from './data/data.json'

let Sidebar = ({ activeVideo, setActiveVideo }: { activeVideo: string, setActiveVideo: (video: string) => void }) => {
    let playlist_name_map = new Map<String, String>([["tymnk", "Things You Might Not Know"], ["bfs", "Built For Science"], ["ap", "Amazing Places"]])
    //selector for playlist
    const [playlist, setPlaylist] = useState("")
    //selector for only unmarked videos (Dev only)
    const [marked, setMarked] = useState(true)
    const cur_video = useRef<HTMLElement>(null)

    //create a copy of data that we can manipulate
    let display_data = data
    if (playlist != "") {
        display_data = display_data.filter((item) => { return item.playlist === playlist })
    }

    //if active video is updateed, scroll the video into view on the sidebar
    useEffect(() => {
        cur_video.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [activeVideo])

    display_data = display_data.filter((item) => { return !(marked && item.marked) })

    return <div id="sidebar" className='roboto-sidebar'>
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
            <select name="marked-select" onChange={(changeEvent) => {
                if (changeEvent.target.value == "true") {
                    setMarked(true)
                } else {
                    setMarked(false)
                }
            }}>
                <option value="">Select marked</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
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
                    <br />
                    <div>
                        Checked: {item.marked ? "yes" : "no"} | Playlist: {playlist_name_map.get(item.playlist)}
                    </div>
                    <br />
                    <button onClick={() => {fetch(`/api/?video_id=${item.videoId}`, {"method": "POST"}).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.error(err))}}>Check</button>
                </div>
            })
        }
    </div>
}

export default Sidebar