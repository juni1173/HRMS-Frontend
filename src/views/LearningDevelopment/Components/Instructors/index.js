import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddInstructor from "./AddInstructor"
import InstructorHelper from "../../../Helpers/LearningDevelopmentHelper/IntructorHelper"
const index = () => {
    const Helper = InstructorHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [InstructorList, setInstructorList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchIntructors = async () => {
      setLoading(true)
      await Helper.fetchInstructorList().then(result => {
          if (result) {
              setInstructorList(result) 
          } else {
              setInstructorList([])
          }
          
      })
      setTimeout(() => {
          setLoading(false)
      }, 1000)
      return false
  }
  
  const CallBack = () => {
      toggleCanvasEnd()  
      fetchIntructors()
  }
  useEffect(() => {
      fetchIntructors()
  }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h2>Instructors</h2>
            </div>
            <div className="col-lg-6">
                <button
                    className="btn btn-sm btn-success float-right"
                    title="Add Program"
                    onClick={toggleCanvasEnd}
                    >    
                    <Plus />Add Instructor
                </button>
            </div>
        </div>
        {!loading ? (
        InstructorList.length > 0 ? (
            InstructorList.map((d, id) => {
                return <ToggleComponent id={id} data={d} key={id} CallBack={fetchIntructors}/>
              })
          ) : (
            <Card>
                <CardBody>
                    <p>No Instructors Data Found...</p>
                </CardBody>
            </Card>
          )
      ) : (
        <div className="text-center"> <Spinner/></div>
      )
      }
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
            <OffcanvasBody className=''>
              <AddInstructor CallBack={CallBack}/>
            </OffcanvasBody>
        </Offcanvas>
    </>
    
  )
}

export default index