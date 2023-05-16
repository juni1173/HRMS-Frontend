import { useState } from "react"
import { ChevronDown, Edit, XCircle } from "react-feather"
import { Card, CardBody, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, Button, Modal, ModalBody, ModalHeader } from "reactstrap"
import apiHelper from "../../../../Helpers/ApiHelper"
import UpdateLecture from "./UpdateLecture"
import AttendanceComponents from "./LectureAttendance/AttendanceComponents"

// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
const ToggleComponent = ({ data, id, CallBack, sessionData }) => {
    const Api = apiHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const [attendanceData, setAttendanceData] = useState([])
    const [attendanceModal, setattendanceModal] = useState(false)
    const openattendanceModal = (attData) => {
        setAttendanceData(attData)
        setattendanceModal(true)
        } 
    // const MySwal = withReactContent(Swal)
    // const removeLecture = (id) => {
    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: "Do you want to delete the Lecture!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, Delete it!',
    //         customClass: {
    //         confirmButton: 'btn btn-primary',
    //         cancelButton: 'btn btn-danger ms-1'
    //         },
    //         buttonsStyling: false
    //     }).then(function (result) {
    //         if (result.value) {
    //             Api.deleteData(`/instructors/lectures/manage/${id}/`, {method: 'Delete'})
    //             .then((deleteResult) => {
    //                 if (deleteResult.status === 200) {
    //                     MySwal.fire({
    //                         icon: 'success',
    //                         title: 'Lecture Deleted!',
    //                         text: 'Lecture is deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-success'
    //                         }
    //                     }).then(function (result) {
    //                         if (result.isConfirmed) {
    //                             CallBack()
    //                         }
    //                     }) 
    //                 } else {
    //                     MySwal.fire({
    //                         icon: 'error',
    //                         title: deleteResult.message ? deleteResult.message : 'Lecture can not be deleted!',
    //                         text: 'Lecture is not deleted.',
    //                         customClass: {
    //                         confirmButton: 'btn btn-danger'
    //                         }
    //                     })
    //                 }
                            
    //                 })
    //         } 
    //     })
    // }
    const toggleCanvasEnd = () => {
        setupdateCanvasPlacement('end')
        setupdateCanvasOpen(!updateCanvasOpen)
        }
    const attCallBack = () => {
        setattendanceModal(false)
        CallBack()
    }
    const UpdateCallBack = () => {
        setupdateCanvasOpen(!updateCanvasOpen)
        CallBack()
    }
    const StartLecture = async (id) => {
        await Api.jsonPost(`/applicants/trainee/start/lecture/${id}/`, {})
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    
                    openattendanceModal(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
    }
    return (
        <>
            <div className="Lecture-single-card" key={id}>
                <Card key={id}>
                    <CardTitle className="mb-0">
                        <div className={data.status === 4 ? `row bg-green` : `row bg-grey`}>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                    <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 className="text-center text-white">{data.course_title} - {data.title}</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4"> 
                                    {Api.role === 'admin' && (
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Lecture"
                                            onClick={toggleCanvasEnd}
                                            >
                                            <Edit color="white"/>
                                        </button>
                                    )}
                                    </div>
                        </div>
                    </CardTitle>
                    
        
                {toggleThisElement && (
                    <CardBody>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Status
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.status_title ? data.status_title : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Date
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.date ? data.date : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Time
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.start_time ? data.start_time : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Duration
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.duration ? data.duration : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Mode of Instruction
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.mode_of_instruction_title ? data.mode_of_instruction_title : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 pt-2">
                                        <Badge color='light-warning'>
                                            Instructor
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.instructor_name ? data.instructor_name : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-8 pt-2">
                                        <Badge color='light-warning'>
                                            Description
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.description ? data.description : 'N/A'}</span>
                                    </div>

                                    <div className="col-md-4 pt-2">
                                    {Api.role === 'admin' && (
                                        <Button className="btn btn-primary" onClick={() => StartLecture(data.id)}>
                                            {data.is_taken ? (
                                                'Lecture Detail'
                                            ) : (
                                                'Start Lecture'
                                            )}
                                                
                                        </Button>
                                    )}
                                       
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
                <UpdateLecture lectureData={data} CallBack={UpdateCallBack} sessionData={sessionData}/>
            </OffcanvasBody>
            </Offcanvas>
            <Modal isOpen={attendanceModal} toggle={() => setattendanceModal(!attendanceModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setattendanceModal(!attendanceModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <AttendanceComponents data={attendanceData} CallBack={attCallBack}/>
                </ModalBody>
            </Modal>
        </>
    )
  }

export default ToggleComponent