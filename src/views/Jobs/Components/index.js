import { useState, useEffect } from "react"
import { Search } from "react-feather"
import { Input, InputGroup, InputGroupText, TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody, Card, CardBody, CardTitle, CardText, Spinner } from "reactstrap"
import ActiveJobsList from "./blockComponents/ActiveJobsList"
import DeletedJobsList from "./blockComponents/DeletedJobsList"
import JobsAddForm from "./blockComponents/CreateJobsForm"
import JobHelper from "../../Helpers/JobHelper"
const JobsIndexComp = () => {
    const Job_Helper = JobHelper()
    const [active, setActive] = useState('1')
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [count, setCount] = useState(0)
    const [formData] = useState([])
    const [loading, setLoading] = useState(true)
    // Tabs Toggle State Set
    const fetchPreData = async () => {
        setLoading(true)
        await Job_Helper.fetchFormPreData().then(data => {
          if (data) {
           formData['Staff_Classification'] = data.Staff_Classification
           formData['Department'] = data.Department
           formData['Position'] = data.Position
           formData['Job_Types'] = data.Job_Types
           formData['JD_Selection'] = data.JD
          }
          setLoading(false)
          return formData
        })
      }
    const toggle = tab => {
        setActive(tab)
      }
      
      // Canvas Panel On and Off Function Call
      
      
      const CallBack = () => {
        setCanvasOpen(false)
        setCount(current => current + 1)
      }
      const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        // CallBack()
      }
      useEffect(() => {
           fetchPreData()
      }, [])
    return (

        <>
             {/* NavBar of Tabs */}
        <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-6">
                <button className='btn btn-primary float-right my-1' onClick={toggleCanvasEnd} >Create Jobs</button> 
            </div>
        
            <div className="col-lg-6">
                <Nav tabs>
                    <div className='col-md-3'>
                        <NavItem>
                        <NavLink
                            active={active === '1'}
                            onClick={() => {
                            toggle('1')
                            }}
                        >
                        Active Jobs
                        </NavLink>
                        </NavItem>
                    </div>
                    <div className='col-md-3'>
                        <NavItem>
                        <NavLink
                            active={active === '2'}
                            onClick={() => {
                            toggle('2')
                            }}
                        >
                            Deleted
                        </NavLink>
                        </NavItem>
                    </div>
                </Nav>
            </div>
            {/* <div className="col-lg-6">
               
                <InputGroup className='input-group-merge mb-2'>
                <InputGroupText>
                <Search size={14} />
                </InputGroupText>
                <Input placeholder='search...' />
            </InputGroup>
            </div> */}
        </div>
        
        {/* Tabs Content */}

        <div className="row">
            <div className="col-lg-12">
            
            <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                    <div>
                        {Object.values(formData).length > 0 && !loading ? (
                            <ActiveJobsList data={formData} count={count} CallBack={CallBack}/>
                        ) : (
                            <Spinner />
                        )}
                        
                    </div>
                </TabPane>
                <TabPane tabId='2'>
                    <div>
                    {Object.values(formData).length > 0 && !loading ? (
                            <DeletedJobsList data={formData} count={count} CallBack={CallBack}/>
                        ) : (
                            <Spinner />
                        )}
                        
                    </div>
                </TabPane>
            </TabContent> 
            </div>
        </div>
        
        {/* Canvas Panel Content */}

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="Job-Form-Canvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {/* {Canvas(active)} */}
            <JobsAddForm  count={count} CallBack={CallBack}/>
          </OffcanvasBody>
        </Offcanvas>
        </>
        
    )
    

}
export default JobsIndexComp