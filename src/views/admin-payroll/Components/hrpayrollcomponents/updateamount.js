// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge,
    Form
  } from 'reactstrap'
  import apiHelper from '../../../Helpers/ApiHelper'
  // ** Third Party Components
  import { useForm, Controller } from 'react-hook-form'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useEffect } from 'react'
  const UpdateAmount = ({ attribute, CallBack, DiscardModal, batch }) => {
      const Api = apiHelper()
      const {
         setValue,
          control,
          handleSubmit
        } = useForm({
        defaultValues: {
        amount: ''
          }
        })
        const getData = async() => { 
            const formdata = new FormData()
            formdata['payroll_attribute'] = attribute.payroll_attribute
            formdata['payroll_batch'] = batch.batch.id
            const apiendpoint =
  attribute.valueType === 'Variable' ? '/payroll/variable/amount/view/' : '/payroll/fixed/amount/view/'
            await Api.jsonPost(apiendpoint, formdata).then(result => {
                if (result) {
                    if (result.status === 200) {
                       setValue('amount', result.data.amount)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
              })
        }
        const onSubmit = async (data) => {
          if (data.amount !== '' && attribute.payroll_attribute !== '') {
              const formData = new FormData()
              formData['amount'] = data.amount
              formData['payroll_attribute'] = attribute.payroll_attribute
              formData['payroll_batch'] = batch.batch.id
              const apiendpoint =
  attribute.valueType === 'Variable' ? '/payroll/variable/amount/' : '/payroll/fixed/amount/'
              await Api.jsonPost(apiendpoint, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        CallBack()
                        DiscardModal()
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
              })
          } else {
              Api.Toast('error', 'Please fill all the fields')
          }
        }
        const onReset = () => {
          DiscardModal()
        }
        useEffect(() => {
            getData()
          }, [])
    return (
  <Row tag='form' onSubmit={handleSubmit(onSubmit)}>
    <Col xs={6}>
  <Label className='form-label' for='title'>
    Amount<Badge color='light-danger'>*</Badge>
  </Label>
  <Controller
    name='amount'
    control={control}
    render={({ field }) => (
    <Input {...field} id='amount' placeholder='Enter Amount' />
    )}
  /> 
</Col>
    <Col className='text-center mt-2' xs={12}>
      <Button type='submit' color='primary' className='me-1'>
        Submit
      </Button>
      <Button type='reset' outline onClick={onReset}>
        Discard
      </Button>
    </Col>
  </Row>
    )
  }
  
  export default UpdateAmount