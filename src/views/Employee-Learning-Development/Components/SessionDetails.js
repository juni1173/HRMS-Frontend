import { Card, CardBody, CardTitle, Badge } from "reactstrap"
import Session_Lectures from '../../LearningDevelopment/Components/Sessions/Session_Lectures/index'
const SessionDetails = ({ data }) => {
   
    return (
        <>
            <div className="Session-single-card" >
                <Card>
                    <CardTitle className="mb-0">
                        <div className="row bg-blue">
                                        <h4 color='white' className="text-center">{data.course_title} </h4>
                        </div>
                    </CardTitle>
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
                                        {/* <div className="col-md-4 pt-2">
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
                                        </div> */}
                                </div>
                        <div className="row pt-3">
                            <div className="col-lg-12">
                                <Session_Lectures sessionData={data} />
                            </div>
                        </div>
                    </CardBody>
               
                </Card>
            </div>
          
        </>
    )
  }

export default SessionDetails