import apiHelper from "../ApiHelper"
import { useState } from "react"
const EmployeeHelper = () => {

    const Api = apiHelper()
    const [result] = useState({
        Staff_Classification:[],
        Department:[],
        Position:[],
        Emp_types:[]
        
    })
    const employeeDropdown = useState([])
    const replacementdropdown = useState([])
    const positionDropdown = useState([])
    const fetchFormPreData = async () => {
        const response = await Api.get(`/employees/pre/data/${Api.org.id}/`)
        if (response.status === 200) {
            const data = response.data 
            if (Object.values(data).length > 0) {
                const SC = data.staff_classification
                const Dep = data.department
                const Pos = data.position
                const ET = data.employee_types
                for (let i = 0; i < SC.length; i++) {
                    result.Staff_Classification.push({value: SC[i].id, label: SC[i].title})
                }
                for (let i = 0; i < Dep.length; i++) {
                    result.Department.push({value: Dep[i].id, label: Dep[i].title})
                }
                for (let i = 0; i < Pos.length; i++) {
                    result.Position.push({value: Pos[i].id, label: Pos[i].title})
                }
                for (let i = 0; i < ET.length; i++) {
                    result.Emp_types.push({value: ET[i].level, label: ET[i].title})
                }
                 
                return result
            } else {
                Api.Toast('error', response.message)
            }
        } else {
            Api.Toast('error', response.message)
        }
    } 
    const fetchReplacementFor = async () => {
        const response = await Api.get(`/requisition/replacement/`)
        if (response) {
            const data = response
            if (Object.values(data).length > 0) {
                replacementdropdown.splice(0, data.length)
               data.forEach(element => {
                replacementdropdown.push({value: element.id, label: element.title})
               })
                return replacementdropdown
            } else {
                Api.Toast('error', 'No data Found!')
            }
        } else {
            Api.Toast('error', response.message)
        }
    } 
    const fetchPositionDropdown = async () => {
        const response = await Api.get(`/organization/positions/`)
        if (response.status === 200) {
            const data = response.data
            if (Object.values(data).length > 0) {
                positionDropdown.splice(0, data.length)
               data.forEach(element => {
                positionDropdown.push({value: element.id, label: element.title})
               })
               
                return positionDropdown
            } else {
                Api.Toast('error', 'No position Found!')
            }
        } else {
            Api.Toast('error', response.message)
        }
    }
    const fetchEmployeeDropdown = async () => {
        const response = await Api.get(`/employees/`)
        if (response.status === 200) {
            const data = response.data.active_employees
            if (Object.values(data).length > 0) {
                employeeDropdown.splice(0, data.length)
               data.forEach(element => {
                employeeDropdown.push({value: element.id, label: element.name})
               })
               
                return employeeDropdown
            } else {
                Api.Toast('error', 'No Employee Found!')
            }
        } else {
            Api.Toast('error', response.message)
        }
    } 
    const fetchEmployeeDropdownImage = async () => {
        const response = await Api.get(`/employees/`)
        if (response.status === 200) {
            const data = response.data.active_employees
            if (Object.values(data).length > 0) {
                employeeDropdown.splice(0, data.length)
               data.forEach(element => {
                employeeDropdown.push({value: element.id, label: element.name, img: element.profile_image, email: element.official_email})
               })
               
                return employeeDropdown
            } else {
                Api.Toast('error', 'No Employee Found!')
            }
        } else {
            Api.Toast('error', response.message)
        }
    } 
    // start Delete Api's for Employees
    
    const DeleteEmpContact = async (uuid, id) => {
        await Api.deleteData(`/employees/${uuid}/emergency/contact/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }

    const DeleteEmpEducation = async (uuid, id) => {
        await Api.deleteData(`/emp/${uuid}/institutes/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }

    const DeleteEmpExperience = async (uuid, id) => {
        await Api.deleteData(`/employee/${uuid}/companies/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }

    const DeleteEmpSkill = async (uuid, id) => {
        await Api.deleteData(`/employee/${uuid}/skills/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }

    const DeleteEmpDependent = async (uuid, id) => {
        await Api.deleteData(`/employees/${uuid}/dependent/contact/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }
    const DeleteEmpBank = async (uuid, id) => {
        await Api.deleteData(`/employee/${uuid}/banks/details/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }
    const DeleteProjectRole = async (id) => {
        await Api.deleteData(`/employees/projects/roles/${id}/data/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server Not Responding')
            }
        })
    }
    
    // end Delete Api's for Employees


    return {
        fetchFormPreData,
        fetchEmployeeDropdown,
        fetchEmployeeDropdownImage,
        fetchReplacementFor,
        fetchPositionDropdown,
        DeleteEmpContact,
        DeleteEmpEducation,
        DeleteEmpExperience,
        DeleteEmpSkill,
        DeleteEmpDependent,
        DeleteEmpBank,
        DeleteProjectRole
    }

}
export default EmployeeHelper