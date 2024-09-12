import React from 'react'

const PermissionsHelper = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
    const user_role = userData.user_role
  return (
        user_role
  )
} return null
}

export default PermissionsHelper