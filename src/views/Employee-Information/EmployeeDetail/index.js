import { Fragment, useState, useEffect} from "react"
import { Edit, Plus, XCircle} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table} from "reactstrap"
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
import {useParams} from "react-router-dom" 
import apiHelper from "../../Helpers/ApiHelper"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import user_blank  from "../../../assets/images/avatars/user_blank.png"

const EmployeeDetail = () => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
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
        employee_skills: []
    })

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
    const getEmployeeData = () => {
        setLoading(true)
        if (!url_params.uuid) {
            return false   
        }
        Api.get(`/employees/pre/complete/data/${url_params.uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    console.warn(result.data)
                    const finalData = result.data
                    setEmpData(prevState => ({
                        ...prevState,
                        employee : finalData.employee,
                        employee_companies: finalData.employee_companies ? finalData.employee_companies : [],
                        employee_bank: finalData.employee_bank ? finalData.employee_bank : [],
                        employee_contacts: finalData.employee_contacts ? finalData.employee_contacts : [],
                        employee_dependents: finalData.employee_dependents ? finalData.employee_dependents : [],
                        employee_education: finalData.employee_education ? finalData.employee_education : [],
                        employee_skills: finalData.employee_skills ? finalData.employee_skills : []
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
        
        default:
            return <p>No Data Found</p>
    }
    }
    useEffect(() => {
        getEmployeeData()
    }, [])
    return (
            <Fragment>
                <Card className="emplyee_personal_detail">
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
                                    {empData.employee.profile_image ? <img src={`${process.env.REACT_APP_BACKEND_URL}/${empData.employee.profile_image}`} className="float-right" width={150} height={150}/> : <img src={user_blank}  style={{marginRright: '40px', marginTop: '20px'}}
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
                </Card>

                <Card className="emplyee_office_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Office Detail</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Edit Employee"
                                            onClick={() => updateModel(2)}
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
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
                                        <p className='label'>Employment type: &nbsp;  &nbsp;<strong>{empData.employee.employee_type_title ? empData.employee.employee_type_title : 'N/A'}</strong></p>
                                        <p className='label'>Staff Classification: &nbsp;  &nbsp; <strong>{empData.employee.staff_classification_title ? empData.employee.staff_classification_title : 'N/A'}</strong></p>
                                        <p className='label'>Department: &nbsp;  &nbsp; <strong>{empData.employee.department_title ? empData.employee.department_title : 'N/A'}</strong></p>
                                        <p className='label'>Position: &nbsp;  &nbsp; <strong>{empData.employee.position_title ? empData.employee.position_title : 'N/A'}</strong></p>
                                        <p className='label'>Official Email: &nbsp;  &nbsp; <strong>{empData.employee.official_email ? empData.employee.official_email : 'N/A'}</strong></p>
                                        <p className='label'>Leaving Reason: &nbsp;  &nbsp; <strong>{empData.employee.leaving_reason ? empData.employee.leaving_reason : 'N/A'}</strong></p>
                                </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6'>
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