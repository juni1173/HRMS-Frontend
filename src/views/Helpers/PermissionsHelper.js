import React from 'react'

const PermissionsHelper = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const user_role = userData.user_role
    if (user_role === 'admin') {
      window.location.href = "/admin/dashboard"
    } else {
        window.location.href = "/employee/dashboard"
    
    }
  return (
        user_role
  )
}

export default PermissionsHelper