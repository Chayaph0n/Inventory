import './UpdatePopup.css'

const DeletePopup = ({ IDMLotName, Output_Ring, Supplier_Lot, GoodInsp, Reject_Top, 
                    Reject_Front, Reject_Back, Reject_Bottom, Reject_Multi, Reject_LIV}) => {

    return(
        <div className='bg-container-popup'>
            <div className='flex'>
                <div className='box-container'>
                    <div className="header-box">
                        <h3>COSA CODE</h3>
                    </div>
                    <p>{ IDMLotName }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box">
                        <h3>OUTPUT RING</h3>
                    </div>
                    <p>{ Output_Ring }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box">
                        <h3>SUPPLIER LOT</h3>
                    </div>
                    <p>{ Supplier_Lot }</p>
                </div>
            </div>

            <div className='flex'>
                <div className='box-container-short'>
                    <div className="header-box-good-income">
                        <h3>Good INSP</h3>
                    </div>
                    <p>{ GoodInsp }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box-reject-income">
                        <h3>Reject Top</h3>
                    </div>
                    <p>{ Reject_Top }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box-reject-income">
                        <h3>Reject Front</h3>
                    </div>
                    <p>{ Reject_Front }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box-reject-income">
                        <h3>Reject Back</h3>
                    </div>
                    <p>{ Reject_Back }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box-reject-income">
                        <h3>Reject Bottom</h3>
                    </div>
                    <p>{ Reject_Bottom }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box-reject-income">
                        <h3>Reject Multi</h3>
                    </div>
                    <p>{ Reject_Multi }</p>
                </div>
                <div className='box-container-short'>
                    <div className="header-box-reject-income">
                        <h3>Reject LIV</h3>
                    </div>
                    <p>{ Reject_LIV }</p>
                </div>
            </div>
            <p className='mt black'>Do you want to delete this file?</p>
        </div>
    )
}

export default DeletePopup;