// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge, 
    Spinner
  } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
  // ** Third Party Components
  import { useForm, Controller } from 'react-hook-form'
  import Flatpickr from 'react-flatpickr'
  import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useEffect, useState } from 'react'
  const UpdateAttribute = ({ attribute, CallBack, DiscardModal }) => {
      const Api = apiHelper()
      const [valueTypedropdown, setvalueTypedropdown] = useState([])
      // const [loading, setLoading] = useState(true)
      const category_options = [
        { label: 'Addon', value: 'Addon' },
        { label: 'Deduction', value: 'Deduction' }
      ]
      // const payment_frequency_options = [
      //   { label: 'Monthly', value: 'Monthly' },
      //   { label: 'Yearly', value: 'Yearly' }
      // ]
      // const type_options = [
      //   { label: 'Fixed', value: 'Fixed' },
      //   { label: 'Variable', value: 'Variable' },
      //   { label: 'Formula', value: 'Formula' },
      //   { label: 'FFSC', value: 'FFSC' },
      //   { label: 'FFGS', value: 'FFGS' },
      //   { label: 'VSC', value: 'VSC' },
      //   { label: 'VGS', value: 'VGS' }
      // ]
      // const taxable_options = [
      //   { label: 'Taxable', value: true },
      //   { label: 'Non-Taxable', value: false }
      // ]
      const base_options = [
        { label: 'Organization Base', value: 'Organization Base' },
        { label: 'Employee Base', value: 'Employee Base' }
      ]
      const getData = async () => {
        const updatedDropdown = []
        await Api.get(`/payroll_compositions/valueTypechoices/`).then(result => {
          if (result) {
            if (result.status === 200) {
              for (let i = 0; i < result.data.length; i++) {
                if (result.data[i].is_active) {
                  updatedDropdown.push({ value: result.data[i].id, label: result.data[i].title })
                }
              }
              setvalueTypedropdown(updatedDropdown) // Update the valueTypedropdown state
            } else {
              Api.Toast('error', result.message)
            }
          } else {
            Api.Toast('error', 'Server not responding')
          }
        })
      }
      useEffect(() => {
getData()
      }, [setvalueTypedropdown])
      const {
          reset,
          control,
          handleSubmit,
          setValue
        } = useForm({
        defaultValues: {
        title: attribute.title,
        payroll_type: attribute.payroll_type,
        valueType: attribute.valueType,
        // is_Taxable: attribute.is_Taxable,
        is_employee_base: attribute.is_employee_base,
        is_organization_base: attribute.is_organization_base,
        payment_frequency: attribute.payment_frequency
          }
        })
        const onSubmit = async (data) => {
          if (data.title !== '' && data.payroll_type !== '' && data.valueType !== '' && data.is_Taxable !== '' && data.is_employee_base !== '' && data.is_organization_base !== '' && data.payment_frequency !== '') {
              const formData = new FormData()
              formData['title'] = data.title
              formData['payroll_type'] = data.payroll_type
              formData['valueType'] = data.valueType
              // formData['is_Taxable'] = data.is_Taxable
              formData['is_employee_base'] = data.is_employee_base
              formData['is_organization_base'] = data.is_organization_base
              // formData['payment_frequency'] = data.payment_frequency
              await Api.jsonPatch(`/payroll/addons/attributes/${attribute.id}/`, formData).then(result => {
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
      // <>
      // { !loading ? (
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
  <Label className='form-label' for='title'>
    Category<Badge color='light-danger'>*</Badge>
  </Label>
  <Controller
    name='payroll_type'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='payroll_type'
        placeholder='Select Category'
        options={category_options}
        value={category_options.find((option) => option.value === field.value)}
        onChange={(selectedOption) => {
            field.onChange(selectedOption.value) // Store the selected value in the form state
          }}
      />
    )}
  />
   
</Col>
<Col xs={6}>
<Label className='form-label' for='title'>
    Type<Badge color='light-danger'>*</Badge>
  </Label>
    <Controller
    name='valueType'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='valueType'
        placeholder='Select Type'
        options={valueTypedropdown}
        value={valueTypedropdown.find((option) => option.value === field.value)}
        onChange={(selectedOption) => {
            field.onChange(selectedOption.value) 
          }}
      />
    )}
  /></Col>
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
      {/* <Col xs={6}>
<Label className='form-label' for='title'>
    Payment Frequency<Badge color='light-danger'>*</Badge>
  </Label>
    <Controller
    name='payment_frequency'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='payment_frequency'
        placeholder='Select'
        options={payment_frequency_options}
        value={payment_frequency_options.find((option) => option.value === field.value)}
        onChange={(selectedOption) => {
          field.onChange(selectedOption.value) 
        }}
      />
    )}
  /></Col> */}
    <Col className='text-center mt-2' xs={12}>
      <Button type='submit' color='primary' className='me-1'>
        Submit
      </Button>
      <Button type='reset' outline onClick={onReset}>
        Discard
      </Button>
    </Col>
  </Row>
  // ) : (<div className='text-center'><Spinner type='grow' color='white'/></div>)}
  // </>
    )
  }
  
  export default UpdateAttribute