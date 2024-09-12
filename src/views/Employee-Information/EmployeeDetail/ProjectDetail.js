import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check, Folder} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import CreateProjectRole from "../CreateEmployeeComponents/CreateProjectRole"
import apiHelper from "../../Helpers/ApiHelper"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import { IoAddCircleOutline  } from "react-icons/io5"
import { AiFillProject } from "react-icons/ai"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const ProjectDetail = ({empData, CallBack}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
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
    return (
        <Card className="emplyee_project_role">
        <CardTitle className= 'mb-0'>
                    <div className="d-flex justify-content-between bg-lightgrey">
                        <div className="d-flex">
                            <AiFillProject  color="#315180" size={'18px'}/> <h4>Project Roles</h4>
                        </div>
                        <div>
                            {Api.role === 'admin' && (
                                <button
                                    className="border-0 no-background float-right"
                                    title="Edit Employee"
                                    style={{fontSize:'14px'}}
                                    onClick={() => setCreateModal(true)}
                                    >
                                    <IoAddCircleOutline  color="#315180" size={'18px'}/> New
                                </button>
                            )}
                        </div>
                    </div>
                    
        </CardTitle>
        {
        Object.values(empData.employee_project_roles).length > 0 ? (
        <>
            <CardBody>
                    <Table responsive>
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
                                                onClick={() => EmpHelper.DeleteProjectRole(pRole.id).then(() => { CallBack() })}
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
        )}
                <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setCreateModal(!createModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <CreateProjectRole CallBack={CallBack} emp_id={empData.employee.id} />
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default ProjectDetail