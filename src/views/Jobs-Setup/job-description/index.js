import {useState} from 'react'
import {Offcanvas, OffcanvasHeader, OffcanvasBody} from "reactstrap"
import JobWizard from './stepperForm'
import JDList from "./JD-List"
const Job_Description = () => {
  const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [count, setCount] = useState(0)

    const CallBackList = () => {
      setCanvasOpen(false)
      setCount(current => current + 1)
    }
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    
    }
   
  return (
    <div>
       
       <div className="row">
          <div className="col-lg-12">
            <JDList count={count} Canvas={toggleCanvasEnd}/>
          </div>
        </div>

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} Canvas={toggleCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <JobWizard CallBackList={CallBackList}/>
          </OffcanvasBody>
        </Offcanvas>
    </div>
  )
}

export default Job_Description
