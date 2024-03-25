import React from 'react'
import ResumeForm from './Form'
// import { Eye } from 'react-feather'

const resume = () => {
  const onSubmit = (data) => {
    console.log(data) // You can now generate the resume based on the data
  }

  return (
    <div>
      <h1>Resume Generator</h1>
      <ResumeForm onSubmit={onSubmit} />
    </div>
  )
}

export default resume
