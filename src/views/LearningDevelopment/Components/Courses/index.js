import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddCourse from "./AddCourse"
import CourseHelper from "../../../Helpers/LearningDevelopmentHelper/CourseHelper"
import apiHelper from "../../../Helpers/ApiHelper"
const index = () => {
    const Helper = CourseHelper()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [courseList, setCourseList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchCourses = async () => {
        setLoading(true)
        await Helper.fetchCourseList().then(result => {
            if (result) {
                setCourseList(result) 
            } else {
                setCourseList([])
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
    }
  
    const CallBack = () => {
        toggleCanvasEnd()  
        fetchCourses()
    }
    useEffect(() => {
        fetchCourses()
    }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h2>Courses</h2>
            </div>
            <div className="col-lg-6">
            {Api.role === 'admin' && (
                <button
                className="btn btn-sm btn-success float-right"
                title="Add Course"
                onClick={toggleCanvasEnd}
                >    
                <Plus />Add Course
            </button>
            )}
                
            </div>
        </div>
        {!loading ? (
        courseList.length > 0 ? (
            courseList.map((d, id) => {
                return <ToggleComponent id={id} data={d} key={id} CallBack={fetchCourses}/>
              })
          ) : (
            <Card>
                <CardBody>
                    <p>No Courses Data Found...</p>
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
            <AddCourse CallBack={CallBack}/>
            </OffcanvasBody>
        </Offcanvas>
    </>
    
  )
}

export default index