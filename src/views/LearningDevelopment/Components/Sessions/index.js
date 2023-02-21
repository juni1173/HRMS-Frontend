import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddSession from "./AddSession"
import apiHelper from "../../../Helpers/ApiHelper"
import '@styles/react/libs/flatpickr/flatpickr.scss'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [sessionList, setsessionList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchSessions = async () => {
        setLoading(true)
       await Api.get('/instructors/session/').then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    console.warn(final)
                    // return false
                    setsessionList(result.data) 
                } else {
                    setsessionList([])
                    Api.Toast('error', result.message)
                }
            } else {
                setsessionList([])
                Api.Toast('error', result.message)
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
    }
  
    const CallBack = () => {
        toggleCanvasEnd()  
        fetchSessions()
    }
    useEffect(() => {
        fetchSessions()
    }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h2>Session</h2>
            </div>
            <div className="col-lg-6">
                <button
                    className="btn btn-sm btn-success float-right"
                    title="Add Course"
                    onClick={toggleCanvasEnd}
                    >    
                    <Plus />Add Session
                </button>
            </div>
        </div>
        {!loading ? (
        Object.values(sessionList).length > 0 ? (
            sessionList.map((d, id) => {
                return <ToggleComponent id={id} data={d} key={id} CallBack={fetchSessions}/>
              })
          ) : (
            <Card>
                <CardBody>
                    <p>No Session Data Found...</p>
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
            <AddSession CallBack={CallBack}/>
            </OffcanvasBody>
        </Offcanvas>
    </>
    
  )
}

export default index