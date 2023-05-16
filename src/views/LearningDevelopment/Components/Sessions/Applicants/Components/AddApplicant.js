import { Fragment, useEffect, useState } from 'react'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Select from 'react-select'
import { Button, Spinner, Label } from 'reactstrap'
const AddApplicant = ({ CallBack, session}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employees] = useState([])
    const [employee_id, setEmployeeID] = useState([])
    const getEmployees = async () => {
        setLoading(true)
            await Api.get(`/employees/`)
            .then(result => {
                if (result) {
                    if (result.status === 200) {
                        employees.splice(0, employees.length)
                        const final = result.data
                        for (let i = 0; i < final.length; i++) {
                            employees.push({value: final[i].id, label: final[i].name})
                        }
                        return employees
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding!')
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const handleEmployeeSelect = (selectedOptions) => {
        setEmployeeID(selectedOptions.map((option) => option.value))
      }
    const AddApplicant = async () => {
        if (employee_id.length > 0) {
            const employee_arr = []
            for (let i = 0; i < employee_id.length; i++) {
                employee_arr.push({employee: employee_id[i]})
            }
            setLoading(true)
                // const formData = new FormData()
                // formData['employee'] = employee_arr
                // console.warn(formData)
                // return false
                await Api.jsonPost(`/applicants/multiple/${session}/`, employee_arr)
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            Api.Toast('error', 'Please select an employee to add!')
        }
        
    }
    useEffect(() => {
        getEmployees()
    }, [])
  return (
    <Fragment>
        {!loading ? (
            <>
            <div className='row'>
                <div className='col-md-8'>
                    <Label>
                        Select Employee
                    </Label>
                    <Select 
                        type="text"
                        options={employees}
                        onChange={handleEmployeeSelect}
                        isMulti
                    />
                </div>
                <div className='col-md-4 pt-2'>
                    <Button className='btn btn-success' onClick={AddApplicant}>
                            Add Applicant
                    </Button>
                </div>
            </div>
            </>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
    </Fragment>
  )
}

export default AddApplicant