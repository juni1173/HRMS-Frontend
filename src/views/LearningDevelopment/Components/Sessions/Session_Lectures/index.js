import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddLecture from "./AddLecture"
import LectureHelper from "../../../../Helpers/LearningDevelopmentHelper/LectureHelper"
import apiHelper from "../../../../Helpers/ApiHelper"
const index = ({ sessionData }) => {
    const Api = apiHelper()
    const Helper = LectureHelper()
    const [loading, setLoading] = useState(false)
    // const [canvasPlacement, setCanvasPlacement] = useState('end')
    // const [canvasOpen, setCanvasOpen] = useState(false)
    const [lecturelist, setlecturelist] = useState([])
    // const toggleCanvasEnd = () => {
    // setCanvasPlacement('end')
    // setCanvasOpen(!canvasOpen)
    // }
    const fetchLectures = async () => {
        setLoading(true)
        await Helper.fetchLectureList(sessionData.id).then(result => {
            if (result) {
                setlecturelist(result) 
            } else {
                setlecturelist([])
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
    }
    const LecturesCreation = async () => {
        setLoading(true)
            await Api.jsonPost(`/instructors/lectures/${sessionData.id}/`, {})
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        fetchLectures()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    
    // const CallBack = () => {
    //     toggleCanvasEnd()  
    //     fetchLectures()
    // }
    useEffect(() => {
        fetchLectures()
    }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h2>Lecture</h2>
            </div>
            {lecturelist.length > 0 ? (
                <span>Lectures Created</span>
            ) : (
                <div className="col-lg-6">
                <button
                    className="btn btn-sm btn-success float-right"
                    title="Add Course"
                    onClick={LecturesCreation}
                    >    
                    <Plus />Create Lectures
                </button>
            </div>
            )}
            
        </div>
        {!loading ? (
        lecturelist.length > 0 ? (
            lecturelist.map((d, id) => {
                return <ToggleComponent id={id} data={d} sessionData={sessionData} key={id} CallBack={fetchLectures}/>
              })
          ) : (
            <Card>
                <CardBody>
                    <p>No Lecture Data Found...</p>
                </CardBody>
            </Card>
          )
      ) : (
        <div className="text-center"> <Spinner/></div>
      )
      }
      {/* <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
            <OffcanvasBody className=''>
            <AddLecture CallBack={CallBack} sessionData={sessionData}/>
            </OffcanvasBody>
        </Offcanvas> */}
    </>
    
  )
}

export default index