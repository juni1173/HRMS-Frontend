import { useEffect, useState, Fragment} from 'react'
// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge,
    Form,
    Spinner,
    Table
  } from 'reactstrap'
  import apiHelper from '../../../Helpers/ApiHelper'
  import { Save } from 'react-feather'
  // ** Third Party Components
import '@styles/react/libs/flatpickr/flatpickr.scss'
import SelectEmployees from './SelectEmployees'
  const FixedAmount = ({content}) => {
      const Api = apiHelper() 
      const [data, setData] = useState([])
      const [loading, setLoading] = useState(false)
  //     const [fixedData, setfixedData] = useState({
  //       amount : ''
  //  })
//    const onChangeHandler = (InputName, InputType, e) => {
        
//     let InputValue
//     if (InputType === 'input') {
    
//     InputValue = e.target.value
//     } else if (InputType === 'select') {
    
//     InputValue = e
//     } else if (InputType === 'date') {
//         let dateFomat = e.split('/')
//             dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
//         InputValue = dateFomat
//     } else if (InputType === 'file') {
//         InputValue = e.target.files[0].name
//     }

//     setfixedData(prevState => ({
//     ...prevState,
//     [InputName] : InputValue
    
//     }))

// }
        const getData = async() => { 
            if (content) {
              console.log(content)
                setLoading(true)
            const formdata = new FormData()
            formdata['payroll_attribute'] = content.payroll_attribute
            formdata['payroll_batch'] = content.payroll_batch
            // formdata['salary_batch'] = batch.salary.id
            const apiendpoint = '/payroll/fixed/amount/view/'
            await Api.jsonPost(apiendpoint, formdata).then(result => {
                if (result) {
                    if (result.status === 200) {
                       setData(result.data)
                       setLoading(false)
                    } else {
                        setLoading(false)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                    setLoading(false)
                }
              })
        }
    }
    // const CallBack = () => {
    //     getData()
       
    // }
        // const submitForm = async () => {
        //   if (fixedData.amount !== '' && content.payroll_attribute !== '') {
        //     setLoading(true)
        //       const formData = new FormData()
        //       formData['amount'] = fixedData.amount
        //       formData['payroll_attribute'] = content.payroll_attribute
        //       formData['payroll_batch'] = content.payroll_batch
        //       // formData['salary_batch'] = batch.salary.id
        //       const apiendpoint = '/payroll/fixed/amount/'
        //       await Api.jsonPost(apiendpoint, formData).then(result => {
        //         if (result) {
        //             if (result.status === 200) {
        //                 CallBack()
        //                 setLoading(false)
        //             } else {
        //                 Api.Toast('error', result.message)
        //                 setLoading(false)
        //             }
        //         } else {
        //             Api.Toast('error', 'Server not responding')
        //             setLoading(false)
        //         }
        //       })
        //   } else {
        //       Api.Toast('error', 'Please fill all the fields')
        //       setLoading(false)
        //   }
        // }
       
        useEffect(() => {
            getData()
          }, [setData])
    return (
        <Fragment>
        <Row>
        {content.payroll_attribute_is_employee_base ? <SelectEmployees content={content}/> : null}
            <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Fixed Amount</h5>
        </div>
        <hr></hr>
        { !loading ? <Row>
               {/* <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Amount <Badge color='light-danger'>*</Badge>
                </label>
                <Input type="number" 
                    name="amount"
                    onChange={ (e) => { onChangeHandler('amount', 'input', e) }}
                    placeholder="Amount" />
              </Col>
              <Col md={4}>
                <Button color="primary" className="btn-next mt-2" onClick={submitForm}>
                <span className="align-middle d-sm-inline-block">
                  Save
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save>
              </Button>
                </Col> */}
                {Object.values(data).length > 0 ? (
                    <Row>
                    <div className="row">
<div className="col-md-4">
<div className="d-flex justify-content-between align-items-center">
  <span>Payroll Attribute:</span>
  <Badge color='light-warning'>
    {data.payroll_attribute_title}
  </Badge>
</div>
</div>
<div className="col-md-4">
<div className="d-flex justify-content-between align-items-center">
  <span>Amount:</span>
  <Badge color='light-info'>
    {data.amount}
  </Badge>
</div>
</div>
</div>
                </Row>
                        ) : (
                            <div className="text-center">No Data Found!</div>
                        )}
        </Row> : <div className='text-center'><Spinner type='grow' color='primary'/></div>}
            </Col>
        </Row>
    </Fragment>
    )
  }
  
  export default FixedAmount