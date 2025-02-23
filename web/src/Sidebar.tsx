import data from './data/data.json'

let Sidebar = () => {
    return <div id="sidebar">
        <li>
        {
            data.map((item) => {
                return <li>{item.title}</li>
            })
        }
        </li>
    </div>
}

export default Sidebar