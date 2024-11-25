import React from 'react'
import { Button } from 'reactstrap'
import { BiExport } from "react-icons/bi"
import * as XLSX from 'xlsx'

const ExportExcel = ({ data }) => {


    const exportToExcel = () => {
        const wb = XLSX.utils.book_new()
      
        // Prepare the main employee details sheet
        const employeeDetails = [["Employee ID", "Employee Name", "Employee Type", "Department", "Designation", "Total KPIs"]]
        data.forEach(employee => {
          employeeDetails.push([
            employee.employee_id,
            employee.employee_name,
            employee.employee_type_title || "N/A",
            employee.department_title || "N/A",
            employee.designation_title || "N/A",
            employee.total_kpis
          ])
        })
        const ws1 = XLSX.utils.aoa_to_sheet(employeeDetails)
        XLSX.utils.book_append_sheet(wb, ws1, "Employee Info")
      
        // Prepare KPI details sheet (with Employee Name column)
        const kpiDetails = [["Employee ID", "Employee Name", "KPI ID", "KPI Title", "Status", "Status Level", "Evaluator"]]
        data.forEach(employee => {
          if (employee.employee_kpis_data?.kpis_details?.length > 0) {
            employee.employee_kpis_data.kpis_details.forEach(kpi => {
              kpiDetails.push([
                employee.employee_id,
                employee.employee_name,
                kpi.id,
                kpi.title,
                kpi.status_title,
                kpi.status_level,
                kpi.evaluator
              ])
            })
          } else {
            kpiDetails.push([employee.employee_id, employee.employee_name, "No KPIs", "", "", "", ""])
          }
        })
        const ws2 = XLSX.utils.aoa_to_sheet(kpiDetails)
        XLSX.utils.book_append_sheet(wb, ws2, "KPI Details")
      
        // Prepare KPI status count details sheet
        const statusCountDetails = [["Employee ID", "Employee Name", "Status", "Status Level", "Status Count"]]
        data.forEach(employee => {
          if (employee.employee_kpis_data?.status_count_details?.length > 0) {
            employee.employee_kpis_data.status_count_details.forEach(status => {
              statusCountDetails.push([
                employee.employee_id,
                employee.employee_name,
                status.status_title,
                status.status_level,
                status.status_count
              ])
            })
          } else {
            statusCountDetails.push([employee.employee_id, employee.employee_name, "No status data found", "", ""])
          }
        })
        const ws3 = XLSX.utils.aoa_to_sheet(statusCountDetails)
        XLSX.utils.book_append_sheet(wb, ws3, "Status Count")
      
        // Write to a file
        XLSX.writeFile(wb, "employee_kpis_data.xlsx")
      }
      

  return (
    <Button.Ripple outline className='round mr-1' size='sm' color='primary' onClick={exportToExcel}>
                            <BiExport size={14}/>
                            <span className='align-middle ms-10'>Export</span>
                        </Button.Ripple>
  )
}

export default ExportExcel
