import React, {useEffect, useState} from 'react'
import { Row, Col, Label, Button, Badge } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { CSVLink } from 'react-csv'

const GenerateCSV = ({ selectedData, onclose }) => {
  const Api = apiHelper()

  // const [csvData, setCsvData] = useState([])
  const [accountsdropdown, setAccountsDropdown] = useState([])

  const getData = async () => {
    try {
      const response = await Api.get(`/OrganizationBankDetail/`)
      if (response.status === 200) {
        const newAccountsDropdown = response.data.map((item) => ({
          value: item.cif_number,
          label: item.account_number
        }))
        setAccountsDropdown(newAccountsDropdown)
      } else {
        Api.Toast('error', response.message)
      }
    } catch (error) {
      console.error('Error fetching organization bank details:', error)
    }
  }

  const { reset, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      date: '',
      organizationaccount: ''
    }
  })

  const onChangeParametersDetailHandler = (InputName, InputType, e) => {
    let InputValue
    if (InputType === 'date') {
      InputValue = Api.formatDate(e)
    }
    setValue(InputName, InputValue)
  }

  const onReset = () => {
    reset({ date: '', organizationaccount: '' })
    onclose()
  
  }

  const onSubmit = async (data) => {
    if (data.date !== '' && data.organizationaccount !== '') {
      const dateObject = new Date(data.date)
      const month = dateObject.getMonth() + 1
      const formattedMonth = month < 10 ? `0${month}` : `${month}`
      const csvFormattedData = selectedData.map((item) => [
        'A',
        data.organizationaccount.value,
        data.organizationaccount.label,
        item.net_salary,
        'PKR',
        Api.dmyformat(data.date),
        item.employee_name,
        item.employee_bank_account_no,
        'IBFT',
        item.bank_code,
        `Salary${formattedMonth}`,
        `Salary${formattedMonth}`
      ])
      // Programmatically trigger CSV download
      const csvLink = document.createElement('a')
      csvLink.href = URL.createObjectURL(
        new Blob([csvFormattedData.map((row) => row.join(',')).join('\n')], {
          type: 'text/csv'
        })
      )
      csvLink.setAttribute('download', `salary_file_${Date.now()}.csv`)
      document.body.appendChild(csvLink)
      csvLink.click()
      document.body.removeChild(csvLink)
    }
  }

  useEffect(() => {
    getData()
  }, [setAccountsDropdown])

  return (
    <Row tag='form' onSubmit={handleSubmit(onSubmit)}>
      <Col xs={6}>
        <Label className='form-label' for='date'>
          Date<Badge color='light-danger'>*</Badge>
        </Label>
        <Controller
          name='date'
          control={control}
          render={({ field }) => (
            <Flatpickr
              className='form-control'
              value={field.value}
              onChange={(e) => {
                onChangeParametersDetailHandler('date', 'date', e)
                field.onChange(Api.formatDate(e))
              }}
              id='date'
              placeholder='Transfer Date'
             
            />
          )}
        />
      </Col>
      <Col xs={6}>
        <Label className='form-label' for='organizationaccount'>
            Organization Account<Badge color='light-danger'>*</Badge>
        </Label>
        <Controller
          name='organizationaccount'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id='organizationaccount'
              placeholder='Select Account'
              options={accountsdropdown}
              value={accountsdropdown.find((option) => option.value === field.value)}
              onChange={(selectedOption) => {
                console.log(selectedOption)
                field.onChange(selectedOption)
              }}
            />
          )}
        />
      </Col>
      <Col className='text-center mt-2' xs={12}>
        <Button type='submit' color='primary' className='me-1'>
          Download
        </Button>
        <Button type='reset' outline onClick={onReset}>
          Discard
        </Button>
      </Col>
    </Row>
  )
}

export default GenerateCSV
