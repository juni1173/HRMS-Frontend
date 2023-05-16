import { useState, useEffect } from "react"
import ToggleComponent from "./ToggleComponent"
import { Plus, XCircle, Edit } from "react-feather"
import { Card, CardBody, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner, Row, Col } from "reactstrap"
import AddModule from "./AddModule"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ModuleHelper from "../../../../Helpers/LearningDevelopmentHelper/Course-subModules/ModuleHelper"
import SideToggle from "./sideToggle"
import apiHelper from "../../../../Helpers/ApiHelper"
const index = ({ courseData }) => {
    const MySwal = withReactContent(Swal)
    const Helper = ModuleHelper()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [moduleList, setmoduleList] = useState([])
    const [sidebarModuleData, setSidebarModuleData] = useState([])
    const [activeTab, setActiveTab] = useState(1)
    const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
    }
    const fetchModules = async () => {
        setLoading(true)
        await Helper.fetchModuleList(courseData.uuid, courseData.slug_title).then(result => {
            if (result) {
                setmoduleList(result) 
                setSidebarModuleData(result[0])
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
    const removeModule = (uuid, slug, id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Module!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/courses/details/${slug}/${uuid}/modules/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Module Deleted!',
                            text: 'Module is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                CallBack()
                            }
                        }) 
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: deleteResult.message ? deleteResult.message : 'Module can not be deleted!',
                            text: 'Module is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
    const getSidebarContent = data => {
        if (data) {
            setActiveTab(data.id)
            setSidebarModuleData(data)
        }
    }
    useEffect(() => {
        fetchModules()
    }, [setmoduleList])
  return (
    <>
        <div className="row mb-1">
            <div className="col-lg-6">
                <h3>Modules</h3>
            </div>
            <div className="col-lg-6">
            {Api.role === 'admin' && (
                 <button
                 className="btn btn-sm btn-success float-right"
                 title="Add Course"
                 onClick={toggleCanvasEnd}
                 >    
                 <Plus />Add Module
             </button>
            )}
            </div>
        </div>
        {!loading ? (
        moduleList.length > 0 ? (
                <Row >
                    <Col md={3} className={`custom-sidebar`}>
                {moduleList.map((d, key) => (
                    <Row  key={key} className={d.id === activeTab && `active`}>
                        <Col md={7} onClick={() => getSidebarContent(d)}>
                            <div className="sidebar-title" >
                            <h4 color='white'>{d.title}</h4>
                            </div>
                        </Col>
                        <Col md={5} className="sidebar-links">
                        {Api.role === 'admin' && (
                            <>
                            <button
                            className="border-0 no-background float-right"
                            title="Delete Module"
                            onClick={() => removeModule(courseData.uuid, d.course_slug_title, d.id)}
                            >
                            <XCircle color="red"/>
                        </button>
                        
                        <button
                            className="border-0 no-background float-right"
                            title="Edit Module"
                            >
                            <Edit color="orange"/>
                        </button>  
                        </>
                        )}
                        </Col>
                        
                    </Row>
                ))}
                </Col>
                <Col md={9}>
                    <SideToggle data={sidebarModuleData} />
                </Col>
                </Row>
           
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
        {/* {!loading ? (
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
      } */}
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