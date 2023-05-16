import { useState } from "react"
import { ChevronDown, Edit, Eye, XCircle, Plus } from "react-feather"
import { Card, CardBody, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import UpdateCourse from "./UpdateSession"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Session_Lectures from './Session_Lectures/index'
const ToggleComponent = ({ data, id, CallBack }) => {
    const Api = apiHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const MySwal = withReactContent(Swal)

    const removeSession = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Session!",
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
                Api.deleteData(`/instructors/session/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Session Deleted!',
                            text: 'Session is deleted.',
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
                            title: deleteResult.message ? deleteResult.message : 'Session can not be deleted!',
                            text: 'Session is not deleted.',
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
            <div className="Session-single-card" key={id}>
                <Card key={id}>
                    <CardTitle className="mb-0">
                        <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                    <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">{data.course_title} <br></br> {data.start_date} - {data.end_date}</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        {Api.role === 'admin' && (
                                            <>
                                            <button
                                            className="border-0 no-background float-right"
                                            title="Delete Course"
                                            onClick={() => removeSession(data.id)}
                                            >
                                            <XCircle color="white"/>
                                        </button>
                                        
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Course"
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
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Type  
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.course_session_type_title && data.course_session_type_title}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Start Date / End Date
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.start_date && data.start_date} / {data.end_date && data.end_date}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Duration 
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.duration && data.duration}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                                Total Lectures 
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.total_lectures && data.total_lectures}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Total Students
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.no_of_students && data.no_of_students}</span>
                                    </div>
                                        <div className="col-md-4 pt-2">
                                            <Badge color='light-warning'>
                                                Instructor
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{
                                                data.cs_instructor.length > 0 ? (
                                                    data.cs_instructor.map((insrtuctor) => (
                                                        insrtuctor.instructor_name
                                                    ))
                                                ) : (
                                                    'N/A'
                                                )
                                            }</span>
                                        </div>
                                </div>
                        <div className="row pt-3">
                            <div className="col-lg-12">
                                <Session_Lectures sessionData={data} />
                            </div>
                        </div>
                    </CardBody>
                )
                }
                </Card>
            </div>
            <Offcanvas direction={updateCanvasPlacement} isOpen={updateCanvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
            <OffcanvasBody className=''>
                <UpdateCourse SessionData={data} CallBack={CallBack}/>
            </OffcanvasBody>
            </Offcanvas>
        </>
    )
  }

export default ToggleComponent