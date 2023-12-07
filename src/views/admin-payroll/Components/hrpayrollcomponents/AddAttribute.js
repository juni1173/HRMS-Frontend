import React, { Fragment, useState, useEffect } from 'react'
import {
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Col
} from 'reactstrap'
import { PlusCircle, CheckCircle } from 'react-feather'
import apiHelper from '../../../Helpers/ApiHelper'

const AddAttribute = ({CallBack, onPrevious, salarybatch, batch}) => {
  const Api = apiHelper()
  const [addondata, setaddonData] = useState([])
  const [deductiondata, setdeductiondata] = useState([])
  const [customizeddata, setcustomizeddata] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData['payroll_batch'] = batch.id
      const hrviewResponse = await Api.jsonPost(`/payroll/batch/attributes/hrview/`, formData)
      if (hrviewResponse.status === 200) {
        // setBatchData(hrviewResponse.data.predata)
        setaddonData(hrviewResponse.data.Addon)
        setdeductiondata(hrviewResponse.data.Deduction)
        setcustomizeddata(hrviewResponse.data.Customized)
      } else {
        Api.Toast('error', hrviewResponse.message)
      }
    } catch (error) {
      setLoading(false)
      Api.Toast('error', 'Server not responding')
    } finally {
      setLoading(false)
    }
  }
// const onReset = () => {
//     DiscardModal()
//   }
const handleCheckboxChange = (item) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(item.id)) {
        return prevItems.filter((selectedId) => selectedId !== item.id)
      } else {
        return [...prevItems, item.id]
      }
    })
  }
  const attributestobatch = async (formData) => {
  
    await Api.jsonPost(`/payroll/attributes/add/batch/`, formData).then((result) => {
      try {
        if (result) {
          if (result.status === 200) {
            CallBack()
          } else {
            Api.Toast('error', result.message)
          }
        } else {
          Api.Toast('error', 'Server not responding')
        }
      } catch (error) {
        Api.Toast('error', error)
      }
    })
  }

  useEffect(() => {
    getData()
  }, [setcustomizeddata, salarybatch])
const submitbatch = async() => {
await Api.jsonPost(`/payroll/create/salary/batch/`, salarybatch).then(result => {
      if (result) {
          if (result.status === 200) {
            const formData = new FormData()
            formData['payroll_batch_attribute'] = selectedItems
            formData['payroll_batch'] = batch.id
            formData['salary_batch'] = result.data.id
            attributestobatch(formData)
          } else {
              Api.Toast('error', result.message)
          }
      } else {
          Api.Toast('error', 'Server not responding')
      }
    })
}
  return (
    <div className="configuration_panel">
      {!loading ? (
        <Fragment>
          <div>
            <h3 className="brand-text">Addons</h3>
            {addondata.length > 0 ? (
              addondata.map((item, index) => (
                <FormGroup check key={index}>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={selectedItems.some((selectedItem) => selectedItem === item.id)}            
                      onChange={() => {
                        handleCheckboxChange(item)
                      }}
                    />
                    {item.payroll_attribute_title}
                  </Label>
                </FormGroup>
              ))
            ) : (
              <div className="text-center">No data found</div>
            )}
          </div>

          <div>
            <h3 className="brand-text">Deductions</h3>
            {deductiondata.length > 0 ? (
              deductiondata.map((item, index) => (
                <FormGroup check key={index}>
                  <Label check>
                  <Input
                      type="checkbox"
                      checked={selectedItems.some((selectedItem) => selectedItem === item.id)}            
                      onChange={() => {
                        handleCheckboxChange(item)
                      }}
                    />
                    {item.payroll_attribute_title}
                  </Label>
                </FormGroup>
              ))
            ) : (
              <div className="text-center">No data found</div>
            )}
          </div>

          <div>
            <h3 className="brand-text">Customized</h3>
            {customizeddata.length > 0 ? (
              customizeddata.map((item, index) => (
                <FormGroup check key={index}>
                  <Label check>
                  <Input
                      type="checkbox"
                      checked={selectedItems.some((selectedItem) => selectedItem === item.id)}            
                      onChange={() => {
                        handleCheckboxChange(item)
                      }}
                    />
                    {item.payroll_attribute_title}
                  </Label>
                </FormGroup>
              ))
            ) : (
              <div className="text-center">No data found</div>
            )}
          </div>
          <Col className="text-center mt-2" xs={12}>
          <Button type="submit" color="primary" className="me-1" onClick={submitbatch}>
            Submit
          </Button>
          <Button type="reset" outline onClick={onPrevious}>
            Back
          </Button>
        </Col>
        </Fragment>
      ) : (
        <div className="text-center">
          <Spinner type="grow" color="white" />
        </div>
      )}
    </div>
  )
}

export default AddAttribute
