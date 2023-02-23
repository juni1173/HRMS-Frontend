import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddSubject from "./AddSubject"
import SubjectHelper from "../../../Helpers/LearningDevelopmentHelper/SubjectHelper"
import SubjectList from "./SubjectList"
const index = () => {
    const Helper = SubjectHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [subjectList, setSubjectList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchSubjects = async () => {
        setLoading(true)
        await Helper.fetchSubjectList().then(result => {
            if (result) {
                setSubjectList(result)
            } else {
                setSubjectList([])
            }
            
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const CallBack = () => {
        fetchSubjects()
        setCanvasOpen(false)
    }
    useEffect(() => {
        fetchSubjects()
    }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
            </div>
            <div className="col-lg-6">
                <button
                    className="btn btn-sm btn-success float-right"
                    title="Add Subject"
                    onClick={toggleCanvasEnd}
                    >    
                    <Plus />Add Subject
                </button>
            </div>
        </div>
      {!loading ? (
        subjectList.length > 0 ? (
            <>
            <SubjectList data={subjectList} CallBack={CallBack} />
            {/* {subjectList.map((d, id) => {
                return <ToggleComponent id={id} data={d} key={id} CallBack={fetchSubjects}/>
              })} */}
              </>
          ) : (
            <Card>
                <CardBody>
                    <p>No Subjects Data Found...</p>
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
                <AddSubject CallBack={CallBack}/>
            </OffcanvasBody>
        </Offcanvas>
        
    </>
    
  )
}

export default index