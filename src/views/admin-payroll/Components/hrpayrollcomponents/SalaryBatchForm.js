import { Spinner, Button } from "reactstrap" 
import {  useRef, useState } from "react" 
import Wizard from '@components/wizard'
import CreateBatch from "./Createbatch"
import AddAttribute from "./AddAttribute"
const SalaryBatch = ({batch, CallBack, DiscardModal }) => {
  console.log(batch)
    const ref = useRef(null)
    const [stepper, setStepper] = useState(null)
    const [salarybatch, setsalarybatch] = useState()
    const handleNext = () => {
         stepper.next()
      }
    
    const handlePrevious = () => {
         stepper.previous()
      }
      const handleStep1Complete = (dataFromStep1) => {
        setsalarybatch(dataFromStep1)
        handleNext()
      }
      let steps = []
          steps = [
          {
            id: 'create-salary-batch',
            title: 'Create Salary Batch',
            subtitle: 'Enter Salary Batch Details',
            content: <CreateBatch stepper={stepper} DiscardModal={DiscardModal} onNext={handleStep1Complete} batch={batch}/>
          },
          {
            id: 'add-salary-attributes',
            title: 'Add Salary Attributes',
            subtitle: 'Select Salary Attributes',
            content: <AddAttribute stepper={stepper} CallBack={CallBack} DiscardModal={DiscardModal} onPrevious={handlePrevious} salarybatch={salarybatch} batch={batch}/>
          }
          ]
      
    return (

        <div className="row"> 
            <div className='vertical'>
              <Wizard type='vertical' options={{ linear: false }} instance={el => setStepper(el)} ref={ref} steps={steps}/> 
            </div>
        </div>
    )
}
export default SalaryBatch