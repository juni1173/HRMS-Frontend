import { useState, useEffect} from "react" 
import {Label, Row, Col, Form, Spinner, Badge} from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
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
            console.warn(Object.values(skillsList))
                const newArray = skillsList.filter(function (el) { return el.category === cat_id })
                filterSkills.splice(0, filterSkills.length)
                for (let i = 0; i < newArray.length; i++) {
                    filterSkills.push({value: newArray[i].value, label: newArray[i].label})
                }
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
                        const finalResult = result.data
                        console.warn(finalResult)
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
    const getPreData = () => {
        setLoading(true)
        Api.get(`/employee/pre/skills/data/details/`, { headers: {Authorization: Api.token} }).then(result => {
        if (result) {
            console.warn(result)
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
  return (
    !loading ? (
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
                    onChange={ (e) => { onCategoryChange(e.value) }}
                    />
                </Col>
                <Col md="6" className="mb-1">
                    <Label className="form-label">
                    Skill Name <Badge color='light-danger'>*</Badge>
                    </Label>
                    <Select
                        type="text"
                        options={filterSkills}
                        name="skillName"
                        onChange={ (e) => { onChangeSkillHandler('skillName', 'select', e) }}
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
    )
        
  )
}

export default CreateEmpSkill