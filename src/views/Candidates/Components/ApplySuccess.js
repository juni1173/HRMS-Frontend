import { Fragment } from "react"
import { Check, XCircle, Clock, CheckCircle } from "react-feather"
import { Button } from "reactstrap"
// import { toast, Slide } from 'react-toastify'
// import apiHelper from "../../Helpers/ApiHelper"
 
 
const ApplySuccess = (props) => {
    return (
        <Fragment>
            
            <div className="row">
                <div className="col-lg-12">
                    <h4 className=""><CheckCircle color="Green"/> {props.message}</h4>
                </div>
            </div>
            <hr></hr>
            {props.successData ? (
                <>
                <div className="row">
                    <div className="col-lg-6">Candidate Name: <h4>{props.successData.candidate_job_post.candidate_name}</h4></div>
                    <div className="col-lg-6">Job Title: <h4>{props.successData.candidate_job_post.job_title}</h4></div>
                    {/* <div className="col-lg-6">Cnic#: <h4>{props.successData.candidate_job_post.cnic_no}</h4></div>
                    <div className="col-lg-6">Email: <h4>{props.successData.candidate_job_post.email}</h4></div> */}
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-lg-12">
                        {Object.values(props.successData.candidate_non_test).length > 0 && (
                            Object.values(props.successData.candidate_non_test).map((non_tech, key) => (
                                <div className="row" key={key}>
                                    <div className="col-lg-6">
                                        <h4>Non Technical Test</h4>
                                    </div>
                                    <div className="col-lg-6">
                                        {(!non_tech.is_completed && non_tech.is_active) ? (
                                            <a href={`${process.env.REACT_APP_PUBLIC_URL}/assessment/test/${non_tech.uuid}/`} target="_blank">
                                            <Button color='primary' className='btn-next'>
                                            <span className='align-middle d-sm-inline-block d-none'>Start</span>
                                            <Clock size={14} className='align-middle ms-sm-25 ms-0'></Clock>
                                            </Button>
                                            </a>
                                        ) : (
                                            non_tech.is_passed ? (
                                                <h4 color="green"><Check color="Green"/>Pass</h4>
                                            ) : (
                                                <h4 color="red"><XCircle color="red"/> Fail</h4>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))
                        )
                        }
                    </div>

                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-lg-12">
                        {Object.values(props.successData.candidate_tech_test).length > 0 && (
                            Object.values(props.successData.candidate_tech_test).map((tech, key) => (
                                <div className="row" key={key}>
                                    <div className="col-lg-6">
                                        <h4>Technical Test</h4>
                                    </div>
                                    <div className="col-lg-6">
                                        {(!tech.is_completed && tech.is_active) ? (
                                            <a href={`${process.env.REACT_APP_PUBLIC_URL}/assessment/test/${tech.uuid}/`} target="_blank">
                                            <Button color='primary' className='btn-next'>
                                            <span className='align-middle d-sm-inline-block d-none'>Start</span>
                                            <Clock size={14} className='align-middle ms-sm-25 ms-0'></Clock>
                                            </Button>
                                            </a>
                                        ) : (
                                            tech.is_passed ? (
                                                <h4 color="green"><Check color="Green"/>Pass</h4>
                                            ) : (
                                                <h4 color="red"><XCircle color="red"/> Fail</h4>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))
                        )
                        }
                    </div>

                </div>
                <hr></hr>
                        
                <div className="row">
                    <div className="col-lg-12">
                        <h3>Assessment Instruction</h3>
                        <ul>
                            <li>The duration of this assessment is  [duration] minutes. </li>
                            <li>There are X questions in this assessment and will be presented one at a time. </li>
                            <li>Each question is worth the different marks.  </li>
                            <li>The assessment is worth X% of the marks available in this subject. The contribution each question makes to the total assessment mark is indicated in points or as a percentage. </li>
                            <li>During this assessment you won’t be permitted to review previous questions. </li>
                            <li>During assessment you won’t be allowed to switch your screen.</li>
                        </ul>
                        <strong>** Additional instructions specific to your assessment** </strong>
                        <p>If you have any technical difficulties before starting or during the assessment then follow the following instructions: </p>
                        <ul>
                            <li>Write an email at <a href="mailto:'hr@kavmail.net'">hr@kavmail.net</a> with the specific problem you are facing in “subject”.</li>
                            <li>Attach the screenshot of the error along with the email.</li>
                        </ul>
                        <h4>Code of Conduct</h4>
                        <p>You are not permitted to use any unauthorized material during this assessment. This includes but not limited to: </p>
                        <ul>
                            <li>Smart watches and bands</li>
                            <li>Electronic devices (including additional monitors, mobile phones etc.)</li>
                        </ul>
                        <p className="mt-2">You are expected to follow the above instructions in true letter and spirit. Best of Luck!</p>
                    </div>
                </div>
                
                </>
            ) : (
                <>
                <p>No Data</p>
            </>
            )}
            
        </Fragment>
    )
}
export default ApplySuccess