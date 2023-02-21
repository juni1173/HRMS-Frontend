import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"
import AddModule from "./AddModule"
import ModuleHelper from "../../../../Helpers/LearningDevelopmentHelper/Course-subModules/ModuleHelper"
const index = ({ courseData }) => {
    const Helper = ModuleHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [moduleList, setmoduleList] = useState([])
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchModules = async () => {
        setLoading(true)
        await Helper.fetchModuleList(courseData.uuid, courseData.slug_title).then(result => {
            if (result) {
                setmoduleList(result) 
            } else {
                setmoduleList([])
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return false
    }
  
    const CallBack = () => {
        toggleCanvasEnd()  
        fetchModules()
    }
    useEffect(() => {
        fetchModules()
    }, [])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h2>Modules</h2>
            </div>
            <div className="col-lg-6">
                <button
                    className="btn btn-sm btn-success float-right"
                    title="Add Course"
                    onClick={toggleCanvasEnd}
                    >    
                    <Plus />Add Module
                </button>
            </div>
        </div>
        {!loading ? (
        moduleList.length > 0 ? (
            moduleList.map((d, id) => {
                return <ToggleComponent id={id} data={d} courseData={courseData} key={id} CallBack={fetchModules}/>
              })
          ) : (
            <Card>
                <CardBody>
                    <p>No Modules Data Found...</p>
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
            <AddModule CallBack={CallBack} courseData={courseData}/>
            </OffcanvasBody>
        </Offcanvas>
    </>
    
  )
}

export default index