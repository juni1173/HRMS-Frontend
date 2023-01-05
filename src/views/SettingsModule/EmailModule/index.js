import {Fragment, useState} from 'react'
import {Offcanvas, OffcanvasHeader, OffcanvasBody} from "reactstrap"
import CreateEmailTemplate from './EmailComponents/CreateEmailTemplate'
import ListEmailTemplate from './EmailComponents/ListEmailTemplate'

const EmailIndex = () => {
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
    <Fragment>
       
       <div className="row">
          <div className="col-lg-12">
            <ListEmailTemplate count={count} CreateFormToggle={toggleCanvasEnd}/>
          </div>
        </div>

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <CreateEmailTemplate CallBack={CallBackList}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default EmailIndex