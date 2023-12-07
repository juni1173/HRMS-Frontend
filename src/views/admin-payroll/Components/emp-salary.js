import { Card, CardBody, Label, Input, Spinner, CardTitle, Row, Col, Table } from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import Select from 'react-select'
import { useState, useEffect } from "react"
const EmployeeSalary = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeData, setEmployeeData] = useState([])
    const [payroll_options, setPayroll_options] = useState([])
    const allowedoptions = [
        {value: true, label: 'Yes'},
        {value: false, label: 'No'}
    ]
    const salary_cycle_options = [
        {value: 'Monthly', label: 'Monthly'},
        {value: 'Semi-Monthly', label: 'Semi-Monthly'}
    ]
    const updateConfiguration = (employeeId, title, value) => {
        // Define your API call here, passing the necessary data
        const requestData = {
          employee: employeeId,
          [title]: value
        }
    
        Api.jsonPost(`/payroll/employee/configuration/`, requestData)
        .then((response) => {
            if (response.status === 200) {
              return Api.Toast('success', 'Data Updated Successfully')
            } else {
              return Api.Toast('error', response.message)
            }                
            })
      }
    
    const getData =  async() => {
        setLoading(true)
         await Api.get(`/payroll/employee/configuration/`).then(response => {
            setEmployeeData(response.data)
          }) 
          await Api.get(`/payroll/list/batches/`).then(response => {
            const options = response.data.map(item => ({
              value: item.id,
              label: item.title || `Batch ${item.batch_no}`
            }))
            setPayroll_options(options)
          }) 
         setTimeout(() => {
          setLoading(false)
         }, 1000)
      }
      useEffect(() => {
          getData()
      }, [])
  return (
    !loading ? (
    <div className="mx-1">
          <Table bordered striped responsive>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th>Name</th>
                                <th>Payroll Batch</th>
                                <th>Salary Cycle</th>
                                <th>Allow Slip</th> 
                                <th>Allow Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                        {employeeData.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={employee.employee_profile_image}
                    // alt={employee.empl}
                    className="mr-2"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                  <div>
                    <div><strong>{employee.employee_name}</strong></div>
                    <div>{employee.staff_classification}</div>
                  </div>
                </div>
              </td>
              <td>
                <Select
      className="mb-2"
      placeholder="TBD"
      options={payroll_options}
      onChange={(selectedOption) => {
        // Update the salary cycle value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(employee.employee_id, "payroll_batch", newValue)
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      defaultValue={
        employee.payroll_batch ? payroll_options.find(
              (option) => option.value === employee.payroll_batch
            ) : null
      }
    /></td>
              <td>
                <Select
      className="mb-2"
      placeholder="TBD"
      options={salary_cycle_options}
      onChange={(selectedOption) => {
        // Update the salary cycle value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(employee.employee_id, "takeAway", newValue)
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      // defaultValue={
      //   employee.takeAway ? salary_cycle_options.find(
      //         (option) => option.value === employee.takeAway
      //       ) : null
      // }
      defaultValue={salary_cycle_options[0]}
      isDisabled={true}
    /></td>
              <td>
              <Select
      className="mb-2"
      placeholder="TBD"
      options={allowedoptions}
      onChange={(selectedOption) => {
        // Update the allow slip value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(
          employee.employee_id,
          "is_payslip_allowed",
          newValue
        )
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      // defaultValue={
      //    allowedoptions.find(
      //         (option) => option.value === employee.is_payslip_allowed
      //       )
      // }
      defaultValue={allowedoptions[0]}
      isDisabled={true}
    />
    </td>
              <td><Select
      className="mb-2"
      placeholder="TBD"
      options={allowedoptions}
      onChange={(selectedOption) => {
        // Update the allow salary value and call the API
        const newValue = selectedOption ? selectedOption.value : null
        updateConfiguration(
          employee.employee_id,
          "is_salary_allowed",
          newValue
        )
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
      // defaultValue={
      //    allowedoptions.find(
      //         (option) => option.value === employee.is_salary_allowed
      //       )
      // }
      defaultValue={allowedoptions[0]}
      isDisabled={true}
    /></td>
            </tr>
                        ))}

                        </tbody> 
                        </Table>
    </div>
  ) : (
    <div className="container h-100 d-flex justify-content-center">
      <div className="jumbotron my-auto">
        <div className="display-3"><Spinner type='grow' color='primary'/></div>
      </div>
  </div>
  )
  )
}

export default EmployeeSalary