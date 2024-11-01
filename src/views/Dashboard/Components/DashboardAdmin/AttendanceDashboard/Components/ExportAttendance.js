import React from 'react'
import { Download } from 'react-feather'
import * as XLSX from 'xlsx'

const ExportAttendance = ({ list, mode }) => {
const getCurrentDate = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0') // Pad with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = date.getFullYear()
    
    return `${day}-${month}-${year}` // Format: DD-MM-YYYY
}
  const handleExport = () => {
    const currentDate = getCurrentDate()
    // Create a new workbook and a new worksheet
    const ws = XLSX.utils.json_to_sheet(list)
    const wb = XLSX.utils.book_new()
    
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, `Attendance ${mode.toUpperCase()} ${currentDate}`)
    
    // Export the workbook to a file
    XLSX.writeFile(wb, `${mode.toUpperCase()}_${currentDate}_Attendance.xlsx`)
  }

  return (
    <div>
      <button className='btn btn-success' onClick={handleExport}><Download size={14}/> Export</button>
    </div>
  )
}

export default ExportAttendance
