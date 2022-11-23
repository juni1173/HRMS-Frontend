  // ** User List Component
  // import Table from './Table'

  // ** Reactstrap Imports
  import { useState, useEffect } from 'react'
  import { Link, Redirect } from 'react-router-dom'
  import { Button, Row, Col, Card, CardHeader, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"

  // ** Custom Components
  import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

  // ** Icons Imports
  import { Home, Briefcase, Users, Server } from "react-feather"

  // ** Styles
  import "@styles/react/apps/app-users.scss"
  import OrganizationDetails from './setup-form/steps/OrganizationDetails'
  import GroupHead from './setup-form/steps/GroupHead'
  import StaffClassification from './setup-form/steps/StaffClassification'
  import DepartmentsInfo from './setup-form/steps/DepartmentsInfo'
  import apiHelper from '../Helpers/ApiHelper'
  const Organization = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState('1')
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [count, setCount] = useState(0)
    const [dashCount, setDashcount] = useState(null)
    // Tabs Toggle State Set
    
    const toggle = tab => {
      setActive(tab)
    }
    
    // Canvas Panel On and Off Function Call
    
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
  
    // CallBack Function to call async ajax requests

    const CallBack = () => {
      setCanvasOpen(false)
      setCount(current => current + 1)
    }
  
    useEffect(() => {
      setLoading(true)
      Api.get(`/organizations/data/count/`).then(result => {
        if (result.status === 200) {
          setDashcount(result.data)
          console.warn(result.data)
        } else {
          Api.Toast('error', result.message)
        }
      })
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      
    }, [])

    // Canvas Panel Checks for Components Call

    const Canvas = active => {
      switch (active) {
        
        case '2':
            return <GroupHead stepperStatus={false} createForm={true} fetchGroupHeads={CallBack}/>
        case '3':
          return <StaffClassification stepperStatus={false} createForm={true} fetchStaffClassification={CallBack} />
        case '4':
          return <DepartmentsInfo stepperStatus={false} createForm={true} fetchDepCallBack={CallBack} />
        
        default:
          return <p>No Data Found</p>
      }
    }

    return (
      <div className="app-user-list">

        {/* Organization Setup Button Row */}
      {(dashCount && dashCount.org_count === 0) && (
         <Row>
         <Col lg="12" sm="12">
           <Card className='warning-setup'>
             <CardBody>
                 <Row>
                     <Col lg='6' sm='6'>
                         <h3 className='white-heading'>Setup Organization</h3>
                     </Col>
                     <Col lg='6' sm='6'>
                     <Button.Ripple className='float-right btn-lg' color='light' tag={Link} to='/organization-setup' outline>
                         Setup
                     </Button.Ripple>
                     </Col>
                 </Row>
             </CardBody>
           </Card>
         </Col>
       </Row> 
      )}
        

        {/* NavBar of Tabs */}

        <Nav className='justify-content-center' pills>
          <div className='col-md-3'>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1')
                }}
              >
                <StatsHorizontal
                color="success"
                statTitle="Organization"
                icon={<Home size={40} />}
                renderStats={<h3 className="fw-bolder mb-75">{(dashCount && !loading) ? dashCount.org_count : <Spinner/>}</h3>}
              />
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
                <StatsHorizontal
                color="danger"
                statTitle="Group Head"
                icon={<Briefcase size={40} />}
                renderStats={<h3 className="fw-bolder mb-75">{(dashCount && !loading) ? dashCount.grouphead_count : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          <div className='col-md-3'>
            <NavItem>
            <NavLink
                active={active === '3'}
                onClick={() => {
                  toggle('3')
                }}
              >
                <StatsHorizontal
                color="warning"
                statTitle="Staff Classification"
                icon={<Users size={40}/>}
                renderStats={<h3 className="fw-bolder mb-75">{(dashCount && !loading) ? dashCount.staff_count : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          <div className='col-md-3'>
            <NavItem>
              <NavLink
                active={active === '4'}
                onClick={() => {
                  toggle('4')
                }}
              >
                <StatsHorizontal
                color="info"
                statTitle="Department"
                icon={<Server size={40} />}
                renderStats={<h3 className="fw-bolder mb-75">{(dashCount && !loading) ? dashCount.department_count : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
        </Nav>

        {/* Tabs Content */}

        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId='1'>
            <OrganizationDetails stepperStatus={false}/>
          </TabPane>
          <TabPane tabId='2'>
            <button className='btn btn-primary float-right' onClick={toggleCanvasEnd}>Add Group Head</button> 
            <GroupHead stepperStatus={false} list={true} count={count} fetchGroupHeads={CallBack}/>
          </TabPane>
          <TabPane tabId='3'>
          <button className='btn btn-primary float-right' onClick={toggleCanvasEnd}>Add Staff Classification</button> 
            <StaffClassification stepperStatus={false} list={true} count={count} fetchStaffClassification={CallBack}/>
          </TabPane>
          <TabPane tabId='4'>
            <button className='btn btn-primary float-right' onClick={toggleCanvasEnd}>Add Department</button> 
          <DepartmentsInfo stepperStatus={false} count={count} list={true} fetchDepCallBack={CallBack}/>
          </TabPane>
        </TabContent> 

        {/* Canvas Panel Content */}

        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {Canvas(active)}
          </OffcanvasBody>
        </Offcanvas>
      </div>
    )
  }

  export default Organization
