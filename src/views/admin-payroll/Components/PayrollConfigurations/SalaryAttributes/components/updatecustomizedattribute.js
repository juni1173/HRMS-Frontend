// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge
  } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
  // ** Third Party Components
  import { useForm, Controller } from 'react-hook-form'
  import Flatpickr from 'react-flatpickr'
  import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
  const UpdateCustomizedAttribute = ({ attribute, CallBack, DiscardModal }) => {
      const Api = apiHelper()
      const base_options = [
        { label: 'Organization Base', value: 'Organization Base' },
        { label: 'Employee Base', value: 'Employee Base' }
      ]
      // const taxable_options = [
      //   { label: 'Taxable', value: true },
      //   { label: 'Non-Taxable', value: false }
      // ]
      const {
          reset,
          control,
          handleSubmit,
          setValue
        } = useForm({
        defaultValues: {
        title: attribute.title,
        payroll_type: attribute.payroll_type,
        // is_Taxable: attribute.is_Taxable,
        is_employee_base: attribute.is_employee_base,
        is_organization_base: attribute.is_organization_base
          }
        })
        const onSubmit = async (data) => {
          if (data.title !== '' && data.payroll_type !== '' && data.is_Taxable !== '' && data.is_employee_base !== '' && data.is_organization_base !== '') {
              const formData = new FormData()
              formData['title'] = data.title
              formData['payroll_type'] = data.payroll_type
              formData['is_Taxable'] = data.is_Taxable
              formData['is_employee_base'] = data.is_employee_base
              formData['is_organization_base'] = data.is_organization_base
              await Api.jsonPatch(`/payroll_compositions/customizedpayrollattributes/${attribute.id}/`, formData).then(result => {
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
        Title<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='title'
        control={control}
        render={({ field }) => (
          <Input {...field} id='title' placeholder='Enter title' readOnly/>
        )}
      />
    </Col>
  {/* <Col xs={6}>
<Label className='form-label' for='title'>
    Taxable<Badge color='light-danger'>*</Badge>
  </Label>
    <Controller
    name='is_Taxable'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='is_Taxable'
        placeholder='Select'
        options={taxable_options}
        value={taxable_options.find((option) => option.value === field.value)}
        onChange={(selectedOption) => {
            field.onChange(selectedOption.value) 
          }}
      />
    )}
  /></Col> */}
      <Col xs={6}>
<Label className='form-label' for='title'>
    Base Flag<Badge color='light-danger'>*</Badge>
  </Label>
    <Controller
    name='is_employee_base'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='is_employee_base'
        placeholder='Select'
        options={base_options}
        value={base_options[field.value ? 1 : 0]}
        onChange={(selectedOption) => {
          const isEmployeeBase = selectedOption.value === 'Employee Base'
setValue('is_organization_base', !isEmployeeBase)
setValue('is_employee_base', isEmployeeBase)
          }}
      />
    )}
  /></Col>
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
  
  export default UpdateCustomizedAttribute