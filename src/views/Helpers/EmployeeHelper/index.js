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

    const fetchFormPreData = async () => {
        const response = await Api.get(`/employees/pre/data/${Api.org.id}/`)
        // console.warn(response)
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
    
    // end Delete Api's for Employees


    return {
        fetchFormPreData,
        DeleteEmpContact,
        DeleteEmpEducation,
        DeleteEmpExperience,
        DeleteEmpSkill,
        DeleteEmpDependent,
        DeleteEmpBank
    }

}
export default EmployeeHelper