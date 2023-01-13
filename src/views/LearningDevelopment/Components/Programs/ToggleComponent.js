import { useState } from "react"
import { ChevronDown, Edit, Eye, XCircle, Plus } from "react-feather"
import { Card, CardBody, CardTitle, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap"
import ProgramHelper from "../../../Helpers/LearningDevelopmentHelper/ProgramHelper"
import UpdateProgram from "./UpdateProgram"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const ToggleComponent = ({ data, id, CallBack }) => {
    const Helper = ProgramHelper()
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [updateCanvasPlacement, setupdateCanvasPlacement] = useState('end')
    const [updateCanvasOpen, setupdateCanvasOpen] = useState(false)
    const MySwal = withReactContent(Swal)
    const removeProgram = (uuid, slug) => {
        // Helper.deleteProgram(uuid, slug).then(() => {
        //     CallBack()
        // })
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Program!",
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
                Helper.deleteProgram(uuid, slug)
                    .then(() => {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Program Deleted!',
                                text: 'Program is deleted.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    CallBack()
                                }
                            })
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
            <div className="program-single-card" key={id}>
            <Card>
            <CardTitle className="mb-0">
                <div className="row bg-blue">
                            <div className="col-lg-4 col-md-4 col-sm-4">
                            <ChevronDown color="white" className="float-left cursor-pointer" onClick={() => setToggleThisElement((prev) => !prev)}/>
                            </div>
                            <div className='col-lg-4 col-md-4 col-sm-4'>
                                <h4 color='white' className="text-center">{data.title}</h4>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <button
                                    className="border-0 no-background float-right"
                                    title="Delete Subject"
                                    onClick={() => removeProgram(data.uuid, data.slug_title)}
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
                    <div className="col-lg-6">
                        <b>Subject</b> <br/>
                        {data.subject_title}
                    </div>
                    <div className="col-lg-6">
                        <b>Slug</b> <br/>
                        {data.slug_title}
                    </div>
                    <hr></hr>
                    <div className="col-lg-12">
                        <h4>Description</h4>
                        <p>{data.description}</p>
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
                <UpdateProgram programData={data} CallBack={CallBack}/>
            </OffcanvasBody>
            </Offcanvas>
        </>
    )
  }

export default ToggleComponent