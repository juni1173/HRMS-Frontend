import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import UpdateEmpDependent from "../UpdateEmployeeComponents/UpdateEmpDependent"
import CreateEmpDependent from "../CreateEmployeeComponents/CreateEmpDependent"
import { IoAddCircleOutline  } from "react-icons/io5"
import { FaPeopleRoof } from "react-icons/fa6"
import { RiEditBoxFill, RiDeleteBin5Fill } from "react-icons/ri"
import apiHelper from "../../Helpers/ApiHelper"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const DependentDetail = ({empData, CallBack, url_params}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Dependent_detail">
        <CardTitle>
                        <div className="d-flex justify-content-between bg-lightgrey">
                                <div className="d-flex">
                                    <FaPeopleRoof color="#315180" size={'18px'}/> <h4>Dependents Details</h4>
                                </div>
                                <div>
                                    {/* {Api.role === 'admin' && ( */}
                                        <button
                                            className="border-0 no-background float-right"
                                            title="Add Skills detail"
                                            style={{fontSize:'14px'}}
                                            onClick={() => setCreateModal(true)}
                                            >
                                            <IoAddCircleOutline  color="#315180" size={'18px'}/> New
                                        </button>
                                    {/* )} */}
                                </div>
                            </div>
        </CardTitle>
        {Object.values(empData.employee_dependents).length > 0 ? (
        <>
            <CardBody>
                    <Table responsive>
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
                                            onClick={() => {
                                                setItem(dependent)
                                                setEditModal(true)
                                            }}
                                        >
                                            <RiEditBoxFill color="orange" size="20px"/>
                                        </button>
                                        </div>
                                        <div className="col">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpDependent(url_params.uuid, dependent.id).then(() => { CallBack() })}
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
                    <CreateEmpDependent CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpDependent CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default DependentDetail