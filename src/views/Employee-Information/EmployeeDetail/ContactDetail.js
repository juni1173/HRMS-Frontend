import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import CreateProjectRole from "../CreateEmployeeComponents/CreateProjectRole"
import apiHelper from "../../Helpers/ApiHelper"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import UpdateEmpContact from "../UpdateEmployeeComponents/UpdateEmpContact"
import CreateEmpContact from "../CreateEmployeeComponents/CreateEmpContact"
import { IoAddCircleOutline  } from "react-icons/io5"
import { MdContactPhone } from "react-icons/md"
import { RiEditBoxFill, RiDeleteBin5Fill  } from "react-icons/ri"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const ContactDetail = ({empData, CallBack, url_params}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_contact_detail">
            <CardTitle className= 'mb-0'>
                    <div className="d-flex justify-content-between bg-lightgrey">
                        <div className="d-flex">
                            <MdContactPhone  color="#315180" size={'18px'}/> <h4>Contact Details</h4>
                        </div>
                        <div>
                            {Api.role === 'admin' && (
                                <button
                                    className="border-0 no-background float-right"
                                    title="Add Contact"
                                    style={{fontSize:'14px'}}
                                    onClick={() => setCreateModal(true)}
                                    >
                                    <IoAddCircleOutline  color="#315180" size={'18px'}/> New
                                </button>
                            )}
                        </div>
                    </div>
                    
        </CardTitle>
        
        {Object.values(empData.employee_contacts).length > 0 ? (
        <>
            <CardBody>
                    <Table responsive>
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
                                            onClick={() => {
                                                setItem(contact)
                                                setEditModal(true)
                                            
                                            }}
                                        >
                                            <RiEditBoxFill color="orange" size={"20px"}/>
                                        </button>
                                        </div>
                                        <div className="col-lg-6">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpContact(url_params.uuid, contact.id).then(() => { CallBack() })}
                                        >
                                            <RiDeleteBin5Fill color="red" size={"20px"}/>
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
                    <CreateEmpContact CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpContact CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default ContactDetail