import { useState } from "react"
import { Search } from "react-feather"
import { Input, InputGroup, InputGroupText, TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody} from "reactstrap"
import PositionsList from "./blockComponents/positionsList"
import AddPosition from "./blockComponents/addPosition"
const PositionIndexComp = () => {
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [count, setCount] = useState(0)
    
    // Canvas Panel On and Off Function Call
       
      const CallBack = () => {
        // setCanvasOpen(false)
        setCount(current => current + 1)
      }
      const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        CallBack()
      }

    return (

        <>
        
        {/* Content */}

        <div className="row">
            <div className="col-lg-12">
            <button className='btn btn-primary float-right' onClick={toggleCanvasEnd} >Create Positions</button> 
            <PositionsList />
            </div>
        </div>
        
        {/* Canvas Panel Content */}

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <AddPosition  count={count}/>
          </OffcanvasBody>
        </Offcanvas>
        </>
    )
}
export default PositionIndexComp