import {useState} from 'react'
import {Offcanvas, OffcanvasHeader, OffcanvasBody, InputGroup, Input, InputGroupText} from "reactstrap"
import { Search } from 'react-feather'
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
            <div className='row  my-1'>
              <div className='col-lg-6'>
                <div className="col-lg-6">
                  <InputGroup className='input-group-merge mb-2'>
                      <InputGroupText>
                      <Search size={14} />
                      </InputGroupText>
                      <Input placeholder='search...' />
                  </InputGroup>
                </div>
              </div>
              <div className='col-lg-6'>
                <button className='btn btn-primary float-right' onClick={toggleCanvasEnd} >Add Job Description</button> 
              </div>
            </div>
            <JDList count={count}/>
          </div>
        </div>

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="largeCanvas">
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
