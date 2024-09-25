import { useState, useEffect, Fragment} from "react" 
import {Label, Row, Col, Form, Spinner, Badge, Modal, ModalBody, ModalHeader, Input} from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
import { PlusSquare } from "react-feather"
const CreateEmpSkill = ({uuid, CallBack}) => {
    const Api = apiHelper()
    const [skillCategoryList] = useState([])
    const [loading, setLoading] = useState(false)
    const [skillsList] = useState([])
    const [filterSkills] = useState([])
    const [proficencyList] = useState([])
    const [emplSkill, setEmployeeSkill] = useState({
         skillCategory : '',
         skillName : '',
         proficencyLevel : ''
    })
    const [skillDisable, setSkillDisable] = useState(true)
    const [createModal, setCreateModal] = useState(false)
    const onChangeSkillHandler = (InputName, InputType, e) => {
        
         let InputValue
         if (InputType === 'input') {
            
            InputValue = e.target.value
         } else if (InputType === 'select') {
            
            InputValue = e
         }
        
         setEmployeeSkill(prevState => ({
            ...prevState,
           [InputName] : InputValue
         }))
    }
  
    const  onCategoryChange = cat_id => {
        if (cat_id) {
                const newArray = skillsList.filter(function (el) { return el.category === cat_id })
                filterSkills.splice(0, filterSkills.length)
                for (let i = 0; i < newArray.length; i++) {
                    filterSkills.push({value: newArray[i].value, label: newArray[i].label})
                }
                onChangeSkillHandler('skillCategory', 'select', cat_id)
                setSkillDisable(false)
        }
        return false
    }
    const Submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (emplSkill.skillName !== ''
         && emplSkill.proficencyLevel !== '') {
            const formData = new FormData()
            formData['skill'] = emplSkill.skillName.value
            formData['proficiency_level'] = emplSkill.proficencyLevel.value
        await Api.jsonPost(`/employee/${uuid}/skills/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        // const finalResult = result.data
                        CallBack()
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/employee/pre/skills/data/details/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            proficencyList.splice(0, proficencyList.length)
            skillCategoryList.splice(0, skillCategoryList.length)
            skillsList.splice(0, skillsList.length)
            if (result.status === 200) {
                const category_result = result.data.skill_category
                const proficiency_result = result.data.proficiency_level
                const skills_result = result.data.skills
                for (let i = 0; i < category_result.length; i++) {
                    skillCategoryList.push({value: category_result[i].id, label: category_result[i].title})
                }
                for (let j = 0; j < proficiency_result.length; j++) {
                    proficencyList.push({value: proficiency_result[j].id, label: proficiency_result[j].title})
                }
                for (let k = 0; k < skills_result.length; k++) {
                    skillsList.push({value: skills_result[k].id, label: skills_result[k].title, category: skills_result[k].category})
                }
                if (emplSkill.skillCategory !== '') {
                    onCategoryChange(emplSkill.skillCategory)
                }
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
        return false
     } 
    useEffect(() => {
        getPreData()
    }, [])
    const addSkillRouter = (cat_id) => {
            const [newSkillName, setNewSkillName] = useState('')
            const [exist, setExist] = useState(false)
            const onChangeSkillName = (value) => {
                if (value) {
                    const exists = filterSkills.some(pre => pre.label.toLowerCase() === value.toLowerCase())
                    if (exists) {
                        setExist(exists)
                    } else {
                        setExist(exists)
                        setNewSkillName(value)
                    }
                }            
            }
            const SaveSkill = async (e, catID) => {
                e.preventDefault()
                if (newSkillName !== ''
                && catID) {
                    const formData = new FormData()
                    formData['category'] = catID
                    formData['title'] = newSkillName
                await Api.jsonPost(`/skills/`, formData)
                    .then(result => {
                        if (result) {
                            Api.Toast('success', 'Skill Added!') 
                            setCreateModal(!createModal)
                            getPreData()
                        } else {
                            Api.Toast('error', 'Server Not Responding')
                        }
                    })
                } else {
                    Api.Toast('error', 'Please fill all required fields')
                }
            }
            return (
                <>
                    <Row>
                        <Col md="8" className="mb-1">
                            <Label className="form-label">
                            Skill Name <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Input
                                type="text"
                                name="skillName"
                                onChange={ (e) => { onChangeSkillName(e.target.value) } }
                                />
                                {exist && (
                                    <small className="text-danger">Skill already exist!</small>
                                )}
                        </Col>
                        <Col md="4" className="mb-1">
                            {exist ? (
                                <button className="btn-next float-left btn btn-primary mt-2" title="This skill already exist add another!" disabled><span className="align-middle d-sm-inline-block d-none">Add Skill</span></button>
                            ) : (
                                <button className="btn-next float-left btn btn-primary mt-2" onClick={(e) => SaveSkill(e, cat_id)} ><span className="align-middle d-sm-inline-block d-none">Add Skill</span></button>
                            )}
                            
                        </Col>
                    </Row>
                </>
            )
        }
    return (
        <Fragment>
            {!loading ? (
                <Form>
                    <Row>
                        <Col md="6" className="mb-1">
                            <Label className="form-label">
                        Skill Category <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Select 
                            type="text"
                            options={skillCategoryList}
                            name="skillCategory"
                            defaultValue={emplSkill.skillCategory !== '' && skillCategoryList.find(pre => pre.value === emplSkill.skillCategory)}
                            onChange={ (e) => { onCategoryChange(e.value) }}
                            />
                        </Col>
                        <Col md="6" className="mb-1">
                            <Label className="form-label">
                            Skill Name <Badge color='light-danger'>*</Badge> {!skillDisable ? <small>if skill not in list add new <PlusSquare onClick={() => setCreateModal(true)} size={'20px'} color='green'/></small> : <small>category required for skills!</small>}
                            </Label>
                            <Select
                                type="text"
                                options={filterSkills}
                                name="skillName"
                                onChange={ (e) => { onChangeSkillHandler('skillName', 'select', e) }}
                                isDisabled={skillDisable}
                                />
                        </Col>
                        <Col md="6" className="mb-1">
                            <Label className="form-label">
                            Proficiency level <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Select
                            type="text" 
                            name="proficencyLevel"
                            options={proficencyList}
                            onChange={ (e) => { onChangeSkillHandler('proficencyLevel', 'select', e) }}
                            />
                        </Col>
                    </Row>
                    <Row>    
                        <Col md="12" className="mb-1">
                            <button className="btn-next float-right btn btn-success" onClick={(e) => Submit(e)}><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <div className="text-center"><Spinner/></div>
            )}
            <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setCreateModal(!createModal)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>  
                {addSkillRouter(emplSkill.skillCategory)}  
                    {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default CreateEmpSkill