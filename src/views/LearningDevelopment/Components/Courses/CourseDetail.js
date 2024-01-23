import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardTitle, CardBody, Badge, TabContent, TabPane, Nav, NavItem, NavLink, Spinner, Row, Col } from 'reactstrap'
import {useParams} from "react-router-dom" 
import Course_Module from './Course_Module/index'
import apiHelper from '../../../Helpers/ApiHelper'
const CourseDetail = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState('1')
    const [url_params] = useState(useParams())
    const [data, setData] = useState([])
    const toggle = tab => {
        setActive(tab)
      }
      const getCourseData = async () => {
        setLoading(true)
        if (!url_params.uuid) {
            return false   
        }
       await  Api.get(`/courses/${url_params.slug}/${url_params.uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const finalData = result.data
                    setData(finalData)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getCourseData()
    }, [setData])
  return (
    <Fragment>
        
        <Card>
            <CardBody>
                {/* <Row>
                    <Col md={12}> */}
                    <Nav tabs className='course-tabs'>
                            {/* <div className='col-md-6'> */}
                                <NavItem >
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                    toggle('1')
                                    }}
                                >
                                About
                                </NavLink>
                                </NavItem>
                            {/* </div>
                            <div className='col-md-6'> */}
                                <NavItem >
                                <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                    toggle('2')
                                    }}
                                >
                                    Modules
                                </NavLink>
                                </NavItem>
                                <NavItem >
                                <NavLink
                                    active={active === '3'}
                                    onClick={() => {
                                    toggle('3')
                                    }}
                                >
                                    Sessions
                                </NavLink>
                                </NavItem>
                            {/* </div> */}
                        </Nav>
                    {/* </Col>
                </Row> */}
                <Row>
                <Col md={12}>
                <TabContent className='py-50' activeTab={active}>
                    <TabPane tabId={'1'}>
                    {!loading ? (
                        <>
                            <div className="row">  
                                <div className='col-lg-12 col-md-12 col-sm-12'>
                                    <h3>{data.title}</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                    <Badge color='light-warning'>
                                        Code  
                                    </Badge><br></br>
                                    <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.code ? data.code : 'N/A'}</span>
                                </div>
                                <div className="col-md-2">
                                    <Badge color='light-warning'>
                                        Subject
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.subject_title ? data.subject_title : 'N/A'}</span>
                                </div>
                                <div className="col-md-2">
                                    <Badge color='light-warning'>
                                        Program
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.program_title ? data.program_title : 'N/A'}</span>
                                </div>
                                <div className="col-md-2">
                                    <Badge color='light-warning'>
                                        Credit Hours  
                                    </Badge><br></br>
                                    <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.credit_hours ? data.credit_hours : 'N/A'}</span>
                                </div>
                                <div className="col-md-2">
                                    <Badge color='light-warning'>
                                            Mode 
                                    </Badge><br></br>
                                    <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.mode_of_course_title ? data.mode_of_course_title : 'N/A'}</span>
                                </div>
                                <div className="col-md-2">
                                    <Badge color='light-warning'>
                                        Complexity
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.complexity_level_title ? data.complexity_level_title : 'N/A'}</span>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Skills you will gain
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.skills_you_gain ? data.skills_you_gain : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            What you will learn
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.what_will_you_learn ? data.what_will_you_learn : 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4">
                                        <Badge color='light-warning'>
                                            Offered By
                                        </Badge><br></br>
                                        <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.offered_by ? data.offered_by : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                        ) : (
                            <div className='text-center'> <Spinner/></div>
                        )}
                    </TabPane>
                    <TabPane tabId='2'>
                        <div>
                            {!loading ? (
                                Object.values(data).length > 0 ? (
                                    <Course_Module courseData={data} />
                                ) : (
                                    <p>No Module Data found</p>
                                )
                                
                            ) : (
                                <div className='text-center'><Spinner/></div>
                            )}
                        </div>
                    </TabPane>
                    <TabPane tabId='3'>
                        <div>
                            {!loading ? (
                                //<Course_Module courseData={data} />
                                <p>Session</p>
                            ) : (
                                <div className='text-center'><Spinner/></div>
                            )}
                        </div>
                    </TabPane>
                </TabContent> 
                </Col>
                </Row>
            </CardBody>
        </Card>
        
    </Fragment>
  )
}

export default CourseDetail