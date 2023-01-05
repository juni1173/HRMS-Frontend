
import { useRef, useState, useEffect } from 'react'
import UpdateJobProfile from './UpdateJobProfile'
import UpdateJobAdditionalInfo from './UpdateJobAdditionalInfo'
import UpdateJobDescription from './UpdateJobDescription'
import UpdateJobSpecifiction from './UpdateJobSpecification'
import Wizard from '@components/wizard'
import JDHelper from '../../../Helpers/JDHelper'
const StepperForm = ({eidtJdData, updateCallBack}) => {
  const Helper = JDHelper()
  const ref = useRef(null)
  const [JD_data] = useState({
    JD_Profile: null,
    JD_Description: null,
    JD_Specification: null,
    JD_AdditionalInfo: null
  })
//   const JD_postData = []
//   JD_postData.push(JD_data.JD_Profile)
//   JD_postData.push({main_responsibilities: JD_data.JD_Description})
//   JD_postData.push({JD_specifications: JD_data.JD_Specification + JD_data.JD_AdditionalInfo})
  

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
    console.warn(`updateData, ${data}`)
    console.warn(eidtJdData)
    await Helper.updateJD(data, eidtJdData.id).then(data => {
      updateCallBack()
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
            console.warn(final_data)
            submitJD(final_data)
        }
    }
      
  }
  const steps = [
    {
      id: 'Job-Profile',
      title: 'Job Profile',
      subtitle: 'Enter Your Details.',
      content: <UpdateJobProfile stepper={stepper} CallBack={CallBack} jobDescription={eidtJdData}/>
    },
    {
      id: 'Job-Description',
      title: 'Job Description',
      subtitle: 'Enter Your Details.',
      content: <UpdateJobDescription stepper={stepper} CallBack={CallBack} preData={eidtJdData}/>
    },
    {
      id: 'Job-Specification',
      title: 'Job Specification',
      subtitle: 'Enter Your Details.',
      content: <UpdateJobSpecifiction stepper={stepper} CallBack={CallBack} preData={eidtJdData.jd_specifications} Dimensions={Dimensions.JDSpecifications}/>
    },
    {
      id: 'Job-Additional-Info',
      title: 'Additional Info',
      subtitle: 'Enter Your Details.',
      content: <UpdateJobAdditionalInfo stepper={stepper} CallBack={CallBack} preData={eidtJdData.jd_specifications} Dimensions={Dimensions.JDAddInfo}/>
    }
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )

}

export default StepperForm