import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import CreateEmpEducation from "../CreateEmployeeComponents/CreateEmpEducation"
import UpdateEmpEducation from "../UpdateEmployeeComponents/UpdateEmpEducation"
import { IoAddCircleOutline  } from "react-icons/io5"
import { RiEditBoxFill, RiGraduationCapFill, RiDeleteBin5Fill } from "react-icons/ri"
import apiHelper from "../../Helpers/ApiHelper"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const EducationDetail = ({empData, CallBack, url_params}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Education_detail">
                    <CardTitle>
                            <div className="d-flex justify-content-between bg-lightgrey">
                                <div className="d-flex">
                                    <RiGraduationCapFill    color="#315180" size={'18px'}/> <h4>Education Details</h4>
                                </div>
                                <div>
                                    {/* {Api.role === 'admin' && ( */}
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Add Bank detail"
                                            style={{fontSize:'14px'}}
                                            onClick={() => setCreateModal(true)}
                                            >
                                            <IoAddCircleOutline  color="#315180" size={'18px'}/> New
                                        </button>
                                    {/* )} */}
                                </div>
                            </div>
                    </CardTitle>
                    {Object.values(empData.employee_education).length > 0 ? (
                    <>
                        <CardBody>
                                <Table responsive>
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
                                                        onClick={() => {
                                                            setItem(education)
                                                            setEditModal(true)
                                                        }}
                                                    >
                                                        <RiEditBoxFill color="orange" size="20px"/>
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpEducation(url_params.uuid, education.id).then(() => { CallBack() })}
                                                    >
                                                        <RiDeleteBin5Fill color="red" size="20px"/>
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
                    )}
                <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setCreateModal(!createModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <CreateEmpEducation CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpEducation CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default EducationDetail