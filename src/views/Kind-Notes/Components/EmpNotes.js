import { useState, } from "react"
import { TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap"

const EmpNotes = () => {
    const [active, setActive] = useState('1')
    const [loading, setLoading] = useState(false)
    const toggle = tab => {
        setActive(tab)
      }
      const getNotes = async () => {
          setLoading(true)
          await Api.get(`/organization/${Api.org ? Api.org.id : 4}/kind/notes/`).then(result => {
            if (result) {
              if (result.status === 200) {
                setNotesList(result.data)
              } else {
                // Api.Toast('error', result.message)
              }
            } else {
              Api.Toast('error', 'Server not responding!')
            }
          })
          setTimeout(() => {
            setLoading(false)
          }, 1000)
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
                </div>
                    

                    <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row">
                                     
                                    </div>
                                </div>
                            </div> 
                        </TabPane>
                        <TabPane tabId={'2'}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-12">
                                        <p>he</p>
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

export default EmpNotes