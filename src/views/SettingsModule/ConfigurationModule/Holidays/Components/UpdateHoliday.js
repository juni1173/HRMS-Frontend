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
  
  const UpdateHoliday = ({ holiday, CallBack, DiscardModal }) => {
      const Api = apiHelper()
    
      const {
          reset,
          control,
          handleSubmit
        } = useForm({
          defaultValues: {
            title: holiday.title,
            date: holiday.date, 
            description: holiday.description
          }
        })
        const onSubmit = async (data) => {
          if (data.title && data.date) {
              console.log(data.title, data.date, data.description)
              const formData = new FormData()
              formData['title'] = data.title
              formData['date'] = data.date
              formData['description'] = data.description
              await Api.jsonPatch(`/reimbursements/employees/yearly/official/holidays/${holiday.id}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                        CallBack()
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
        Title<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='title'
        control={control}
        render={({ field }) => (
          <Input {...field} id='title' placeholder='Enter title' />
        )}
      />
    </Col>
  
    <Col xs={6}>
      <Label className='form-label' for='date'>
        Date<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='date'
        control={control}
        render={({ field }) => (
          <Input {...field} id='date' type='date' placeholder='Select a date'  />
        )}
      />
    </Col>
  
    <Col xs={12}>
      <Label className='form-label' for='description'>
        Description
      </Label>
      <Controller
        name='description'
        control={control}
        render={({ field }) => (
          <Input {...field} id='description' placeholder='Enter description' />
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
  
  export default UpdateHoliday