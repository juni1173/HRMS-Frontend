import { useState } from "react"
import { ChevronDown, Edit, Eye, XCircle, Plus } from "react-feather"
import { Card, CardBody, CardTitle, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import UpdateCourse from "./UpdateCourse"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Course_Module from './Course_Module/index'
const ToggleComponent = ({ data, id, CallBack }) => {
    // console.warn(data)
    const Api = apiHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const MySwal = withReactContent(Swal)

    const removeCourse = (uuid, slug) => {
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
                Api.deleteData(`/courses/${slug}/${uuid}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Course Deleted!',
                            text: 'Course is deleted.',
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
                            title: 'Course can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Course is not deleted.',
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
            <div className="course-single-card" key={id}>
                <Card key={id}>
                    <CardTitle className="mb-0">
                        <div className="row bg-blue">
                                    <div className="col-lg-2 col-md-2 col-sm-2">
                                    <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                                    </div>
                                    
                                    <div className='col-lg-8 col-md-8 col-sm-8'>
                                        <a href={`/course/detail/${data.slug_title}/${data.uuid}`}>
                                            <h4 color='white' className="text-center">{data.title}</h4>
                                        </a>
                                    </div>
                                    
                                    <div className="col-lg-2 col-md-2 col-sm-2">
                                    {Api.role === 'admin' && (
                                        <>
                                         <button
                                         className="border-0 no-background float-right"
                                         title="Delete Course"
                                         onClick={() => removeCourse(data.uuid, data.slug_title)}
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
                                    <div className="col-md-2">
                                        <Badge color='light-warning'>
                                            Code  
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.code && data.code}</span>
                                    </div>
                                    <div className="col-md-2">
                                        <Badge color='light-warning'>
                                            Subject
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.subject_title && data.subject_title}</span>
                                    </div>
                                    <div className="col-md-2">
                                        <Badge color='light-warning'>
                                            Program
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.program_title && data.program_title}</span>
                                    </div>
                                    <div className="col-md-2">
                                        <Badge color='light-warning'>
                                            Credit Hours  
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.credit_hours && data.credit_hours}</span>
                                    </div>
                                    <div className="col-md-2">
                                        <Badge color='light-warning'>
                                                Mode 
                                        </Badge><br></br>
                                        <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.mode_of_course_title && data.mode_of_course_title}</span>
                                    </div>
                                    <div className="col-md-2">
                                        <Badge color='light-warning'>
                                            Complexity
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.complexity_level_title && data.complexity_level_title}</span>
                                    </div>
                                    <div className="row pt-3">
                                        <div className="col-md-4">
                                            <Badge color='light-warning'>
                                                Skills you will gain
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.skills_you_gain && data.skills_you_gain}</span>
                                        </div>
                                        <div className="col-md-4">
                                            <Badge color='light-warning'>
                                                What you will learn
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.what_will_you_learn && data.what_will_you_learn}</span>
                                        </div>
                                        <div className="col-md-4">
                                            <Badge color='light-warning'>
                                                Offered By
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.offered_by && data.offered_by}</span>
                                        </div>
                                    </div>
                                </div>
                        <div className="row pt-3">
                            <div className="col-lg-12">
                                <Course_Module courseData={data} />
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
                <UpdateCourse CourseData={data} CallBack={CallBack}/>
            </OffcanvasBody>
            </Offcanvas>
        </>
    )
  }

export default ToggleComponent