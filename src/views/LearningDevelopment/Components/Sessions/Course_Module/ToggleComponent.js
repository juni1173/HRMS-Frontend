import { useState } from "react"
import { ChevronDown, Edit, Eye, XCircle, Plus } from "react-feather"
import { Card, CardBody, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap"
import apiHelper from "../../../../Helpers/ApiHelper"
import UpdateModule from "./UpdateModule"
import Module_Topics from "./Course_Topics/index"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ToggleComponent = ({ data, id, CallBack, courseData }) => {
    const Api = apiHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const MySwal = withReactContent(Swal)
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
    const toggleCanvasEnd = () => {
        setupdateCanvasPlacement('end')
        setupdateCanvasOpen(!updateCanvasOpen)
        }
    return (
        <>
            <div className="Module-single-card" key={id}>
                <Card key={id}>
                    <CardTitle className="mb-0">
                        <div className="row bg-grey">
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                    <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">{data.course_title} - {data.title}</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Delete Module"
                                            onClick={() => removeModule(data.uuid, data.slug_title, data.id)}
                                            >
                                            <XCircle color="white"/>
                                        </button>
                                        
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Module"
                                            onClick={toggleCanvasEnd}
                                            >
                                            <Edit color="white"/>
                                        </button>
                                        
                                    </div>
                        </div>
                    </CardTitle>
                    
        
                {toggleThisElement && (
                    <CardBody>
                        <div className="row">
                            <div className="col-lg-6 border-right">
                                <div className="row">
                                   
                                    <div className="col-md-6">
                                        <Badge color='light-warning'>
                                            What we learn ?
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.what_we_learn && data.what_we_learn}</span>
                                    </div>
                                    <div className="col-md-6">
                                        <Badge color='light-warning'>
                                            Total Hours
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.total_hours && data.total_hours}</span>
                                    </div>
                                    <div className="col-md-12 pt-2">
                                        <Badge color='light-warning'>
                                            Description
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.description && data.description}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <Module_Topics module_id={data.id} />
                                    </div>
                                </div>
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
                <UpdateModule moduleData={data} CallBack={CallBack} courseData={courseData}/>
            </OffcanvasBody>
            </Offcanvas>
        </>
    )
  }

export default ToggleComponent