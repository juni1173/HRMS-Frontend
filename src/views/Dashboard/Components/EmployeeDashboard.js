import React, { Fragment, useEffect } from 'react'
import PermissionsHelper from '../../Helpers/PermissionsHelper'
import EmployeeDash from './EmployeeComponents'
import { useHistory } from 'react-router-dom'
const EmployeeDashboard = () => {
    const Permissions = PermissionsHelper()
    const history = useHistory()
    
    const checkPermission = () => {
      if (Permissions === 'employee') history.push('/employee/dashboard')
      if (Permissions === 'admin') history.push('/admin/dashboard')
    }
    useEffect(() => {
      checkPermission()
    }, [Permissions])
  return (
    (Permissions === 'employee') ? (
        <Fragment>
            <EmployeeDash />
        </Fragment>
    ) : (
        <div>You do not have access...</div>
    )
    
  )
}

export default EmployeeDashboard