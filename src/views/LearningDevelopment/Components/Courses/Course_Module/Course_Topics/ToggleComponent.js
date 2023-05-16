import { useState } from "react"
import { ChevronDown, Edit, Eye, XCircle, Plus } from "react-feather"
import { Card, CardBody, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap"
import apiHelper from "../../../../../Helpers/ApiHelper"
import UpdateTopic from "./UpdateTopic"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ToggleComponent = ({ data, id, CallBack, module_id }) => {
    const Api = apiHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const MySwal = withReactContent(Swal)
    const removeTopic = (uuid, slug, id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Course!",
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
                Api.deleteData(`/courses/details/module/${module_id}/topics/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Topic Deleted!',
                            text: 'Topic is deleted.',
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
                            title: deleteResult.message ? deleteResult.message : 'Topic can not be deleted!',
                            text: 'Topic is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
    const toggleCanvasEnd = () => {
        setupdateCanvasPlacement('end')
        setupdateCanvasOpen(!updateCanvasOpen)
        }
    return (
        <>
            <div className="Topic-single-card" key={id}>
                <Card key={id}>
                    <CardTitle className="mb-0">
                        <div className="row bg-warning">
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                    <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
                                        <h4 color='white' className="text-center">{data.title}</h4>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                    {Api.role === 'admin' && (
                                         <>
                                         <button
                                             className="border-0 no-background float-right"
                                             title="Delete Topic"
                                             onClick={() => removeTopic(data.uuid, data.slug_title, data.id)}
                                             >
                                             <XCircle color="white"/>
                                         </button>
                                         
                                         <button
                                             className="border-0 no-background float-right"
                                             title="Edit Topic"
                                             onClick={toggleCanvasEnd}
                                             >
                                             <Edit color="white"/>
                                         </button>
                                         </>
                                    )}
                                       
                                    </div>
                        </div>
                    </CardTitle>
                    
        
                {toggleThisElement && (
                    <CardBody>
                        <div className="row">
                                    {/* <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Module  
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.course_module_title && data.course_module_title}</span>
                                    </div> */}
                                    <div className="col-md-8">
                                        <Badge color='light-warning'>
                                            Description
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.description && data.description}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Total Hours
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.credit_hours && data.credit_hours}</span>
                                    </div>
                                </div>
                                <hr></hr>
                    </CardBody>
                )
                }
                </Card>
            </div>
            <Offcanvas direction={updateCanvasPlacement} isOpen={updateCanvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
            <OffcanvasBody className=''>
                <UpdateTopic topicData={data} CallBack={CallBack} module_id={module_id}/>
            </OffcanvasBody>
            </Offcanvas>
        </>
    )
  }

export default ToggleComponent