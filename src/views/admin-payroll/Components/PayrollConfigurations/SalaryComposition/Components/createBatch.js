import React from 'react'
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Badge
} from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const PayrollBatch = ({ DiscardModal }) => {
  const Api = apiHelper()
  const { control, handleSubmit } = useForm({
    defaultValues: {
    title:''
    // country:''
    }
  })
  // const country_options = [
  //   { label: 'Pakistan', value: 'PK' },
  //   { label: 'United Arab Emirates (Dubai)', value: 'AE' },
  //   { label : 'United States of America', value: 'US'}
  // ]
  const onSubmit = async(data) => {
    const formData = new FormData()
    if (data.title !== '') {
    formData['title'] = data.title
    // formData['country'] = data.country.value
    Api.jsonPost(`/payroll/batch/`, formData).then(result => {
      if (result) {
          if (result.status === 200) {
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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
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
  {/* <Col xs={6}>
    <Label className='form-label' for='title'>
      Country<Badge color='light-danger'>*</Badge>
    </Label>
    <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                options={country_options}
                {...field}
                isSearchable={false} // Hide the search bar
                placeholder="Country"
              />
            )}
          />
  </Col> */}
        <Col className="text-center mt-2" xs={12}>
          <Button type="submit" color="primary" className="me-1">
            Next
          </Button>
          <Button type="reset" outline onClick={onReset}>
            Discard
          </Button>
        </Col>
      </Row>
      </form>
  )
}

export default PayrollBatch
