import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Form, Table, Spinner} from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"
import { XCircle } from 'react-feather'

const SkillDetail = ({emp_state}) => {

    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [skillArray] = useState([])
    const [skillCategoryList] = useState([])
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
    const removeAction = async (value, item_id) => {
        setLoading(true)
         const uuid = emp_state['emp_data'].uuid
        await Api.deleteData(`/employee/${uuid}/companies/${item_id}`, {method:"Delete"})
             .then(result => {
                 if (result) {
                     if (result.status === 200) {
                         skillArray.splice(value)
                         Api.Toast('success', result.message)
                     } else {
                         Api.Toast('error', result.message)
                     }
                 } else {
                     Api.Toast('error', 'Server Not Responding')
                 }
             })
        setTimeout(() => {
          setLoading(false)
        }, 1000)
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
        const uuid = emp_state['emp_data'].uuid
        if (emplSkill.skillName !== ''
         && emplSkill.proficencyLevel !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['skill'] = emplSkill.skillName.value
            formData['proficiency_level'] = emplSkill.proficencyLevel.value
        await Api.jsonPost(`/employee/${uuid}/skills/`, formData)
            .then(result => {
                if (result) {
                    if (result.status === 200) { 
                        const finalResult = result.data
                        console.warn(finalResult)
                        // for (let i = 0; i < finalResult.length; i++) {
                            skillArray.push(finalResult)
                        // }  
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server Not Responding')
                }
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
         } else {
            Api.Toast('error', 'Please fill all required fields')
         }
        
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
        <Fragment>
             <Form >
                <Row>
                    <Col md="6" className="mb-1">
                        <Label className="form-label">
                       Skill Category
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
                        Skill Name
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
                        Proficiency level
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
           
            {!loading ? (
                Object.values(skillArray).length > 0 ? (
                    <Table bordered striped responsive className='my-1'>
                        <thead className='table-dark text-center'>
                        <tr>
                            <th scope="col" className="text-nowrap">
                            Employee
                            </th>
                            <th scope="col" className="text-nowrap">
                            Skill Name
                            </th>
                            <th scope="col" className="text-nowrap">
                           Proficency Level
                            </th>
                            <th scope="col" className="text-nowrap">
                            Actions
                            </th>
                        </tr>
                        </thead>
                        
                        <tbody className='text-center'>
                            {Object.values(skillArray).map((item, key) => (
                                    <tr key={key}>
                                    <td>{item.employee_name ? item.employee_name : 'N/A'}</td>
                                    <td>{item.skill_title ? item.skill_title : 'N/A'}</td>
                                    <td>{proficencyList.find(pre => pre.value === item.proficiency_level) ? proficencyList.find(pre => pre.value === item.proficiency_level).label : 'N/A'}</td>
                                    <td>
                                        <div className="d-flex row">
                                        <div className="col">
                                            <button
                                            className="border-0"
                                            onClick={() => removeAction(key, item.id)}
                                            >
                                            <XCircle color="red" />
                                            </button>
                                        </div>
                                        </div>
                                    </td>
                                    </tr>
                                    ) 
                            )}
                        
                        </tbody>
                        
                    </Table>
                
                  ) : null
            ) : (
                <div className="text-center"><Spinner/></div>
            )}
            
        </Fragment>
    )
}
export default SkillDetail