import React, { Fragment, useState } from 'react'
import {Row, Col, Button, Card, CardBody, CardTitle, Spinner, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, CardSubtitle, InputGroup, Input, InputGroupText} from "reactstrap"
import { Edit, Eye, Search, StopCircle, Users, FileText, UserPlus } from "react-feather"
import SearchHelper from '../../../../../Helpers/SearchHelper/SearchByObject'
import Masonry from 'react-masonry-component'
import UpdatePlan from './UpdatePlan'
import ViewPlan from './ViewPlan'
import EmployeeAssigned from './EmployeeAssigned'
import Assignments from './Assignments'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Projects from './Projects'
import NewEmployeeAssignments from './NewEmployeeAssignments'
const PlanList = ({ data, CallBack}) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState(data)
    const [searchQuery] = useState([])
    const [updateData, setUpdateData] = useState([])
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [toggleType, setToggleType] = useState('')
    const [training_id, setTrainingId] = useState('')
    const getSearch = options => {
        setLoading(true)
        if (options.value === '' || options.value === null || options.value === undefined) {

            if (options.key in searchQuery) {
                delete searchQuery[options.key]
            } 
            if (Object.values(searchQuery).length > 0) {
                options.value = {query: searchQuery}
            } else {
                options.value = {}
            }
            setSearchResults(searchHelper.searchObj(options))
            
        } else {
            
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            setSearchResults(searchHelper.searchObj(options))
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        
    }
    const toggleCanvasEnd = (item, type, t_id) => {
        setToggleType(type)
        setUpdateData(item)
        if (t_id) {
            setTrainingId(t_id)
        }
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
      const stopTraining = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to stop the Training!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Stop it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.jsonPatch(`/training/stop/${id}/`)
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Training Stoped!',
                            text: 'Training is Stopped.',
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
                            title: deleteResult.message ? deleteResult.message : 'Training can not be Stopped!',
                            text: 'Training is not stopped.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
    }
  return (
    <Fragment>
        <div className='row  my-1'>
            <div className="col-lg-12">
            <Row>
                <Col md={6}>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                    <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search title...' onChange={e => { getSearch({list: data, key: 'title', value: e.target.value }) } }/>
                </InputGroup>
                </Col>
                <Col md={6}></Col>
            </Row>
                {Object.values(searchResults).length > 0 ? (
                    !loading ? (
                        <>
                            <Masonry className="row js-animation">
                                {Object.values(searchResults).map((item) => (
                                    <Col md={6} key={item.id}>
                                        <Card >
                                        <CardBody>
                                            <div className="row">
                                                <div className="col-md-4">
                                                <CardTitle tag='h1'>{item.title}</CardTitle>
                                                <CardSubtitle><Badge color='light-warning'>
                                                    {`${item.mode_of_training_title}`} 
                                                    </Badge><br></br>
                                                    {item.status !== 2 && (
                                                    <button className='btn btn-outline-dark btn-sm mt-1' onClick={() => toggleCanvasEnd(item, 'projects', item.id)}>Projects</button>
                                                    )}
                                                    </CardSubtitle>
                                                </div>
                                                <div className="col-md-4">
                                                    <Badge color='light-info'>
                                                            Employees 
                                                    </Badge><br></br>
                                                    <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}><b>{item.number_of_employee ? item.number_of_employee : 0}</b> / {item.status !== 2 && <UserPlus color='green' size={15} onClick={() => toggleCanvasEnd(item, 'new_employees', item.id)}/>} </span><br></br>
                                                    <Badge color='light-success'>
                                                        Status
                                                    </Badge><br></br>
                                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.status_title && item.status_title}</span>
                                                </div>
                                                {/* <div className="col-md-3">
                                                    
                                                    
                                                </div> */}
                                                <div className="col-lg-4 float-right">
                                                    
                                                    <div className="float-right">
                                                    <button
                                                            className="border-0 no-background"
                                                            title="View"
                                                            onClick={() => toggleCanvasEnd(item, 'view')}
                                                            >
                                                            <Eye color="green"/>
                                                        </button>
                                                        {item.status !== 2 && (
                                                            <>
                                                                <button
                                                                    className="border-0 no-background"
                                                                    title="Edit"
                                                                    onClick={() => toggleCanvasEnd(item, 'update')}
                                                                    >
                                                                    <Edit color="orange"/>
                                                                </button>
                                                                <button
                                                                    className="border-0 no-background"
                                                                    title="Stop the Training"
                                                                    onClick={() => stopTraining(item.id)}
                                                                    >
                                                                    <StopCircle color="red"/>
                                                                </button>
                                                                <hr></hr>
                                                            </>
                                                        )}
                                                        
                                                        <button
                                                            className="border-0 no-background"
                                                            title="Employees assigned"
                                                            onClick={() => toggleCanvasEnd(item.training_employees, 'employees')}
                                                            >
                                                            <Users color="purple"/>
                                                        </button>
                                                        {item.status !== 2 && (
                                                        <button
                                                            className="border-0 no-background"
                                                            title="Assignments"
                                                            onClick={() => toggleCanvasEnd(item.training_assignments, 'assignments', item.id)}
                                                            >
                                                            <FileText color="blue"/>
                                                        </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                                
                                        </CardBody>
                                        </Card> 
                                    </Col>
                                ))}
                            </Masonry>
                        </>   
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )
           
                ) : (
                    <Card>
                    <CardBody>
                        No training plan found...
                    </CardBody>
                    </Card> 
                )}
                
            </div>
           
            
        </div>
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className={(toggleType === 'new_employees' || toggleType === 'employees') ? 'largeCanvas' : ''}>
        <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
        <OffcanvasBody className=''>
            {toggleType === 'update' && (
                <UpdatePlan data={updateData} CallBack={() => CallBack()}/>
            )}
            {toggleType === 'view' && (
                <ViewPlan data={updateData} CallBack={() => CallBack()}/>
            )}
            {toggleType === 'employees' && (
                <EmployeeAssigned data={updateData} CallBack={() => CallBack()}/>
            )}
            {toggleType === 'assignments' && (
                <Assignments data={updateData} training_id={training_id} CallBack={() => CallBack()}/>
            )}
            {toggleType === 'projects' && (
                <Projects data={updateData} training_id={training_id} CallBack={() => CallBack()}/>
            )}
            {toggleType === 'new_employees' && (
                <NewEmployeeAssignments data={updateData} training_id={training_id} CallBack={() => CallBack()}/>
            )}
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default PlanList