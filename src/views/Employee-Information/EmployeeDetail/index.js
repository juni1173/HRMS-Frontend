import { Fragment, useState, useEffect} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import UpdatePersonalDetail from "../AddEmployee/PersonalDetail/updatePersonalDetail"
import UpdateOfficeDetail from "../AddEmployee/OfficeDetail/UpdateOfficeDetail"
import UpdateEmpContact from "../UpdateEmployeeComponents/UpdateEmpContact"
import UpdateEmpExperience from "../UpdateEmployeeComponents/UpdateEmpExperience"
import UpdateEmpEducation from "../UpdateEmployeeComponents/UpdateEmpEducation"
import UpdateEmpSkill from "../UpdateEmployeeComponents/UpdateEmpSkill"
import UpdateEmpDependent from "../UpdateEmployeeComponents/UpdateEmpDependent"
import UpdateEmpBank from "../UpdateEmployeeComponents/UpdateEmpBank"
import CreateEmpContact from "../CreateEmployeeComponents/CreateEmpContact"
import CreateEmpDependent from "../CreateEmployeeComponents/CreateEmpDependent"
import CreateEmpEducation from "../CreateEmployeeComponents/CreateEmpEducation"
import CreateEmpExperience from "../CreateEmployeeComponents/CreateEmpExperience"
import CreateEmpSkill from "../CreateEmployeeComponents/CreateEmpSkill"
import CreateEmpBank from "../CreateEmployeeComponents/CreateEmpBank"
import CreateProjectRole from "../CreateEmployeeComponents/CreateProjectRole"
import {useParams} from "react-router-dom" 
import apiHelper from "../../Helpers/ApiHelper"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const EmployeeDetail = () => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [modalState, setModalState] = useState(1)
    const [createModal, setCreateModal] = useState(false)
    const [createModalState, setCreateModalState] = useState(1)
    const [itemState, setItemState] = useState(null)
    const [url_params] = useState(useParams())
    const [empData, setEmpData] = useState({
        employee: [],
        employee_bank: [],
        employee_companies: [],
        employee_contacts: [],
        employee_dependents: [],
        employee_education: [],
        employee_skills: [],
        employee_project_roles: []
    })
    const renderUserImg = () => {
        return (
          <img
            height='110'
            width='110'
            alt='user-avatar'
            src={`${process.env.REACT_APP_PUBLIC_URL}${empData.employee.profile_image}`}
            className='img-fluid rounded mt-3 mb-2'
          />
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
    //  const MaritalStatus = [
    //     {value: 1, label: "Not Married"},
    //     {value: 2, label: "Married"}
    //  ]
     const Gender = [
        {value: 1, label: "Male"},
        {value: 2, label: "Female"}
     ] 
    const updateModel = (active, item) => {
        if (!item) {
            setItemState(null)
        } else {
            setItemState(item)
        }
        setModalState(active)
        setEditModal(true)
    }
    const createModelfunc = (active, item) => {
        if (!item) {
            setItemState(null)
        } else {
            setItemState(item)
        }
        setCreateModalState(active)
        setCreateModal(true)
    }
    const getEmployeeData = async () => {
        setLoading(true)
        if (!url_params.uuid) {
            return false   
        }
       await Api.get(`/employees/pre/complete/data/${url_params.uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const finalData = result.data
                    setEmpData(prevState => ({
                        ...prevState,
                        employee : finalData.employee,
                        employee_companies: finalData.employee_companies ? finalData.employee_companies : [],
                        employee_bank: finalData.employee_bank ? finalData.employee_bank : [],
                        employee_contacts: finalData.employee_contacts ? finalData.employee_contacts : [],
                        employee_dependents: finalData.employee_dependents ? finalData.employee_dependents : [],
                        employee_education: finalData.employee_education ? finalData.employee_education : [],
                        employee_skills: finalData.employee_skills ? finalData.employee_skills : [],
                        employee_project_roles: finalData.employee_project_roles ? finalData.employee_project_roles : []
                        }))
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
    const CallBack = () => {
        setEditModal(false)
        setCreateModal(false)
        getEmployeeData()
    }
    const UpdateModalComponent = active => {
        switch (active) {
            case 1:
                return <UpdatePersonalDetail CallBack={CallBack} empData={empData.employee}/>
            case 2:
                return <UpdateOfficeDetail CallBack={CallBack} empData={empData.employee}/>
            case 3:
                return <UpdateEmpContact CallBack={CallBack} empData={itemState} uuid={url_params.uuid}/>
            case 4:
                return <UpdateEmpExperience CallBack={CallBack} empData={itemState} uuid={url_params.uuid} />
            case 5:
                return <UpdateEmpEducation CallBack={CallBack} empData={itemState} uuid={url_params.uuid} />
            case 6:
                return <UpdateEmpSkill CallBack={CallBack} empData={itemState} uuid={url_params.uuid} />
            case 7:
                return <UpdateEmpDependent CallBack={CallBack} empData={itemState} uuid={url_params.uuid} />
            case 8:
                return <UpdateEmpBank CallBack={CallBack} empData={itemState} uuid={url_params.uuid} />
            
            default:
                return <p>No Data Found</p>
        }
    }
    const CreateModalComponent = active => {
    switch (active) {
        
        case 1:
            return <CreateEmpContact CallBack={CallBack} uuid={url_params.uuid}/>
        case 2:
            return <CreateEmpExperience CallBack={CallBack} uuid={url_params.uuid} />
        case 3:
            return <CreateEmpEducation CallBack={CallBack} uuid={url_params.uuid} />
        case 4:
            return <CreateEmpSkill CallBack={CallBack} uuid={url_params.uuid} />
        case 5:
            return <CreateEmpDependent CallBack={CallBack} uuid={url_params.uuid} />
        case 6:
            return <CreateEmpBank CallBack={CallBack} uuid={url_params.uuid} />
        case 7:
        return <CreateProjectRole CallBack={CallBack} emp_id={empData.employee.id} />
        
        default:
            return <p>No Data Found</p>
    }
    }
    const onJiraidUpdate = async (id, value) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to update the Jira Account id!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                formData['jira_account_id'] = value
                 Api.jsonPatch(`/employees/projects/roles/${id}/data/`, formData)
                    .then((result) => {
                        if (result.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Jira Account id Updated!',
                                text: 'Jira Account id is updated.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    CallBack()
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 1000)
                                }
                            })
                            } else {
                                MySwal.fire({
                                    title: 'Error',
                                    text: result.message ? result.message : 'Something went wrong',
                                    icon: 'error',
                                    customClass: {
                                      confirmButton: 'btn btn-success'
                                    }
                                  })
                            }
                    })
            } 
        })
    }
    const JiraAccountidComponent = ({ item, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        const [jiraAccountid, setJiraAccountid] = useState('')
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row min-width-300">
                <div className="col-lg-8">
               <Input 
                type='text'
                placeholder="Jira Account id"
                onChange={(e) => setJiraAccountid(e.target.value)}
               />
                    
                    <Button className="btn btn-primary btn-sm mt-1" onClick={ async () => {
                        await onJiraidUpdate(item.id, jiraAccountid).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }}>
                        Update
                    </Button>
                </div>
                <div className="col-lg-4 float-right">
                <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row min-width-225">
                    <div className="col-lg-8">
                    <b>{item.jira_account_id ? item.jira_account_id : <Badge color='light-secondary'>N/A</Badge>}</b>
                    </div>
                    
                    <div className="col-lg-4 float-right">
                        <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                     </div>
                </div>
            )
                
            }
            </div>
        )
        }
    useEffect(() => {
        getEmployeeData()
    }, [])
    
    return (
            <Fragment>
                {/* <Card className="emplyee_personal_detail">
                    <CardTitle>
                        <div className="row bg-blue">
                                <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                    <h4 color='white' className="text-center">Personal Detail</h4>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-4">
                                    <button
                                        className="border-0 no-background float-right"
                                        title="Edit Employee"
                                        onClick={() => updateModel(1)}
                                        >
                                        <Edit color="white"/>
                                    </button>
                                </div>
                        </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee).length > 0 ? (
                    <>
                        <CardBody>
                        
                            <div className="row my-1">
                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                    <p className='label'>Name: &nbsp;  &nbsp;<strong>{empData.employee.name ? empData.employee.name : 'N/A'}</strong></p>
                                    <p className='label'>Personal Email: &nbsp;  &nbsp; <strong>{empData.employee.personal_email ? empData.employee.personal_email : 'N/A'}</strong></p>
                                    <p className='label'>Father Name: &nbsp;  &nbsp; <strong>{empData.employee.father_name ? empData.employee.father_name : 'N/A'}</strong></p>
                                    <p className='label'>DOB: &nbsp;  &nbsp; <strong>{empData.employee.dob ? empData.employee.dob : 'N/A'}</strong></p>
                                    <p className='label'>Cnic: &nbsp;  &nbsp; <strong>{empData.employee.cnic_no ? empData.employee.cnic_no : 'N/A'}</strong></p>

                            </div>
                                <div className='col-lg-4 col-md-4 col-sm-4'>
                                    <p className='label'>Passport Number: &nbsp;  &nbsp; <strong>{empData.employee['passport_data'][0] ? empData.employee['passport_data'][0].passport_no : 'N/A'}</strong></p>
                                    <p className='label'>Passport Expiry Date: &nbsp;  &nbsp; <strong>{empData.employee['passport_data'][0] ? empData.employee['passport_data'][0].date_of_expiry : 'N/A'} </strong></p>
                                    <p className='label'>Blood Group: &nbsp;  &nbsp;<strong>{BloodGrup.find(pre => pre.value === empData.employee.blood_group) ? BloodGrup.find(pre => pre.value === empData.employee.blood_group).label : 'N/A'}</strong></p>
                                    <p className='label'>Gender: &nbsp;  &nbsp; <strong>{Gender.find(pre => pre.value === empData.employee.gender) ? Gender.find(pre => pre.value === empData.employee.gender).label : 'N/A'}</strong></p>
                                    <p className='label'>Marital Status: &nbsp;  &nbsp;<strong>{empData.employee.marital_status_type ? empData.employee.marital_status_type : 'N/A'}</strong></p>
                                </div>
                                <div className='col-lg-4 col-md-4 col-sm-4' >
                                    {empData.employee.profile_image ? <img src={`${process.env.REACT_APP_PUBLIC_URL}${empData.employee.profile_image}`} className="float-right" width={150} height={150}/> : <img src={user_blank}  style={{marginRright: '40px', marginTop: '20px'}}
                                    className="float-right" width={150} height={150}/>}
                                    
                                </div>
                            </div>
                        </CardBody>
                    </>
                    ) : (
                            <CardBody>
                                No Data Found
                            </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card> */}
 <Fragment>
            <Card>
            {!loading ? (
                    Object.values(empData.employee).length > 0 ? (
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
                <div className='d-flex justify-content-around my-2 pt-75'>
                  <div className='d-flex align-items-start me-2'>
                    <Badge color='light-primary' className='rounded p-75'>
                      <Check className='font-medium-2' />
                    </Badge>
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
                <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
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
                        <Badge className='text-capitalize' color="light-success">
                        {empData.employee.father_name ? empData.employee.father_name : 'N/A'}
                        </Badge>
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
                    </ul>
                  {/* ) : null} */}
                </div>
                {/* <div className='d-flex justify-content-center pt-2'>
                  <Button color='primary' onClick={() => setShow(true)}>
                    Edit
                  </Button>
                  <Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
                    Suspended
                  </Button>
                </div> */}
              </CardBody>
              </>) : (
                            <CardBody>
                                No Data Found
                            </CardBody>
                    )) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                
            </Card>
          </Fragment>

                <Card className="emplyee_office_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Office Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        {Api.role === 'admin' && (
                                            <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => updateModel(2)}
                                            >
                                            <Edit color="white"/>
                                        </button>
                                        )}
                                        
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee).length > 0 ? (
                    <>
                        <CardBody>
                            
                                <div className="row my-1">
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
                                        <p className='label'>Employment type: &nbsp;  &nbsp;<strong>{empData.employee.employee_type_title ? empData.employee.employee_type_title : 'N/A'}</strong></p>
                                        <p className='label'>Staff Classification: &nbsp;  &nbsp; <strong>{empData.employee.staff_classification_title ? empData.employee.staff_classification_title : 'N/A'}</strong></p>
                                        <p className='label'>Department: &nbsp;  &nbsp; <strong>{empData.employee.department_title ? empData.employee.department_title : 'N/A'}</strong></p>
                                        <p className='label'>Position: &nbsp;  &nbsp; <strong>{empData.employee.position_title ? empData.employee.position_title : 'N/A'}</strong></p>
                                        <p className='label'>Official Email: &nbsp;  &nbsp; <strong>{empData.employee.official_email ? empData.employee.official_email : 'N/A'}</strong></p>
                                        <p className='label'>Leaving Reason: &nbsp;  &nbsp; <strong>{empData.employee.leaving_reason ? empData.employee.leaving_reason : 'N/A'}</strong></p>
                                </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
                                    <p className='label'>Employee Code: &nbsp;  &nbsp; <strong>{empData.employee.emp_code ? empData.employee.emp_code : 'N/A'}</strong></p>
                                        <p className='label'>Official Skype: &nbsp;  &nbsp; <strong>{empData.employee.skype ? empData.employee.skype : 'N/A'}</strong></p>
                                        <p className='label'>Joining Date: &nbsp;  &nbsp; <strong>{empData.employee.joining_date ? empData.employee.joining_date : 'N/A'}</strong></p>
                                        <p className='label'>Hiring Comment: &nbsp;  &nbsp; <strong>{empData.employee.hiring_comment ? empData.employee.hiring_comment : 'N/A'} </strong></p>
                                        <p className='label'>Leaving Date: &nbsp;  &nbsp;<strong>{empData.employee.leaving_date ? empData.employee.leaving_date : 'N/A'}</strong></p>
                                        <p className='label'>Starting Salary: &nbsp;  &nbsp; <strong>{empData.employee.starting_salary ? empData.employee.starting_salary : 'N/A'}</strong></p>
                                        <p className='label'>Current Salary: &nbsp;  &nbsp; <strong>{empData.employee.current_salary ? empData.employee.current_salary : 'N/A'}</strong></p>
                                    </div>
                                </div>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>
                
                <Card className="emplyee_project_role">
                    <CardTitle className={!loading ? 'mb-0' : ''}>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Project Roles</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        {Api.role === 'admin' && (
                                            <button
                                                className="border-0 no-background float-right"
                                                title="Edit Employee"
                                                onClick={() => createModelfunc(7)}
                                                >
                                                <Plus color="white"/>
                                            </button>
                                        )}
                                        
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_project_roles).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Role</th>
                                            <th>Jira Account id</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>status/Deactivate</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_project_roles).map((pRole, key) => (
                                        <tr key={key} className={!pRole.is_active ? 'table-danger' : ''}>
                                            <td>{pRole.project_title ? pRole.project_title : 'N/a'}</td>
                                            <td>{pRole.role_title ? pRole.role_title : 'N/A'}</td>
                                            <td><JiraAccountidComponent item={pRole} index={key}/></td>
                                            <td>{pRole.start_date ? pRole.start_date : 'N/A'}</td>
                                            <td>{pRole.end_date ? pRole.end_date : <Badge color='light-success'>Not Ended</Badge>}</td>
                                            <td>
                                                {pRole.is_active ? (
                                                    <div className="d-flex row">
                                                    <div className="col">
                                                    {Api.role === 'admin' && (
                                                        <button
                                                        className="border-0 btn btn-danger"
                                                            onClick={() => EmpHelper.DeleteProjectRole(pRole.id).then(() => { getEmployeeData() })}
                                                        >
                                                        End Role 
                                                        </button>
                                                    )}
                                                    </div>
                                                </div>
                                                ) : (
                                                    <Badge color='light-danger'>Role Ended</Badge>
                                                )}
                                                
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>

                <Card className="emplyee_contact_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Contact Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Add Contact"
                                            onClick={() => createModelfunc(1)}
                                            >
                                            <Plus color="white"/>
                                        </button>
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_contacts).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Relative Name</th>
                                            <th>Relation</th>
                                            <th>Mobile No</th>
                                            <th>Landline No</th>
                                            <th>Address</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_contacts).map((contact, key) => (
                                        <tr key={key}>
                                            <td>{contact.employee_name ? contact.employee_name : 'N/A'}</td>
                                            <td>{contact.name ? contact.name : 'N/A'}</td>
                                            <td>{contact.relation_name ? contact.relation_name : 'N/A'}</td>
                                            <td>{contact.mobile_no ? contact.mobile_no : 'N/A'}</td>
                                            <td>{contact.landline ? contact.landline : 'N/A'}</td>
                                            <td>{contact.address ? contact.address : 'N/A'}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => updateModel(3, contact)}
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpContact(url_params.uuid, contact.id).then(() => { getEmployeeData() })}
                                                    >
                                                        <XCircle color="red" />
                                                    </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>

                <Card className="emplyee_Bank_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Bank Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => createModelfunc(6)}
                                            >
                                            <Plus color="white"/>
                                        </button>
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_bank).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Acc Title</th>
                                            <th>Account #</th>
                                            <th>Bank</th>
                                            <th>Branch</th>
                                            <th>IBAN #</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_bank).map((bank, key) => (
                                        <tr key={key}>
                                            <td>{bank.employee_name ? bank.employee_name : 'N/a'}</td>
                                            <td>{bank.account_title ? bank.account_title : 'N/A'}</td>
                                            <td>{bank.account_no ? bank.account_no : 'N/A'}</td>
                                            <td>{bank.bank_name ? bank.bank_name : 'N/A'}</td>
                                            <td>{bank.branch_name ? bank.branch_name : 'N/A'}</td>
                                            <td>{bank.iban ? bank.iban : 'N/A'}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => updateModel(8, bank)}
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpBank(url_params.uuid, bank.id).then(() => { getEmployeeData() })}
                                                    >
                                                        <XCircle color="red" />
                                                    </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>

                <Card className="emplyee_Experience_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Experience Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => createModelfunc(2)}
                                            >
                                            <Plus color="white"/>
                                        </button>
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_companies).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Company Name</th>
                                            <th>Designation</th>
                                            <th>Joining Date</th>
                                            <th>Leaving Date</th>
                                            <th>Leaving Reason</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_companies).map((company, key) => (
                                        <tr key={key}>
                                            <td>{company.employee_name ? company.employee_name : 'N/a'}</td>
                                            <td>{company.choosen_company_name ? company.choosen_company_name : (company.company_name ? company.company_name : 'N/A')}</td>
                                            <td>{company.designation ? company.designation : 'N/A'}</td>
                                            <td>{company.joining_date ? company.joining_date : 'N/A'}</td>
                                            <td>{company.leaving_date ? company.leaving_date : 'N/A'}</td>
                                            <td>{company.leaving_reason ? company.leaving_reason : 'N/A'}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => updateModel(4, company)}
                                                        
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpExperience(url_params.uuid, company.id).then(() => { getEmployeeData() })}
                                                    >
                                                        <XCircle color="red" />
                                                    </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>

                <Card className="emplyee_Education_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Education Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => createModelfunc(3)}
                                            >
                                            <Plus color="white"/>
                                        </button>
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_education).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Emplyee Name</th>
                                            <th>Degree Type</th>
                                            <th>Degree Title</th>
                                            <th>Institute</th>
                                            <th>Date of Completion</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_education).map((education, key) => (
                                        <tr key={key}>
                                            <td>{education.employee_name ? education.employee_name : 'N/a'}</td>
                                            <td>{education.degree_type_title ? education.degree_type_title : 'N/A'}</td>
                                            <td>{education.degree_title ? education.degree_title : 'N/A'}</td>
                                            <td>{education.selected_institute_name ? education.selected_institute_name : (education.institute_name ? education.institute_name : 'N/A')}</td>
                                            <td>{education.year_of_completion}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => updateModel(5, education)}
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpEducation(url_params.uuid, education.id).then(() => { getEmployeeData() })}
                                                    >
                                                        <XCircle color="red" />
                                                    </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>

                <Card className="emplyee_Skills_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Skills Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => createModelfunc(4)}
                                            >
                                            <Plus color="white"/>
                                        </button>
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_skills).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>employee_name</th>
                                            <th>Category</th>
                                            <th>Skill Title</th>
                                            <th>Proficiency Level</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_skills).map((skill, key) => (
                                        <tr key={key}>
                                            <td>{skill.employee_name ? skill.employee_name : 'N/a'}</td>
                                            <td>{skill.category_title ? skill.category_title : 'N/A'}</td>
                                            <td>{skill.skill_title}</td>
                                            <td>{skill.proficiency_level_title}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => updateModel(6, skill)}
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpSkill(url_params.uuid, skill.id).then(() => { getEmployeeData() })}
                                                    >
                                                        <XCircle color="red" />
                                                    </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>
                        
                <Card className="emplyee_Dependent_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Dependents Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => createModelfunc(5)}
                                            >
                                            <Plus color="white"/>
                                        </button>
                                    </div>
                                </div>
                    </CardTitle>
                    {!loading ? (
                    Object.values(empData.employee_dependents).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Dependent Name</th>
                                            <th>Relationship</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_dependents).map((dependent, key) => (
                                        <tr key={key}>
                                            <td>{dependent.employee_name ? dependent.employee_name : 'N/a'}</td>
                                            <td>{dependent.name ? dependent.name : 'N/A'}</td>
                                            <td>{dependent.relationship_name ? dependent.relationship_name : 'N/A'}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col text-center">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => updateModel(7, dependent)}
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpDependent(url_params.uuid, dependent.id).then(() => { getEmployeeData() })}
                                                    >
                                                        <XCircle color="red" />
                                                    </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                        </CardBody>
                    </>
                    ) : (
                        <CardBody>
                            No Data Found
                        </CardBody>
                    )
                    
                    ) : (
                        <div className="text-center"><Spinner /></div>
                    )}
                </Card>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    {UpdateModalComponent(modalState)}
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setCreateModal(!createModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    {CreateModalComponent(createModalState)}
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
        </Fragment>
    )
}
export default EmployeeDetail