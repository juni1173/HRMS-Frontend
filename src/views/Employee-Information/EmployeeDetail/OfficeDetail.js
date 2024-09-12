import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check, Briefcase} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import UpdateOfficeDetail from "../AddEmployee/OfficeDetail/UpdateOfficeDetail"
import apiHelper from "../../Helpers/ApiHelper"
import { IoBriefcase } from "react-icons/io5"
import { RiEditBoxFill } from "react-icons/ri"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const OfficeDetail = ({empData, CallBack}) => {
    const Api = apiHelper()
    const [editModal, setEditModal] = useState(false)
    
    return (
        <Card className="emplyee_office_detail">
        <CardTitle>
                    <div className="d-flex justify-content-between bg-lightgrey">
                        <div className="d-flex">
                            <IoBriefcase color="#315180" size={'18px'}/> <h4>Office Detail</h4>
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
                                <th>Type</th>
                                <th>Staff Classification</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Code</th>
                                <th>Attendance ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>
                                    {empData.employee.employee_type_title ? empData.employee.employee_type_title : 'N/A'}
                                </td>
                                <td>{empData.employee.staff_classification_title ? empData.employee.staff_classification_title : 'N/A'}</td>
                                    <td>{empData.employee.department_title ? empData.employee.department_title : 'N/A'}</td>
                                    <td>{empData.employee.position_title ? empData.employee.position_title : 'N/A'}</td>
                                    <td>{empData.employee.emp_code ? empData.employee.emp_code : 'N/A'}</td>
                                    <td>{empData.employee.id ? empData.employee.id : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table responsive className="detail-table">
                            <thead>
                                <tr>
                                <th>Joining</th>
                                <th>Leaving date</th>
                                <th>Hirring Comment</th>
                                <th>Starting Salary</th>
                                <th>Current Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>
                                    {empData.employee.joining_date ? empData.employee.joining_date : 'N/A'}
                                </td>
                                <td>{empData.employee.leaving_date ? empData.employee.leaving_date : 'N/A'}</td>
                                    <td>{empData.employee.hiring_comment ? empData.employee.hiring_comment : 'N/A'}</td>
                                    <td>{empData.employee.starting_salary ? empData.employee.starting_salary : 'N/A'}</td>
                                    <td>{empData.employee.current_salary ? empData.employee.current_salary : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table responsive className="detail-table">
                            <thead>
                                <tr>
                                <th>Official Email</th>
                                <th>Leaving Reason</th>
                                <th>Skype</th>
                                
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>
                                    {empData.employee.official_email ? empData.employee.official_email : 'N/A'}
                                </td>
                                <td>{empData.employee.leaving_reason ? empData.employee.leaving_reason : 'N/A'}</td>
                                    
                                    <td>{empData.employee.skype ? empData.employee.skype : 'N/A'}</td>
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
                   <UpdateOfficeDetail CallBack={CallBack} empData={empData.employee} />
                    </ModalBody>
                </Modal>
    </Card> 
    )
}
export default OfficeDetail