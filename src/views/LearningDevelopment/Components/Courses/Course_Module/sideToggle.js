import { useState } from "react"
import { Badge, TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap"
import Module_Topics from "./Course_Topics/index"
const SideToggle = ({ data }) => {
    const [active, setActive] = useState('1')
    const toggle = tab => {
        setActive(tab)
      }
    return (
        <>
            <div className="Module-single-card">
                <div className="row">
                    <div className="col-md-12">
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
                                        Topics
                                    </NavLink>
                                    </NavItem>
                                
                                {/* </div> */}
                        </Nav>
                    </div>
                    {/* <div className="col-md-6">
                        <h3 className=" pt-2">
                            {data.title && data.title}
                        </h3>
                    </div> */}
                </div>
                    

                    <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Badge color='light-warning'>
                                                What we learn ?
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.what_we_learn && data.what_we_learn}</span>
                                        </div>
                                        <div className="col-md-6">
                                            <Badge color='light-warning'>
                                                Total Hours
                                            </Badge><br></br>
                                            <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{data.total_hours && data.total_hours}</span>
                                        </div>
                                        <div className="col-md-12 pt-2">
                                            <Badge color='light-warning'>
                                                Description
                                            </Badge><br></br>
                                            <span className="mode" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{data.description && data.description}</span>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </TabPane>
                        <TabPane tabId={'2'}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-12">
                                        <Module_Topics module_id={data.id} key={data.id}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </TabContent>
                       
            </div>
            
        </>
    )
  }

export default SideToggle