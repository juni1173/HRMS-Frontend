import { useEffect, useState, Fragment } from "react"
import { Label, Button, Table, Spinner } from "reactstrap"
import apiHelper from "../../../../../Helpers/ApiHelper"
const NewEmployeeAssignments = ({ data, training_id, CallBack }) => {
    
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [assignedEmployees] = useState(data.training_employees ? data.training_employees : [])
    const [employeesArr] = useState([])
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([])
    const getPreData = async () => {
        setLoading(true)
        if (assignedEmployees.length > 0) {
            assignedEmployees.forEach(item => {
                setSelectedEmployeeIds(prevIds => [...prevIds, item.employee])
            })
        }
        await Api.get(`/training/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    const employeesData = final.employees
                    if (employeesData.length > 0) {
                        employeesData.forEach(element => {
                            employeesArr.push({value: element.id, label: element.name})
                        })
                    }
                    
                } 
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const handleRowClick = (employeeId) => {
        const isSelected = selectedEmployeeIds.includes(employeeId)
    
        if (isSelected) {
          // If already selected, remove from the list
          setSelectedEmployeeIds(prevIds => prevIds.filter(id => id !== employeeId))
        } else {
          // If not selected, add to the list
          setSelectedEmployeeIds(prevIds => [...prevIds, employeeId])
        }
      }
      const AddEmployees = async () => {
        
        if (selectedEmployeeIds.length > 0) {
            const formData = new FormData()
            formData['training_employees'] = selectedEmployeeIds
            setLoading(true)
              
                await Api.jsonPost(`/training/employee/${training_id}/`, formData)
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
        getPreData()
        }, [])

  return (
    <Fragment>
        {!loading ? (
            <div className='row'>
                <div className="col-md-12"><h2>{data.title}</h2></div>
                <div className='col-md-7'>
                    <Label>
                        Select Employees
                    </Label>
                    <Table responsive bordered>
                        <thead className="table-dark text-center">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeesArr.length > 0 && (
                        employeesArr.map(employee => (
                            <tr key={employee.value} onClick={() => handleRowClick(employee.value)}
                            style={{ background: selectedEmployeeIds.includes(employee.value) ? '#b9c1cb' : 'white' }}>
                            <td>{employee.value}</td>
                            <td>{employee.label}</td>
                            </tr>
                        )))
                        }
                        </tbody>
                    </Table>
                </div>
                <div className='col-md-5'>
                    <h3>Selected Employee:</h3>
                    <ol>
                    {selectedEmployeeIds.length > 0 && (
                    selectedEmployeeIds.map(id => (
                        <>
                        <li key={id}><b>{employeesArr.find(val => val.value === id) ? employeesArr.find(val => val.value === id).label : 'N/A'}</b></li>
                        <hr></hr>
                        </>
                    )))}
                    </ol>
                    {selectedEmployeeIds.length > 0 && (
                        <Button className='btn btn-success' onClick={AddEmployees}>
                                Submit and Assign Selected Employees 
                        </Button>
                    )}
                    
                </div>
        </div>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}
    </Fragment>
  )
}

export default NewEmployeeAssignments