// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import GroupHead from './steps/GroupHead'
import DepartmentsInfo from './steps/DepartmentsInfo'
import OrganizationDetails from './steps/OrganizationDetails'
import StaffClassification from './steps/StaffClassification'

const SetupForm = () => {
  // ** Ref
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const GroupHeadCallBack = () => {
    setCount(current => current + 1)
  }
  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'organization-details',
      title: 'Organization Details',
      subtitle: 'Enter Your Organization Details.',
      content: <OrganizationDetails stepper={stepper} type='wizard-vertical' />
    },
    {
      id: 'step-grouphead',
      title: 'Group Head',
      subtitle: 'Add Group Heads',
      content: <GroupHead stepper={stepper} type='wizard-vertical' stepperStatus={true} list={true} createForm={true} fetchGroupHeads={GroupHeadCallBack} />
    },
    {
      id: 'staff-classification',
      title: 'Staff Classification',
      subtitle: 'Add Staff Classification',
      content: <StaffClassification stepper={stepper} type='wizard-vertical' stepperStatus={true} list={true} createForm={true} />
    },
    {
      id: 'departments',
      title: 'Departments',
      subtitle: 'Add Departments Info',
      content: <DepartmentsInfo stepper={stepper} type='wizard-vertical' count={count} stepperStatus={true} list={true} createForm={true}/>
    }
    
  ]

  return (
    <div className='vertical-wizard'>
      <Wizard
        type='vertical'
        ref={ref}
        steps={steps}
        options={{
          linear: false
        }}
        instance={el => setStepper(el)}
      />
    </div>
  )
}

export default SetupForm
