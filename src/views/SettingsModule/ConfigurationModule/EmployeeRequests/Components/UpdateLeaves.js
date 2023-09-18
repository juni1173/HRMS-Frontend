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
import '@styles/react/libs/flatpickr/flatpickr.scss'
  const Update = ({ value, apiEndPoint, CallBack, DiscardModal }) => {
      const Api = apiHelper()
    
      const {
          reset,
          control,
          handleSubmit
          // setValue
        } = useForm({
          defaultValues: {
            staff_title: value.staff_classification_title,
            leave_types_title:value.leave_types_title,
            allowed_leaves: value.allowed_leaves
          }
        })
        const onSubmit = async (data) => {
          if (data.leave_types_title) {
              const formData = new FormData()
              formData['allowed_leaves'] = data.allowed_leaves
              formData['leave_types_title'] = data.leave_types_title
              await Api.jsonPatch(`${apiEndPoint}${value.id}/`, formData).then(result => {
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
        Staff Classification
      </Label>
      <Controller
        name='staff_title'
        control={control}
        render={({ field }) => (
          <Input {...field} id='title' readOnly/>
        )}
      />
    </Col>
  
    <Col xs={6}>
      <Label className='form-label' for='description'>
        Leave Type
      </Label>
      <Controller
        name='leave_types_title'
        control={control}
        render={({ field }) => (
          <Input {...field} id='leave_types_title' readOnly/>
        )}
      />
    </Col>
    <Col xs={12}>
      <Label className='form-label' for='description'>
        Allowed Leaves
      </Label>
      <Controller
        name='allowed_leaves'
        control={control}
        render={({ field }) => (
          <Input {...field} id='allowed_leaves' />
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
  
  export default Update