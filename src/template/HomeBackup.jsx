import Upload from '../components/Upload'
import '../App.css'
import SideBarBackup from '../components/Sidebar/SideBackup';
import Backup from '../components/Backup';




function HomeBackup() {

    return (
        <div className='container-main'>
            <div className='fixed'>
                <SideBarBackup />
            </div>
            <div></div>
            <div className='ml'>
                <Backup />
            </div>
        </div>
    )
}

export default HomeBackup;
