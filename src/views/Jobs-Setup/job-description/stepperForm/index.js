// ** React Imports
import { useRef, useState, useEffect } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import Job_Description_Field from './steps/Description'
import Job_Profile from './steps/Job-Profile'
import Job_Specification from './steps/Job-Specification'
import Job_Additional_Info from './steps/Additional-Info'
import JDHelper from '../../../Helpers/JDHelper'
const JobWizard = ({CallBackList}) => {
  // ** Ref
  const Helper = JDHelper()
  const ref = useRef(null)
  const [JD_data] = useState({
    JD_Profile: null,
    JD_Description: null,
    JD_Specification: null,
    JD_AdditionalInfo: null
  })
// const SubmitJD = data => {
//     const JD_postData = []
//   JD_postData.push(data.JD_Profile)
//   JD_postData.push({main_responsibilities: data.JD_Description})
//   JD_postData.push({JD_specifications: data.JD_Specification + JD_data.JD_AdditionalInfo})

// }

  // ** State
  const [stepper, setStepper] = useState(null)
  const [Dimensions, setDimensions] = useState({
    all: {},
    JDSpecifications: {},
    JDAddInfo: {}
    })
  const getDimensions = () => {
        Helper.fetchDimensions().then(data => {
            setDimensions({all: data.dim, JDSpecifications: data.JDSpecifications, JDAddInfo: data.JDAddInfo})
        })
  }  
  
  useEffect(() => {
    getDimensions()
  }, [])

 const  submitJD = async (data) => {
    await Helper.postJD(data).then(data => {
      CallBackList()
      return data
    })
  }
  const CallBack = (data, step) => {
    switch (step) {
        case '1': {
            JD_data.JD_Profile = data 
            return JD_data
        }
        case '2': {
            JD_data.JD_Description = data 
            return JD_data
        }
        case '3': {
            JD_data.JD_Specification = data 
            return JD_data
        }
        case '4': {
            JD_data.JD_AdditionalInfo = data 
            let final_data = {}
            let JDSpec = []
            JDSpec = [...JD_data.JD_Specification, ...JD_data.JD_AdditionalInfo]
            final_data = Object.assign(JD_data.JD_Profile, {main_responsibilities: JD_data.JD_Description}, {jd_specifications: JDSpec})
            submitJD(final_data)
        }
    }
      
  }
 
  const steps = [
    {
      id: 'Job-Profile',
      title: 'Job Profile',
      subtitle: 'Enter Your Details.',
      content: <Job_Profile stepper={stepper} CallBack={CallBack}/>
    },
    {
      id: 'Job-Description',
      title: 'Job Description',
      subtitle: 'Enter Your Details.',
      content: <Job_Description_Field stepper={stepper} CallBack={CallBack}/>
    },
    {
      id: 'Job-Specification',
      title: 'Job Specification',
      subtitle: 'Enter Your Details.',
      content: <Job_Specification stepper={stepper} CallBack={CallBack} Dimensions={Dimensions.JDSpecifications}/>
    },
    {
      id: 'Job-Additional-Info',
      title: 'Additional Info',
      subtitle: 'Enter Your Details.',
      content: <Job_Additional_Info stepper={stepper} CallBack={CallBack} Dimensions={Dimensions.JDAddInfo} />
    }
  ]
  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )
}

export default JobWizard
