import { Link } from 'react-router-dom';
import './SideBar.css'

function SideBarTake() {

    const userId = localStorage.getItem('userId');

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/'
    }

    return (
        <aside>
            <div class="top">
                <div class="logo">
                    <h2 className='mt'>INVENTORY</h2>
                </div>
            </div>

            <div className="sidebar">
                <div>
                    <Link to="/home">
                        <span class="material-symbols-sharp">Bar_Chart_4_Bars</span>
                        <h3 className='fs'>Dashboard</h3>
                    </Link>
                    <Link to="/upload">
                        <span class="material-symbols-sharp">upload</span>
                        <h3 className='fs'>Upload File</h3>
                    </Link>
                    <Link to="/backup">
                        <span class="material-symbols-sharp">backup</span>
                        <h3 className='fs'>Data Backup</h3>
                    </Link>
                </div>
                <div>
                    <Link>
                        <span class="material-symbols-sharp">account_circle</span>
                        <h3 className='fs'>{userId}</h3>
                    </Link>
                    <a href="" onClick={handleLogout} className='a-mb'>
                        <span class="material-symbols-sharp">logout</span>
                        <h3 className='fs'>Logout</h3>
                    </a>
                </div>
            </div>
        </aside>
    )
}

export default SideBarTake;