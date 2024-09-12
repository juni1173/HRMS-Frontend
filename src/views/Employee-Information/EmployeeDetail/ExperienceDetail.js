import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import UpdateEmpExperience from "../UpdateEmployeeComponents/UpdateEmpExperience"
import CreateEmpExperience from "../CreateEmployeeComponents/CreateEmpExperience"
import apiHelper from "../../Helpers/ApiHelper"
import { IoAddCircleOutline  } from "react-icons/io5"
import { RiEditBoxFill, RiTimelineView, RiDeleteBin5Fill } from "react-icons/ri"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const ExperienceDetail = ({empData, CallBack, url_params}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Experience_detail">
        <CardTitle>
        <div className="d-flex justify-content-between bg-lightgrey">
                        <div className="d-flex">
                            <RiTimelineView   color="#315180" size={'18px'}/> <h4>Experience Details</h4>
                        </div>
                        <div>
                            {Api.role === 'admin' && (
                                <button
                                    className="border-0 no-background float-right"
                                    title="Add Bank detail"
                                    style={{fontSize:'14px'}}
                                    onClick={() => setCreateModal(true)}
                                    >
                                    <IoAddCircleOutline  color="#315180" size={'18px'}/> New
                                </button>
                            )}
                        </div>
                    </div>
        </CardTitle>
        { Object.values(empData.employee_companies).length > 0 ? (
        <>
            <CardBody>
                    <Table responsive>
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
                                            onClick={() => {
                                                setItem(company)
                                                setEditModal(true)
                                            }}
                                            
                                        >
                                            <RiEditBoxFill color="orange" size="20px"/>
                                        </button>
                                        </div>
                                        <div className="col-lg-6">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpExperience(url_params.uuid, company.id).then(() => { CallBack() })}
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
                    <CreateEmpExperience CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpExperience CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default ExperienceDetail