import React from 'react'
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Badge
} from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const CreateBatch = ({ DiscardModal, onNext, batch }) => {
  const Api = apiHelper()
  const yearoptions = []
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() 
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i
    yearoptions.push({ value: year, label: year.toString() })
}
  const { control, handleSubmit } = useForm({
    defaultValues: {
     month:'',
     year:'',
     start_Date: '',
     end_date: ''
    }
  })

  const onSubmit = async(data) => {
    const formData = new FormData()
    if (data.month !== '' || data.year !== '') {
    const year = parseInt(data.year.value)
    const month = parseInt(data.month.value)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    const startDateFormatted = startDate.toISOString().slice(0, 10)
    const endDateFormatted = endDate.toISOString().slice(0, 10)
    formData['payroll_batch'] = batch.id
    formData['start_date'] = startDateFormatted
    formData['end_date'] = endDateFormatted
    formData['month'] = month
    formData['year'] = year
    onNext(formData)
    // await Api.jsonPost(`/payroll/create/salary/batch/`, formData).then(result => {
    //   if (result) {
    //       if (result.status === 200) {
    //       } else {
    //           Api.Toast('error', result.message)
    //       }
    //   } else {
    //       Api.Toast('error', 'Server not responding')
    //   }
    // })

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
          <Label className="form-label" for="from_date">
            Select month
          </Label>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <Select
                options={monthOptions}
                {...field}
                isSearchable={false} // Hide the search bar
                placeholder="Select a month"
              />
            )}
          />
        </Col>
        <Col xs={6}>
          <Label className="form-label" for="year">
            Select Year
          </Label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Select
                options={yearoptions}
                {...field}
                isSearchable={false} // Hide the search bar
                placeholder="Select a year"
              />
            )}
          />
        </Col>
        
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

export default CreateBatch
