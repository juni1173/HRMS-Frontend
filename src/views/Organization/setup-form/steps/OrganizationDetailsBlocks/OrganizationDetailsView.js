// ** React Imports
import { useState } from "react" 
import { ArrowLeft, ArrowRight, Check, X, XCircle } from "react-feather" 
// ** Reactstrap Imports
import { Button, Table } from "reactstrap" 
import OrganizationUpdateBlock from "./OrganizationUpdateBlock"

const OrganizationDetailsView = (detail) => {
  const [updateStatus, setUpdateStatus] = useState(false)
  const editOrganization = () => {
    setUpdateStatus(!updateStatus)
  }
  return (
    !updateStatus ? (
    <>
      
        <div className="content-header text-center">
          <h2>Organization Info</h2>
          <button className="btn btn-primary" onClick={editOrganization}>Edit</button>
        </div>
        <hr/>
        
        <Table responsive>
            
            <tbody>
              <tr>
                <td className='text-nowrap'><h5>Name</h5></td>
                <td>{detail.organization_name}</td>
              </tr>
              <tr>
                <td className='text-nowrap'><h5>Tagline</h5></td>
                <td>{detail.organization_tagline}</td>
              </tr>
              <tr>
                <td className='text-nowrap'><h5>Vision</h5></td>
                <td>{detail.organization_vision}</td>
              </tr>
              <tr>
                <td className='text-nowrap'><h5>Mission</h5></td>
                <td>{detail.organization_mission}</td>
              </tr>
            </tbody>
          </Table>
          <Button color="primary" className="btn-next float-right" onClick={() => stepper.next()}>
            <span className="align-middle d-sm-inline-block d-none">
              Next
            </span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </>  
      ) : (
        <>
        <button className="btn float-right" onClick={editOrganization}><XCircle/> </button>
        <OrganizationUpdateBlock {...detail} />
        </>
      )
    )
  
} 

export default OrganizationDetailsView
