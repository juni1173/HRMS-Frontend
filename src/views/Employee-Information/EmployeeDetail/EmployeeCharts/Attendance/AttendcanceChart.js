import { useContext } from 'react'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardTitle, Table, CardBody, Row, Col } from 'reactstrap'
import { FcLeave } from "react-icons/fc"
import { MdCoPresent, MdHomeWork, MdReportOff, MdWorkOff, MdWork } from "react-icons/md"
import { ThemeColors } from '@src/utility/context/ThemeColors'

const AttendcanceChart = ({ data }) => {
  const { colors } = useContext(ThemeColors)
    function convertDaysToYearsMonths(days) {
        // Constants for average days in a year and days in months
        const daysInYear = 365.25 // Average days in a year, accounting for leap years
        const daysInMonth = 30.4375 // Average days in a month
        
        // Calculate years
        const years = Math.floor(days / daysInYear)
        
        // Calculate the remaining days after accounting for years
        const remainingDaysAfterYears = days % daysInYear
        
        // Calculate months
        const months = Math.floor(remainingDaysAfterYears / daysInMonth)
        
        // Calculate remaining days after accounting for months
        const remainingDays = Math.round(remainingDaysAfterYears % daysInMonth)
        
        // Construct the result string
        let result = ``
        
        if (years > 0) {
            result += `${years} ${years === 1 ? 'year' : 'years'}`
        }
        
        if (months > 0) {
            result += `${years > 0 ? ' ' : ''}${months} ${months === 1 ? 'month' : 'months'}`
        }
        
        if (remainingDays > 0) {
            result += `${years > 0 || months > 0 ? ' ' : ''}${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
        }
        
        return result
    }
    // const options = {
    //     chart: {
    //       toolbar: {
    //         show: false
    //       }
    //     },
    //     dataLabels: {
    //       enabled: false
    //     },
    //     legend: { show: false },
    //     // comparedResult: [2, -3, 8],
    //     labels: ['Weekday', 'Weekend'],
    //     stroke: { width: 0 },
    //     colors: ['#1A5319', '#508D4E'],
    //     grid: {
    //       padding: {
    //         right: -20,
    //         bottom: -8,
    //         left: -20
    //       }
    //     },
    //     plotOptions: {
    //       pie: {
    //         startAngle: -10,
    //         donut: {
    //           labels: {
    //             show: true,
    //             name: {
    //               offsetY: 15
    //             },
    //             value: {
    //               offsetY: -15,
    //               formatter(val) {
    //                 return `${parseInt(val)}`
    //               }
    //             },
    //             total: {
    //               show: true,
    //               offsetY: 15,
    //               label: 'Weekday',
    //               formatter() {
    //                 return data[0].total_weekday_holidays
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     responsive: [
    //       {
    //         breakpoint: 1325,
    //         options: {
    //           chart: {
    //             height: 100
    //           }
    //         }
    //       },
    //       {
    //         breakpoint: 1200,
    //         options: {
    //           chart: {
    //             height: 120
    //           }
    //         }
    //       },
    //       {
    //         breakpoint: 1065,
    //         options: {
    //           chart: {
    //             height: 100
    //           }
    //         }
    //       },
    //       {
    //         breakpoint: 992,
    //         options: {
    //           chart: {
    //             height: 120
    //           }
    //         }
    //       }
    //     ]
    //   }
      const options2 = {
        chart: {
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: { show: false },
        // comparedResult: [2, -3, 8],
        labels: ['Presents', 'WFH', 'Leaves', 'Weekday Holidays', 'Weekend Holidays'],
        stroke: { width: 0 },
        colors: [colors.primary.main, colors.warning.main, colors.danger.main, '#1A5319', '#508D4E'],
        grid: {
          padding: {
            right: -20,
            bottom: -8,
            left: -20
          }
        },
        plotOptions: {
          pie: {
            startAngle: -10,
            donut: {
              labels: {
                show: true,
                name: {
                  offsetY: 15
                },
                value: {
                  offsetY: -15,
                  formatter(val) {
                    return `${parseInt(val)}`
                  }
                },
                total: {
                  show: true,
                  offsetY: 15,
                  label: 'Presents',
                  formatter() {
                    return data[0].total_presents
                  }
                }
              }
            }
          }
        },
        responsive: [
          {
            breakpoint: 1325,
            options: {
              chart: {
                height: 100
              }
            }
          },
          {
            breakpoint: 1200,
            options: {
              chart: {
                height: 120
              }
            }
          },
          {
            breakpoint: 1065,
            options: {
              chart: {
                height: 100
              }
            }
          },
          {
            breakpoint: 992,
            options: {
              chart: {
                height: 120
              }
            }
          }
        ]
      }
    
      return (
        <>
            <Card className='holiday-chart align-item-center'>
            <CardBody className='d-flex justify-content-center p-0'>
                <div>
                    <Table striped responsive >
                        <thead>
                            <tr>
                                <th className='cursor-pointer' ><MdWork size={17} className='text-primary' /> <span style={{fontSize:'x-large'}}>{data[0].total_working_days && data[0].total_working_days}<span className='font-small-1 text-secondary'> Working Days</span></span><br></br><span className='font-small-1 text-secondary'>{data[0].total_working_days && convertDaysToYearsMonths(data[0].total_working_days)}</span></th>
                                <th><span style={{fontSize:'x-large'}}>{(((data[0].total_presents + data[0].total_wfh + data[0].total_leaves + data[0].total_weekday_holidays) / data[0].total_working_days) * 100).toFixed('2')}%</span><br></br><span className='font-small-1 text-secondary'> Including Leaves</span></th>
                            </tr>
                            <tr>
                                <th className='cursor-pointer' ><MdCoPresent size={17} className='text-success' /> <span>{data[0].total_presents && data[0].total_presents}<span className='font-small-1 text-secondary'> Presents</span></span><br></br><span className='font-small-1 text-secondary'>{data[0].total_presents && convertDaysToYearsMonths(data[0].total_presents)}</span></th>
                                <th className='cursor-pointer'><MdHomeWork size={17} className='text-warning' /> {data[0].total_wfh && data[0].total_wfh} <span className='font-small-1 text-secondary'> WFH</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_wfh && data[0].total_wfh !== 0) && convertDaysToYearsMonths(data[0].total_wfh)}</span></th>
                            </tr>
                            <tr>
                                <th className='cursor-pointer'><FcLeave size={17} className='text-success' /> {data[0].total_leaves && data[0].total_leaves} <span className='font-small-1 text-secondary'> Leaves</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_leaves && data[0].total_leaves !== 0) && convertDaysToYearsMonths(data[0].total_leaves)}</span></th>
                                <th className='cursor-pointer'><MdReportOff size={17} color={colors.danger.main} /> {data[0].total_absent && data[0].total_absent} <span className='font-small-1 text-secondary'> Absents</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_absent && data[0].total_absent !== 0) && convertDaysToYearsMonths(data[0].total_absent)}</span></th>
                            </tr>
                            <tr>
                                <th className='cursor-pointer'><MdWorkOff size={17} color='#1A5319' /> {data[0].total_weekday_holidays && data[0].total_weekday_holidays} <span className='font-small-1 text-secondary'> Weekday Holidays</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_weekday_holidays && data[0].total_weekday_holidays !== 0) && convertDaysToYearsMonths(data[0].total_weekday_holidays)}</span></th>
                                <th className='cursor-pointer'><MdWorkOff size={17} color='#508D4E' /> {data[0].total_weekend_holidays && data[0].total_weekend_holidays} <span className='font-small-1 text-secondary'> Weekdend Holidays</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_weekend_holidays && data[0].total_weekend_holidays !== 0) && convertDaysToYearsMonths(data[0].total_weekend_holidays)}</span></th>
                            </tr>
                           
                        </thead>
                    </Table>
                </div>
                <div>
                <Chart options={options2} series={[data[0].total_presents, data[0].total_wfh, data[0].total_leaves, data[0].total_weekday_holidays, data[0].total_weekend_holidays]} type='donut' height={250} />
                {/* <Chart options={options} series={[data[0].total_weekday_holidays, data[0].total_weekend_holidays]} type='donut' height={170} /> */}
                </div>
            </CardBody>
            </Card>
            
        </>
      )
}

export default AttendcanceChart