import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import UpdateEmpBank from "../UpdateEmployeeComponents/UpdateEmpBank"
import CreateEmpBank from "../CreateEmployeeComponents/CreateEmpBank"
import { IoAddCircleOutline  } from "react-icons/io5"
import { RiEditBoxFill, RiBankFill, RiDeleteBin5Fill  } from "react-icons/ri"
import apiHelper from "../../Helpers/ApiHelper"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const BankDetail = ({empData, CallBack, url_params}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Bank_detail">
        <CardTitle>
                    <div className="d-flex justify-content-between bg-lightgrey">
                        <div className="d-flex">
                            <RiBankFill  color="#315180" size={'18px'}/> <h4>Bank Details</h4>
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
        {Object.values(empData.employee_bank).length > 0 ? (
        <>
            <CardBody>
                    <Table responsive>
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
                                            onClick={() => {
                                            setEditModal(true)
                                            setItem(bank)
                                            }}
                                        >
                                            <RiEditBoxFill color="orange" size={'20px'}/>
                                        </button>
                                        </div>
                                        <div className="col-lg-6">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpBank(url_params.uuid, bank.id).then(() => { CallBack() })}
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
                    <CreateEmpBank CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpBank CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default BankDetail