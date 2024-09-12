import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check, Briefcase} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import UpdatePersonalDetail from "../AddEmployee/PersonalDetail/updatePersonalDetail"
import apiHelper from "../../Helpers/ApiHelper"
import { FaUserTie } from "react-icons/fa6"
import { RiEditBoxFill } from "react-icons/ri"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const About = ({empData, CallBack}) => {
    const Api = apiHelper()
    const [editModal, setEditModal] = useState(false)
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
        <Card className="emplyee_office_detail">
        <CardTitle>
                    <div className="d-flex justify-content-between bg-lightgrey">
                        <div className="d-flex">
                            <FaUserTie color="#315180" size={'18px'}/> <h4>Personal Info</h4>
                        </div>
                        <div>
                        {Api.role === 'admin' && (
                                <button
                                className="border-0 no-background float-right"
                                title="Edit Employee"
                                style={{fontSize:'16px'}}
                                onClick={() => setEditModal(true)}
                                >
                                <RiEditBoxFill color="#315180" size={'18px'}/> update
                            </button>
                            )}
                        </div>
                    </div>
                    
        </CardTitle>
        {
        Object.values(empData.employee).length > 0 ? (
        <>
            <CardBody className="p-0">
            <Table responsive className="detail-table">
                            <thead>
                                <tr>
                                <th>Father Name</th>
                                <th>DOB</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                                <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>{empData.employee.father_name ? empData.employee.father_name : 'N/A'}</td>
                                    <td>{empData.employee.dob ? empData.employee.dob : 'N/A'}</td>
                                    <td>{Gender.find(pre => pre.value === empData.employee.gender) ? Gender.find(pre => pre.value === empData.employee.gender).label : 'N/A'}</td>
                                    <td>{BloodGrup.find(pre => pre.value === empData.employee.blood_group) ? BloodGrup.find(pre => pre.value === empData.employee.blood_group).label : 'N/A'}</td>
                                    <td>{empData.employee.personal_email ? empData.employee.personal_email : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table responsive className="detail-table">
                            <thead>
                                <tr>
                                <th>CNIC</th>
                                <th>Passport</th>
                                <th>Passport Expires</th>
                                <th>Merital Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>
                                    {empData.employee.cnic_no ? empData.employee.cnic_no : 'N/A'}
                                </td>
                                <td>{empData.employee['passport_data'][0] ? empData.employee['passport_data'][0].passport_no : 'N/A'}</td>
                                    <td>{empData.employee['passport_data'][0] ? empData.employee['passport_data'][0].date_of_expiry : 'N/A'}</td>
                                    <td>{empData.employee.marital_status_type ? empData.employee.marital_status_type : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </Table>
            </CardBody>
        </>
        ) : (
            <CardBody>
                No Data Found
            </CardBody>
        )
       }
         <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                   <UpdatePersonalDetail CallBack={CallBack} empData={empData.employee} />
                    </ModalBody>
                </Modal>
    </Card> 
    )
}
export default About