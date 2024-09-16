import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import CreateEmpSkill from "../CreateEmployeeComponents/CreateEmpSkill"
import UpdateEmpSkill from "../UpdateEmployeeComponents/UpdateEmpSkill"
import { IoAddCircleOutline, IoCodeWorkingSharp  } from "react-icons/io5"
import { RiEditBoxFill, RiDeleteBin5Fill } from "react-icons/ri"
import apiHelper from "../../Helpers/ApiHelper"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const SkillDetail = ({empData, CallBack, url_params}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
      
        <Card className="emplyee_Skills_detail">
        <CardTitle>
                        <div className="d-flex justify-content-between bg-lightgrey">
                                <div className="d-flex">
                                    <IoCodeWorkingSharp color="#315180" size={'18px'}/> <h4>Skills Details</h4>
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
        {Object.values(empData.employee_skills).length > 0 ? (
        <>
            <CardBody>
                    <Table responsive>
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
                                            onClick={() => {
                                                setItem(skill)
                                                setEditModal(true)
                                            }}
                                        >
                                            <RiEditBoxFill color="orange" size="20px"/>
                                        </button>
                                        </div>
                                        <div className="col-lg-6">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpSkill(url_params.uuid, skill.id).then(() => { CallBack() })}
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
                    <CreateEmpSkill CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpSkill CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default SkillDetail