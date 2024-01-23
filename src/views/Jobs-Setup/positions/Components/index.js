import { useState } from "react"
import { Offcanvas, OffcanvasHeader, OffcanvasBody} from "reactstrap"
import PositionsList from "./blockComponents/positionsList"
import AddPosition from "./blockComponents/addPosition"
import PositionHelper from "../../../Helpers/PositionHelper"
const PositionIndexComp = () => {
    const Helper = PositionHelper()
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [count, setCount] = useState(1)
    
    // Canvas Panel On and Off Function Call
       
      const CallBack = () => {
        setCanvasOpen(false)
            setCount(current => current + 1)
      }
      
      const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
      

    return (

        <>
        
        {/* Content */}

        <div className="row">
            <div className="col-lg-12">
            <button className='btn btn-primary float-right' onClick={toggleCanvasEnd} >Create Positions</button> 
            <PositionsList count={count} CallBack={CallBack} />
            </div>
        </div>
        
        {/* Canvas Panel Content */}

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <AddPosition CallBack={CallBack}/>
          </OffcanvasBody>
        </Offcanvas>
        </>
    )
}
export default PositionIndexComp