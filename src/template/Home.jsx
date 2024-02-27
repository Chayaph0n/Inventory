import '../App.css'
import Dashboard from '../components/Dashboard'
import SideBar from '../components/Sidebar/SideBar'


function Home() {

    return (
        <div className='container-main'>
            <div className='fixed'>
                <SideBar />
            </div>
            <div></div>
            <div className='mld'>
                <Dashboard />
            </div>
        </div>
    )
}

export default Home
