// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge
  } from 'reactstrap'
  import apiHelper from '../../Helpers/ApiHelper'
  // ** Third Party Components
  import { useForm, Controller } from 'react-hook-form'
  import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
  const UpdateCandidate = ({ candidate, CallBack, DiscardModal }) => {
      const Api = apiHelper()
      const options = [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' }
        // Add more options as needed
      ]
      const statusoptions = [
        { value: 'In progress', label: 'In progress' },
        { value: 'On hold', label: 'On Hold' },
        { value: 'Converted', label: 'Converted' },
        { value: 'Rejected', label: 'Rejected' }
        
        // Add more options as needed
      ]
      const {
          reset,
          control,
          handleSubmit
          // setValue
        } = useForm({
          defaultValues: {
            remark: candidate.remark,
            lnd_remark: candidate.lnd_remark, 
            Category: candidate.Category,
            conversion_status: candidate.conversion_status
            
          }
        })
        // const onChangeParametersDetailHandler = (InputName, InputType, e) => {
        //   let InputValue
        //   if (InputType === 'date') {  
        //       InputValue = Api.formatDate(e)
        //   }
        //   setValue(InputName, InputValue)
        // }
        const onSubmit = async (data) => {
          if (data.Category) {
              const formData = new FormData()
              formData['remark'] = data.remark
              formData['lnd_remark'] = data.lnd_remark
              formData['Category'] = data.Category.value
              formData['conversion_status'] = data.conversion_status.value
              await Api.jsonPatch(`/kav_skills/${candidate.id}/`, formData).then(result => {
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
        Remark
      </Label>
      <Controller
        name='remark'
        control={control}
        render={({ field }) => (
          <Input {...field} id='remark' placeholder='Remarks' />
        )}
      />
    </Col>
  
    <Col xs={6}>
      <Label className='form-label' for='date'>
        L&D Remark 
      </Label>
      <Controller
        name='lnd_remark'
        control={control}
        render={({ field }) => (
          <Input {...field} id='lnd_remark' placeholder='L&D Remarks' />
        )}
      />
    </Col>
  
    <Col xs={6}>
      <Label className='form-label' for='description'>
        Category
      </Label>
      <Controller
        name='Category'
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            id='Category'
            options={options}
            placeholder='Select an option'
            value={options.find(option => option.value === candidate.Category)
            }
          />
        )}
      />
    </Col>
    <Col xs={6}>
      <Label className='form-label' for='description'>
        Status
      </Label>
      <Controller
        name='conversion_status'
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            id='conversion_status'
            options={statusoptions}
            placeholder='Select an option'
            value={statusoptions.find(statusoptions => statusoptions.value === candidate.conversion_status)}
          />
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
  
  export default UpdateCandidate