import {useState} from "react"
import { Input, Col, Badge} from  "reactstrap"
import Select from 'react-select'
import dateFormat from 'dateformat'
import apiHelper from "../../Helpers/ApiHelper"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Edit, XCircle } from "react-feather"
const CandidateListTable = (props) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [btn, setBtn] = useState(true)
    const onStageUpdate = (uuid, stage_id) => {

        const formData = new FormData()
        formData['uuid'] = uuid
        formData['stage'] = stage_id
        const url = `${process.env.REACT_APP_API_URL}/candidates/stage/update/`
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
                    fetch(url, {
                        method: "PATCH",
                        headers: {'content-type': 'application/json', Authorization: Api.token },
                        body:JSON.stringify(formData)
                        })
                        .then((response) => response.json())
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
                                        setBtn(false)
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
       
    return (
           <div>
                <table className="table ">
                    <thead>
                        <tr>
                            <th>
                            <Col md='12' className='mb-1'>
                                <Input
                                type="checkbox"
                                id="ckbox"
                                />
                            </Col>
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Job title</th>
                            <th>Created at</th>
                            <th>Score</th>
                            <th>Stage</th>
                        </tr>
                    </thead>
                    <tbody>

                    {Object.values(props.data).length > 0 ? (
                        props.data.map((candidate, index) => (
                            <tr key={index}>
                                <td>
                                <Col md='12' className='mb-1'>
                                    <Input
                                        type="checkbox"
                                        id="dd"
                                        />
                                </Col>
                                </td>
                                <td>{candidate.candidate_name}</td>
                                <td>{candidate.email}</td>
                                <td>{candidate.job_title ? candidate.job_title : <Badge color="light-danger">N/A</Badge>}</td>
                                <td>{dateFormat(candidate.created_at, "mmmm dS, yyyy")}</td>
                                <td>{candidate.score ? candidate.score : <Badge color="light-danger">N/A</Badge>} </td>
                                <td>
                                    {!btn ? (
                                        
                                        <div className="row">
                                            <div className="col-lg-8">
                                            <Select
                                                isClearable={false}
                                                options={props.stages}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={props.stages.find(({value}) => value === candidate.stage) ? props.stages.find(({value}) => value === candidate.stage) : props.stages[0] }
                                                onChange={stageData => onStageUpdate(candidate.uuid, stageData.value)}
                                                />
                                            </div>
                                            <div className="col-lg-4 float-right">
                                            <XCircle color="red" onClick={() => setBtn(!btn)}/>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="row">
                                            <div className="col-lg-8">
                                            {props.stages.find(({value}) => value === candidate.stage) ? props.stages.find(({value}) => value === candidate.stage).label : props.stages[0].label }
                                            </div>
                                            <div className="col-lg-4 float-right">
                                            <Edit color="orange" onClick={() => setBtn(!btn)}/>
                                            </div>
                                        </div>
                                    )}
                                    
                                </td>
                            </tr>
    
                        ))
                    ) : (
                        <tr className="text-center">
                            <td colSpan={7}> No Data Available</td>
                        </tr>
                    )}
                    
                       
                    </tbody>
               </table>
            </div>
    )
}
export default CandidateListTable