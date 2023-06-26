import React from 'react'
import { Chart } from 'react-google-charts'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'

const DepartmentOrganogram = ({ data }) => {
  
    const chartData = [
        ['Name', 'Manager', { type: 'string', role: 'tooltip' }, { type: 'string', role: 'style' }],
        ...data.flatMap((department) => {
          const { title, employees } = department
          return [
            [
                {
                v: title,
                f:`<h4 style="color:white; white-space:nowrap">${title}</h4>`
            }, '', '', `color: #fff font-weight: bold font-size: 26px`
        ], // Department node
            ...employees.map((employee) => {
                const profileImage = employee.profile_image ? `${process.env.REACT_APP_BACKEND_URL}${employee.profile_image}` : defaultAvatar // Use empty string if profile_image is null
              const tooltipContent = {
                v: `${employee.name} - ${employee.staff_classification_title}`,
                f: `<div style="display:flex"><img src=${profileImage} width="50" height="50"/><p style="color:white; white-space:nowrap">${employee.name}<br>${employee.staff_classification_title}</p></div>`
              }
            //   const rows = []
            //   if (employee.staff_classification_level === 10) {
            //     // Employee node with staff classification level 1
            //     rows.push([tooltipContent, title, '', ''])
            //   } else {
                // Find the previous employee with the same staff_classification_level
                // const previousEmployee = employees.find(
                //   (emp) => emp.staff_classification_level === employee.staff_classification_level - 1
                // )
        
                // if (previousEmployee) {
                //   // Child node for employee with different staff_classification_level
                //   rows.push(['', previousEmployee.name, '', employee.name])
                // } else {
                //   // Employee node with staff classification level 1 (if no previous employee found)
                //   rows.push([tooltipContent, title, '', ''])
                // }
            //   }
        
            //   return rows
            //   if (employee.staff_classification_level < 4) {
            //     rows.push([
            //         tooltipContent, 
            //         title, // Manager
            //         employee.staff_classification_title,
            //         // Tooltip content
            //         `background-image: url(${profileImage}) background-size: cover` // Style for profile image
            //       ])
            //   } else {
            //     rows.push([
            //         tooltipContent, 
            //         title, // Manager
            //         employee.staff_classification_title,
            //         // Tooltip content
            //         `background-image: url(${profileImage}) background-size: cover` // Style for profile image
            //       ])
            //   }
              return ([
                    tooltipContent, 
                    title, // Manager
                    employee.staff_classification_title,
                    // Tooltip content
                    `background-image: url(${profileImage}) background-size: cover` // Style for profile image
                    ])
            })
          ]
        })
      ]
   
    // const test = () => {
    //     console.warn(chartData)
    // }
      return (
        <>
        {/* <button onClick={test}>Test</button> */}
        <Chart
          width={'50%'}
          height={'auto'}
          backgrou
          chartType="OrgChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            allowHtml: true,
            color: '#315180',
            layout: 'horizontal' // Set the layout to horizontal
          }}
        />
        </>
      )

    }
    

export default DepartmentOrganogram
