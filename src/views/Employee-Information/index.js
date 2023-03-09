import { Spinner } from "reactstrap" 
import {  useRef, useState, useEffect } from "react" 
import Wizard from '@components/wizard'
import PersonalDetail from "./AddEmployee/PersonalDetail"
import OfficeDetail from "./AddEmployee/OfficeDetail"
import BankDetail from "./AddEmployee/BankDetail"
import EducationDetail from "./AddEmployee/EducationDetail"
import ContactDetail from "./AddEmployee/ContactDetail"
import ExperienceDetail from "./AddEmployee/ExperienceDetail"
import SkillDetail from "./AddEmployee/SkillDetail"
import DependentDetail from "./AddEmployee/DependentDetail"
import EmpProjectRole from "./AddEmployee/EmpProjectRole"
const employeeInformation = () => {
    const ref = useRef(null)
    const [stepper, setStepper] = useState(null)
    const [state, setState] = useState(false)
    const [emp_state, set_emp_state] = useState([])
    const [loading, setLoading] = useState(false)
    const CallBack = (data) => {
      setLoading(true)
      set_emp_state(data)
      setState(true)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
    useEffect(() => {
        setState(false)
    }, [])
      let steps = []
        state ? (
          steps = [
          {
            id: 'personal-detail',
            title: 'Employee Personal Detail',
            subtitle: 'Enter Your Details.',
            content: <PersonalDetail stepper={stepper}  state={state} emp_state={emp_state}/>
          },
          {
            id: 'office-detail',
            title: 'Employee Office Detail',
            subtitle: 'Enter Your Details.',
            content: <OfficeDetail stepper={stepper} state={state} emp_state={emp_state}/>
          },
          {
            id: 'project-role-detail',
            title: 'Project Role Detail',
            subtitle: 'Enter Your Details.',
            content: <EmpProjectRole stepper={stepper} state={state} emp_state={emp_state}/>
          },
          {
            id: 'contact-detail',
            title: 'Employee Contact Detail',
            subtitle: 'Enter Your Details.',
            content: <ContactDetail stepper={stepper} emp_state={emp_state}/>
          },
          {
            id: 'bank-detail',
            title: 'Employee Bank Detail',
            subtitle: 'Enter Your Details.',
            content:<BankDetail stepper={stepper} emp_state={emp_state}/>
          },
          {
              id: 'education-detail',
              title: 'Employee Education Detail',
              subtitle: 'Enter Your Details.',
              content: <EducationDetail stepper={stepper} emp_state={emp_state}/>
            
          },
          {
              id: 'experience-detail',
              title: 'Work Experience Detail',
              subtitle: 'Enter Your Details.',
              content: <ExperienceDetail stepper={stepper} emp_state={emp_state}/>
          },
          {
              id: 'skill-detail',
              title: 'Employee Skill',
              subtitle: 'Enter Your Details.',
              content:<SkillDetail stepper={stepper} emp_state={emp_state}/>
            
          },
          {
              id: 'dependent-detail',
              title: 'Employee Dependent',
              subtitle: 'Enter Your Details.',
              content: <DependentDetail stepper={stepper} emp_state={emp_state}/>
            
          }
          ]
        ) : (
          steps = [
          {
            id: 'personal-detail1',
            title: 'Employee Personal Detail',
            subtitle: 'Enter Your Details.',
            content: <PersonalDetail stepper={stepper} CallBack={CallBack} state={state} />
          }
        ]
        )
      
    return (

        <div className="row"> 
            <div className='vertical'>
              {!loading ? <Wizard type='vertical' options={{ linear: false }} instance={el => setStepper(el)} ref={ref} steps={steps} /> : <div className="text-center"><Spinner /></div>}
            </div>
        </div>
    )
}
export default employeeInformation