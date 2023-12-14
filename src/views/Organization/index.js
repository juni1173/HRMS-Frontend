  // ** User List Component
  // import Table from './Table'

  // ** Reactstrap Imports
  import { useState, useEffect } from 'react'
  import { Link, useHistory } from 'react-router-dom'
  import { Button, Row, Col, Card, CardHeader, CardBody, CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from "reactstrap"

  // ** Custom Components
  import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

  // ** Icons Imports
  import { Home, Briefcase, Users, Server, Award } from "react-feather"

  // ** Styles
  import "@styles/react/apps/app-users.scss"
  import OrganizationDetails from './setup-form/steps/OrganizationDetails'
  import GroupHead from './setup-form/steps/GroupHead'
  import StaffClassification from './setup-form/steps/StaffClassification'
  import DepartmentsInfo from './setup-form/steps/DepartmentsInfo'
  import Positions from '../Jobs-Setup/positions'
  import apiHelper from '../Helpers/ApiHelper'
  const Organization = () => {
    const Api = apiHelper()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState('1')
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [count, setCount] = useState(0)
    const [dashCount, setDashcount] = useState([])
    // Tabs Toggle State Set
    
    const toggle = tab => {
      setLoading(true)
        setActive(tab)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
    
    // Canvas Panel On and Off Function Call
    
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
    
    const getDashCount = async () => {
      setLoading(true)
        await Api.get(`/organizations/data/count/`).then(result => {
          if (result.status === 200) {
            setDashcount(result.data)
          } else {
            if (Api.org.id) Api.Toast('error', 'No Count Data Available')
          }
        })
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    // CallBack Function to call async ajax requests

    const CallBack = () => {
      setCanvasOpen(false)
      getDashCount()
      setCount(current => current + 1)

    }
    
    useEffect(() => {
      if (JSON.parse(localStorage.getItem('userData')).user_role === "employee") {
        history.push('/employee/dashboard')
      }
      getDashCount()
      
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
        case '5':
        return <DepartmentsInfo stepperStatus={false} createForm={true} fetchDepCallBack={CallBack} />
        
        default:
          return <p>No Data Found</p>
      }
    }

    return (
      <div className="app-user-list">

        {/* Organization Setup Button Row */}
      {!loading && (
        ((dashCount.length === 0) || dashCount.org_count === 0) && (
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
       )
      )
      
      }
        

        {/* NavBar of Tabs */}

        <Nav className='justify-content-center' pills>
          <div className='row organization-tabs'>
          <div className='col'>
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
                renderStats={<h3 className="fw-bolder mb-75">{!loading ? (Object.values(dashCount).length > 0 ? dashCount.org_count : 0) : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          <div className='col'>
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
                renderStats={<h3 className="fw-bolder mb-75">{!loading ? (Object.values(dashCount).length > 0 ? dashCount.grouphead_count : 0) : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          <div className='col'>
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
                renderStats={<h3 className="fw-bolder mb-75">{!loading ? (Object.values(dashCount).length > 0 ? dashCount.staff_count : 0) : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          <div className='col'>
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
                renderStats={<h3 className="fw-bolder mb-75">{!loading ? (Object.values(dashCount).length > 0 ? dashCount.department_count : 0) : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          <div className='col'>
            <NavItem>
              <NavLink
                active={active === '5'}
                onClick={() => {
                  toggle('5')
                }}
              >
                <StatsHorizontal
                color="secondary"
                statTitle="Positions"
                icon={<Award size={40} />}
                renderStats={<h3 className="fw-bolder mb-75">{!loading ? (Object.values(dashCount).length > 0 ? dashCount.position_count : 0) : <Spinner/>}</h3>}
              />
              </NavLink>
            </NavItem>
          </div>
          </div>
        </Nav>

        {/* Tabs Content */}

        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId='1'>
            {active === '1' ? <OrganizationDetails stepperStatus={false}/> : null}
          </TabPane>
          <TabPane tabId='2'>
          {active === '2' ? (
            <>
             <button className='btn btn-primary float-right' onClick={toggleCanvasEnd}>Add Group Head</button> 
             <GroupHead stepperStatus={false} list={true} count={count} fetchGroupHeads={CallBack}/>
            </>
          ) : null }
          </TabPane>
          <TabPane tabId='3'>
          {active === '3' ? (
            <>
          <button className='btn btn-primary float-right' onClick={toggleCanvasEnd}>Add Staff Classification</button> 
            <StaffClassification stepperStatus={false} list={true} count={count} fetchStaffClassification={CallBack}/>
            </>
          ) : null }
          </TabPane>
          <TabPane tabId='4'>
          {active === '4' ? (
            <>
              <button className='btn btn-primary float-right' onClick={toggleCanvasEnd}>Add Department</button> 
              <DepartmentsInfo stepperStatus={false} count={count} list={true} fetchDepCallBack={CallBack}/>
            </>
            ) : null }
          </TabPane>
          <TabPane tabId='5'>
          {active === '5' ? (
            <Positions/>
          ) : null }
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
