import '../App.css'
import SideBarTake from '../components/Sidebar/SideTake';
import TakeReturnDashboard from '../components/TakeReturn';


function HomeTakeReturn() {

    return (
        <div className='container-main'>
            <div className='fixed'>
                <SideBarTake />
            </div>
            <div></div>
            <div className='mld'>
                <TakeReturnDashboard />
            </div>
        </div>
    )
}

export default HomeTakeReturn;
