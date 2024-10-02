import React from 'react'
import { useSelector } from 'react-redux'
const PermissionsHelper = () => {
  const userData = useSelector((state) => state.auth.userData)
    if (userData) {
    const user_role = userData.user_role
  return (
        user_role
  )
} return null
}

export default PermissionsHelper