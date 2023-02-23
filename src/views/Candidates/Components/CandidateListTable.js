import {useState} from "react"
import { Badge, Table, Card, CardBody, Modal, ModalBody, ModalHeader, Button} from  "reactstrap"
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Clock, Edit, XCircle, FileText, Plus, Mail, File, AlertCircle } from "react-feather"
import ScheduleForm from "./InterviewComponents/ScheduleForm"
import EvaluationForm from "./EvaluationComponents/EvaluationForm"
import InterviewDetail from "./InterviewComponents/InterviewDetail"
import EvaluationDetail from "./EvaluationComponents/EvaluationDetail"
import EmailDetail from "./EmailComponents/EmailDetail"
import EmailSetup from "./EmailComponents/EmailSetup"
import Disqualify from "./DisqualifyCandidate/Disqualify"

const CandidateListTable = (props) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [formModal, setFormModal] = useState(false)
    const [evaluateModal, setEvaluateModal] = useState(false)
    const [emailModal, setEmailModal] = useState(false)
    const [disqualifyModal, setDisqualifyModal] = useState(false)
    const [cand_uuid, setcand_uuid] = useState(null)
    const [current_cand, set_current_cand] = useState([])
    const [currentStage, setCurrentStage] = useState(null)
    const [activeInterviewModal, setInterviewModal] = useState(1)
    const [activeEvaluationModal, setEvaluationModal] = useState(1)
    const [activeEmailModal, setEmailTemplateModal] = useState(1)

  // ** Function to handle Pagination
 
    const onStageUpdate = async (uuid, stage_id) => {

        const formData = new FormData()
        formData['uuid'] = uuid
        formData['stage'] = stage_id
            MySwal.fire({
                title: 'Are you sure?',
                text: "Do you want to update the Stage!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
                customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                     Api.jsonPatch(`/candidates/stage/update/`, formData)
                        .then((result) => {
                            if (result.status === 200) {
                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Stage Updated!',
                                    text: 'Stage is updated.',
                                    customClass: {
                                    confirmButton: 'btn btn-success'
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        // setBtn(false)
                                        props.getCandidate()
                                    }
                                })
                                } else {
                                    MySwal.fire({
                                        title: 'Error',
                                        text: result.message ? result.message : 'Something went wrong',
                                        icon: 'error',
                                        customClass: {
                                          confirmButton: 'btn btn-success'
                                        }
                                      })
                                }
                        })
                } 
            })
        }
    const openFormModal = (uuid, stage_id, active) => {
        setcand_uuid(uuid)        
        if (stage_id) setCurrentStage(stage_id)
        setInterviewModal(active)
        setFormModal(true)
        } 
    const openEvaluateModal = (uuid, stage_id, active) => {
        setcand_uuid(uuid)
        if (stage_id) setCurrentStage(stage_id)
        setEvaluationModal(active)
        setEvaluateModal(true)
        } 
    const openEmailModal = (uuid, stage_id, active) => {
        setcand_uuid(uuid)
        if (stage_id) setCurrentStage(stage_id)
        setEmailTemplateModal(active)
        setEmailModal(true)
        }
    const openDisqualifyModal = (data) => {
        set_current_cand(data)
        setDisqualifyModal(true)
    }
    const CallBack = () => {
        props.getCandidate()
    }    
    const interviewModal = (active) => {
        switch (active) {
            case 1:
                return <ScheduleForm uuid={cand_uuid} stage_id={currentStage} CallBack={CallBack}/>
            case 2:
                return <InterviewDetail uuid={cand_uuid} />
            default:
              return <p>No Data Found</p>
          }
    }
    const evaluationModal = (active) => {
        switch (active) {
        
            case 1:
                return <EvaluationForm uuid={cand_uuid} stage_id={currentStage} CallBack={CallBack} />
            case 2:
              return <EvaluationDetail uuid={cand_uuid} />
            default:
              return <p>No Data Found</p>
          }
    } 
    const emailTemplateModal = (active) => {
        switch (active) {
            case 1:
                return <EmailSetup uuid={cand_uuid} stage_id={currentStage} CallBack={CallBack} />
            case 2:
              return <EmailDetail uuid={cand_uuid} />
            default:
              return <p>No Data Found</p>
          }
    }    
    const Stage = ({ candidate, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row min-width-300">
                <div className="col-lg-8">
                <Select
                    isClearable={false}
                    options={props.stages}
                    className='react-select'
                    classNamePrefix='select'
                    defaultValue={props.stages.find(({value}) => value === candidate.stage) ? props.stages.find(({value}) => value === candidate.stage) : props.stages[0] }
                    onChange={stageData => {
                        onStageUpdate(candidate.uuid, stageData.value).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }
                    }
                    />
                </div>
                <div className="col-lg-4 float-right">
                <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row min-width-225">
                    <div className={candidate.is_qualified ? "col-lg-8" : "col-lg-12"}>
                        {props.stages.find(({value}) => value === candidate.stage) ? props.stages.find(({value}) => value === candidate.stage).label : props.stages[0].label }
                    </div>
                    {candidate.is_qualified && (
                         <div className="col-lg-4 float-right">
                         <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                     </div>
                    )}
                </div>
            )
                
            }
            </div>
        )
        }
       
    return (
        <>
           <div>
            <Card>
                <CardBody>
                    <Table bordered striped responsive>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>CNIC</th> 
                                <th>Job title</th>
                                <th>Resume</th>
                                <th>Score</th>
                                <th>Stage</th>
                                <th>Email Templates</th>
                                <th>Interview</th>
                                <th>Evaluation</th>
                                <th>Disqualify</th>
                            </tr>
                        </thead>
                        <tbody>

                        {Object.values(props.data).length > 0 ? (
                            props.data.map((candidate, index) => (
                                <tr key={index}>
                                    <td>{candidate.candidate_name ? candidate.candidate_name : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td>{candidate.email ? candidate.email : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td className="text-nowrap">{candidate.cnic_no ? candidate.cnic_no : <Badge color="light-danger">N/A</Badge>}</td> 
                                    <td>{candidate.job_title ? candidate.job_title : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td>
                                        <a className="btn btn-primary btn-sm" target="_blank" href={`${process.env.REACT_APP_BACKEND_URL}${candidate.resume}`}><File/></a>
                                    </td>
                                    <td>{candidate.score ? candidate.score : <Badge color="light-danger">N/A</Badge>} </td>
                                    <td className="text-nowrap">
                                        <Stage candidate={candidate} key={index}/>
                                    </td>
                                    <td>
                                        <div className="row" style={{width: "160px"}}>
                                        {(candidate.is_qualified) && (
                                                <div className="col-lg-6 p-1">
                                                    <Button className='btn btn-sm btn-primary' onClick={() => openEmailModal(candidate.uuid, candidate.stage, 1)}>
                                                        <Mail/>
                                                    </Button>
                                                </div>
                                        )}
                                                <div className={candidate.is_qualified ? "col-lg-6 p-1" : "col-lg-12 text-center"}>
                                                    <Button className='btn btn-sm btn-primary' onClick={() => openEmailModal(candidate.uuid, null, 2)}>
                                                        <FileText />
                                                    </Button>
                                                </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="row" style={{width: "160px"}}>
                                            {(candidate.stage_is_interview && candidate.is_qualified) && (
                                                <div className="col-lg-6 p-1">
                                                    <Button className='btn btn-sm btn-primary' onClick={() => openFormModal(candidate.uuid, candidate.stage, 1)}>
                                                        <Clock />
                                                    </Button>
                                                </div>
                                            )}
                                            
                                            <div className={(candidate.stage_is_interview && candidate.is_qualified)  ? "col-lg-6 p-1" : "col-lg-12 text-center"}>
                                                <Button className='btn btn-sm btn-primary' onClick={() => openFormModal(candidate.uuid, null, 2)}>
                                                    <FileText />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                    </td>
                                    <td>
                                        <div className="row" style={{width: "160px"}}>
                                                {(candidate.stage_is_evaluation && candidate.is_qualified) && (
                                                    <div className="col-lg-6 p-1">
                                                        <Button className='btn btn-sm btn-primary' onClick={() => openEvaluateModal(candidate.uuid, candidate.stage, 1)}>
                                                            <Plus/>
                                                        </Button>
                                                    </div>
                                                )}  
                                                
                                                <div className={(candidate.stage_is_evaluation && candidate.is_qualified) ? "col-lg-6 p-1" : "col-lg-12 text-center"}>
                                                    <Button className='btn btn-sm btn-primary' onClick={() => openEvaluateModal(candidate.uuid, null, 2)}>
                                                        <FileText />
                                                    </Button>
                                                </div>
                                        </div>
                                        
                                    </td>
                                    <td>
                                    <div className="row">
                                    {candidate.is_qualified ? (
                                        <div className="text-center col-lg-12">
                                            <Button className='btn btn-sm btn-primary' onClick={() => openDisqualifyModal(candidate)}>
                                                <AlertCircle />
                                            </Button>
                                        </div>
                                       
                                    ) : (
                                        <div className="text-center col-lg-12">
                                            <Badge color="light-danger">Disqualified</Badge>
                                        </div>
                                    )}
                                    </div>
                                    </td>
                                </tr>
        
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan={9}> No Candidates Available</td>
                            </tr>
                        )}
                        
                        
                        </tbody>
                    </Table>
                   
                </CardBody>
            </Card>
                
            </div>
            
            <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className='bg-transparent' toggle={() => setFormModal(!formModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    {interviewModal(activeInterviewModal)}
                </ModalBody>
            </Modal>  
            <Modal isOpen={evaluateModal} toggle={() => setEvaluateModal(!evaluateModal)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className='bg-transparent' toggle={() => setEvaluateModal(!evaluateModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    {evaluationModal(activeEvaluationModal)}
                </ModalBody>
            </Modal>  
            <Modal isOpen={emailModal} toggle={() => setEmailModal(!emailModal)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className='bg-transparent' toggle={() => setEmailModal(!emailModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    {emailTemplateModal(activeEmailModal)}
                </ModalBody>
            </Modal>
            <Modal isOpen={disqualifyModal} toggle={() => setDisqualifyModal(!disqualifyModal)} className='modal-dialog-centered'>
                <ModalHeader className='bg-transparent' toggle={() => setDisqualifyModal(!disqualifyModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <Disqualify data={current_cand} CallBack={CallBack} />
                </ModalBody>
            </Modal>  
        </>
    )
    
}
export default CandidateListTable