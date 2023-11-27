import React, { Fragment, useState } from 'react'
import {Card, CardBody, CardTitle, Spinner, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, CardSubtitle, InputGroup, Input, InputGroupText} from "reactstrap"
import { Edit, Eye, Search, StopCircle, Users, FileText } from "react-feather"
import SearchHelper from '../../../../../Helpers/SearchHelper/SearchByObject'
import Masonry from 'react-masonry-component'
import UpdatePlan from './UpdatePlan'
import ViewPlan from './ViewPlan'
import EmployeeAssigned from './EmployeeAssigned'
import Assignments from './Assignments'
const PlanList = ({ data, CallBack}) => {
    console.warn(data)
    const searchHelper = SearchHelper()
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState(data)
    const [searchQuery] = useState([])
    const [updateData, setUpdateData] = useState([])
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [toggleType, setToggleType] = useState('')
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
    const toggleCanvasEnd = (item, type) => {
        setToggleType(type)
        setUpdateData(item)
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
    
  return (
    <Fragment>
        <div className='row  my-1'>
            <div className="col-lg-6">
            
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                    <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search title...' onChange={e => { getSearch({list: data, key: 'title', value: e.target.value }) } }/>
                </InputGroup>

                {Object.values(searchResults).length > 0 ? (
                    !loading ? (
                        <>
                            <Masonry className="row js-animation">
                                {Object.values(searchResults).map((item) => (
                                    <Card key={item.id}>
                                    <CardBody>
                                        <div className="row">
                                            <div className="col-md-4">
                                            <CardTitle tag='h1'>{item.title}</CardTitle>
                                            <CardSubtitle><Badge color='light-warning'>
                                            {`${item.mode_of_training_title}`} 
                                                </Badge></CardSubtitle>
                                            </div>
                                            <div className="col-md-4">
                                                <Badge color='light-info'>
                                                        Employees 
                                                </Badge><br></br>
                                                <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.number_of_employee && item.number_of_employee}</span><br></br>
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
                                                        // onClick={() => deleteJD(item.id)}
                                                        >
                                                        <StopCircle color="red"/>
                                                    </button>
                                                    <hr></hr>
                                                    <button
                                                        className="border-0 no-background"
                                                        title="Employees assigned"
                                                        onClick={() => toggleCanvasEnd(item.training_employees, 'employees')}
                                                        >
                                                        <Users color="purple"/>
                                                    </button>
                                                    <button
                                                        className="border-0 no-background"
                                                        title="Assignments"
                                                        onClick={() => toggleCanvasEnd(item.training_assignments, 'assignments')}
                                                        >
                                                        <FileText color="blue"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                            
                                    </CardBody>
                                    </Card> 
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
            <div className='col-lg-6'>
                <button onClick={CallBack}>Refresh</button>
            </div>
            
        </div>
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
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
                <Assignments data={updateData} CallBack={() => CallBack()}/>
            )}
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default PlanList