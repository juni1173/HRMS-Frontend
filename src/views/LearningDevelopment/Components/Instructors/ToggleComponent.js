import { useState } from "react"
import { ChevronDown, Edit, XCircle } from "react-feather"
import { Card, CardBody, CardTitle, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import UpdateInstructor from "./UpdateInstructor"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ToggleComponent = ({ data, id, CallBack }) => {
    const Api = apiHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const MySwal = withReactContent(Swal)
    const removeInstructor = (uuid, slug) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Instructor!",
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
                Api.deleteData(`/instructors/${slug}/${uuid}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Instructor Deleted!',
                            text: 'Instructor is deleted.',
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
                            title: deleteResult.message ? deleteResult.message : 'Instructor can not be deleted!',
                            text: 'Instructor is not deleted.',
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
            <div className="instructor-single-card" key={id}>
            <Card>
            <CardTitle className="mb-0">
                <div className="row bg-blue">
                            <div className="col-lg-4 col-md-4 col-sm-4">
                            <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-4'>
                                <h4 color='white' className="text-center">{data.name}</h4>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <button
                                    className="border-0 no-background float-right"
                                    title="Delete Subject"
                                    onClick={() => removeInstructor(data.uuid, data.slug_name)}
                                    >
                                    <XCircle color="white"/>
                                </button>
                                
                                <button
                                    className="border-0 no-background float-right"
                                    title="Edit Subject"
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
                    {/* <div className="col-lg-6">
                        <b>Organization</b> <br/>
                        {data.organization_title}
                    </div> */}
                    <div className="col-lg-12">
                        <b>Title</b> <br/>
                        {data.title ? data.title : 'N/A'}
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
                <UpdateInstructor instructorData={data} CallBack={CallBack}/>
            </OffcanvasBody>
            </Offcanvas>
        </>
    )
  }

export default ToggleComponent