import Upload from '../components/Upload'
import '../App.css'
import SideBarUpload from '../components/Sidebar/SideUpload';



function HomeUpload() {

    return (
        <div className='container-main'>
            <div className='fixed'>
                <SideBarUpload />
            </div>
            <div></div>
            <div className='ml'>
                <Upload />
            </div>
        </div>
    )
}

export default HomeUpload;
