// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge
  } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
  // ** Third Party Components
  import { useForm, Controller } from 'react-hook-form'
  import Flatpickr from 'react-flatpickr'
  import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
  const UpdateStaffClassification = ({ staffclassification, dropdown, CallBack, DiscardModal, payroll_attribute, payroll_batch }) => {
      const Api = apiHelper()
      const {
          reset,
          control,
          handleSubmit
        } = useForm({
        defaultValues: {
        staff_classification: staffclassification.staff_classification_title,
        amount: staffclassification.amount
          }
        })
        const onSubmit = async (data) => {
          if (data.amount !== '' && data.staff_classification !== '') {
              const formData = new FormData()
              const matchingOption = dropdown.find((option) => option.label === data.staff_classification)
              formData['amount'] = data.amount
              formData['staff_classification'] = matchingOption.value
              formData['payroll_attribute'] = payroll_attribute
              formData['payroll_batch'] = payroll_batch
             await Api.jsonPatch(`/payroll/monthly/distribution/limit/${staffclassification.id}/`, formData).then(result => {
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
          reset({ title: '' })
        }
    return (
  <Row tag='form' onSubmit={handleSubmit(onSubmit)}>
    <Col xs={6}>
      <Label className='form-label' for='title'>
        Staff Classification<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
    name='staff_classification'
    control={control}
    render={({ field }) => (
      <Input {...field} id='staff_classification' placeholder='' readOnly />
      )}
      />
    </Col>
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
  
  export default UpdateStaffClassification