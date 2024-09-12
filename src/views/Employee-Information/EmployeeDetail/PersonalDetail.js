import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import UpdatePersonalDetail from "../AddEmployee/PersonalDetail/updatePersonalDetail"
import user_blank  from "../../../assets/images/avatars/user_blank.png"
const PersonalDetail = ({empData, CallBack}) => {
    const [editModal, setEditModal] = useState(false)
    const renderUserImg = () => {
        return (
          <>
          {empData.employee.profile_image ?  <img
            height='130'
            width='150'
            alt='user-avatar'
            src={`${process.env.REACT_APP_PUBLIC_URL}${empData.employee.profile_image}`}
            className='img-fluid rounded mt-1 mb-2'
          />  : <img
          height='110'
          width='110'
          alt='user-avatar'
          src={user_blank}
          className='img-fluid rounded mt-1 mb-2'
        /> } 
          </>
        )
    }
    const BloodGrup = [
        {value: "A+", label: "A+"},
        {value: "A-", label: "A-"},
        {value: "B+", label: "B+"},
        {value: "B-", label: "B-"},
        {value: "AB+", label: "AB+"},
        {value: "AB-", label: "AB-"},
        {value: "O+", label: "O+"},
        {value: "O-", label: "O-"}
     ]
     const Gender = [
        {value: 1, label: "Male"},
        {value: 2, label: "Female"}
     ] 
    
    return (
            <Fragment>
 <Fragment>
            <Card>
                    {Object.values(empData.employee).length > 0 ? (
                    <>
              <CardBody>
                <div className='user-avatar-section'>
                  <div className='d-flex align-items-center flex-column'>
                    {renderUserImg()}
                    <div className='d-flex flex-column align-items-center text-center'>
                      <div className='user-info'>
                        <h4>{empData.employee.name ? empData.employee.name : 'N/A'}</h4>
                          <Badge color="secondary" className='text-capitalize'>
                          {empData.employee.position_title ? empData.employee.position_title : 'N/A'}
                          </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-around pt-75'>
                  <div className='d-flex align-items-start me-2'>
                    {/* <Badge color='light-primary' className='rounded p-75'>
                      <Check className='font-medium-2' />
                    </Badge> */}
                    {/* <div className='ms-75'>
                      <h4 className='mb-0'>1.23k</h4>
                      <small>Tasks Done</small>
                    </div> */}
                  </div>
                  {/* <div className='d-flex align-items-start'>
                    <Badge color='light-primary' className='rounded p-75'>
                      <Briefcase className='font-medium-2' />
                    </Badge>
                    <div className='ms-75'>
                      <h4 className='mb-0'>568</h4>
                      <small>Projects Done</small>
                    </div>
                  </div> */}
                </div>
                {/* <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4> */}
                <div className='info-container'>
                  {/* {selectedUser !== null ? ( */}
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Name:</span>
                        <span>{empData.employee.name ? empData.employee.name : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Personal Email:</span>
                        <span>{empData.employee.personal_email ? empData.employee.personal_email : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Father Name:</span>
                        {empData.employee.father_name ? empData.employee.father_name : 'N/A'}
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>D-O-B:</span>
                        <span className='text-capitalize'>{empData.employee.dob ? empData.employee.dob : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>CNIC:</span>
                        <span>{empData.employee.cnic_no ? empData.employee.cnic_no : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Passport NO:</span>
                        <span>{empData.employee['passport_data'][0] ? empData.employee['passport_data'][0].passport_no : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Passport Expiry Date:</span>
                        <span>{empData.employee['passport_data'][0] ? empData.employee['passport_data'][0].date_of_expiry : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Blood Group:</span>
                        <span>{BloodGrup.find(pre => pre.value === empData.employee.blood_group) ? BloodGrup.find(pre => pre.value === empData.employee.blood_group).label : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Gender:</span>
                        <span>{Gender.find(pre => pre.value === empData.employee.gender) ? Gender.find(pre => pre.value === empData.employee.gender).label : 'N/A'}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Marital Status:</span>
                        <span>{empData.employee.marital_status_type ? empData.employee.marital_status_type : 'N/A'}</span>
                      </li>
                    </ul>
                  {/* ) : null} */}
                </div>
                <div className='d-flex justify-content-center pt-1'>
                  <Button color='primary' onClick={() => setEditModal(true)}>
                    Edit
                  </Button>
                  {/* <Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
                    Suspended
                  </Button> */}
                </div>
              </CardBody>
              </>) : (
                            <CardBody>
                                No Data Found
                            </CardBody>
                    )}              
            </Card>
          </Fragment>
          <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                   <UpdatePersonalDetail CallBack={CallBack} empData={empData.employee} />
                    </ModalBody>
                </Modal>
        </Fragment>
    )
}
export default PersonalDetail