import './BackHome.css'
import { Link } from 'react-router-dom';

const BackHomeButton = ({ cosa_code, output_ring, supplier_lot }) => {

    return(
        <a href="#" >
            <div className="back-btn">
                <Link to={`/home`}>Back</Link>
            </div>
        </a>
    )
}

export default BackHomeButton;