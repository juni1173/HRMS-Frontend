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
  const UpdateSlab = ({ Slab, CallBack, DiscardModal }) => {
      const Api = apiHelper()
      const yearoptions = []
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() 
      for (let i = 0; i < 5; i++) {
        const year = currentYear - i
        yearoptions.push({ value: year, label: year.toString() })
    }
      const {
          reset,
          control,
          handleSubmit
          // setValue
        } = useForm({
          defaultValues: {
            initial_income_threshold: Slab.initial_income_threshold,
            income_ceiling: Slab.income_ceiling, 
            country: Slab.country,
            tax_rate: Slab.tax_rate,
            year: Slab.year,
            exemption_amount: Slab.exemption_amount,
            fixed_amount: Slab.fixed_amount
          }
        })
        const onSubmit = async (data) => {
          if (data.initial_income_threshold !== '' && data.income_ceiling !== '' && data.country !== '' && data.tax_rate !== '' && data.year !== '') {
              const formData = new FormData()
              formData['initial_income_threshold'] = data.initial_income_threshold
              formData['income_ceiling'] = data.income_ceiling
              formData['country'] = data.country
              formData['tax_rate'] = data.tax_rate
              formData['year'] = data.year.value
              formData['exemption_amount'] = data.exemption_amount
              formData['fixed_amount'] = data.fixed_amount
              await Api.jsonPatch(`/payroll/patch/tax/slab/${Slab.id}/`, formData).then(result => {
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
          reset({ initial_income_threshold: '', income_ceiling:'', country:'', tax_rate:'' })
        }
        const country_options = [
          { label: 'Pakistan', value: 'PK' },
          { label: 'United Arab Emirates (Dubai)', value: 'AE' },
          { label : 'United States of America', value: 'US'}
        ]
    return (
  <Row tag='form' onSubmit={handleSubmit(onSubmit)}>
    <Col xs={6}>
      <Label className='form-label' for='initial_income'>
        Initial Income<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='initial_income_threshold'
        control={control}
        render={({ field }) => (
          <Input {...field} type='number' id='initial_income_threshold' placeholder='Initial Income' />
        )}
      />
    </Col>
    <Col xs={6}>
      <Label className='form-label' for='ceiling_income'>
        Ceiling Income<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='income_ceiling'
        control={control}
        render={({ field }) => (
          <Input {...field} type='number' id='income_ceiling' placeholder='Ceiling Income' />
        )}
      />
    </Col>
    <Col xs={6}>
      <Label className='form-label' for='exemption_amount'>
        Exemption Amount
      </Label>
      <Controller
        name='exemption_amount'
        control={control}
        render={({ field }) => (
          <Input {...field} type='number' id='exemption_amount' placeholder='Exemption Amount' />
        )}
      />
    </Col>
    <Col xs={6}>
      <Label className='form-label' for='fixed_amount'>
        Fixed Amount
      </Label>
      <Controller
        name='fixed_amount'
        control={control}
        render={({ field }) => (
          <Input {...field} type='number' id='fixed_amount' placeholder='Fixed Amount' />
        )}
      />
    </Col>
    <Col xs={6}>
    <Label className='form-label' for='country'>
    Country<Badge color='light-danger'>*</Badge>
  </Label>
    <Controller
    name='country'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='country'
        placeholder='Select'
        options={country_options}
        value={country_options.find(option => option.value === field.value)}
      />
    )}
  />
    </Col>
    <Col xs={6}>
    <Label className='form-label' for='country'>
    Year<Badge color='light-danger'>*</Badge>
  </Label>
    <Controller
    name='year'
    control={control}
    render={({ field }) => (
      <Select
        {...field} // Pass the field props from the Controller
        id='year'
        placeholder='Select'
        options={yearoptions}
        value={yearoptions.find(option => option.value === field.value)}
      />
    )}
  />
    </Col>
    <Col xs={6}>
      <Label className='form-label' for='tax_rate'>
        Tax Rate<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='tax_rate'
        control={control}
        render={({ field }) => (
          <Input {...field} type='number' id='tax_rate' placeholder='Tax Rate' />
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
  
  export default UpdateSlab