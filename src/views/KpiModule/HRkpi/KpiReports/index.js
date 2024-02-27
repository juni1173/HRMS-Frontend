import { Fragment, useContext, useState } from 'react'
import Select from 'react-select'
// ** Custom Components
// import Breadcrumbs from '@components/breadcrumbs'
import { Search } from 'react-feather'
// ** Reactstrap Imports
import {
    Row, Col, 
    Card,
    CardBody,
    Spinner, Label, Badge, Button
  } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
// ** Deom Charts
// import BarChart from './ChartjsBarChart'
// import LineChart from './ChartjsLineChart'
// import AreaChart from './ChartjsAreaChart'
// import RadarChart from './ChartjsRadarChart'
// import BubbleChart from './ChartjsBubbleChart'
// import ScatterChart from './ChartjsScatterChart'
// import DoughnutChart from './ChartjsDoughnutChart'
import EvaluationChart from './evaluationChart'
// import HorizontalBarChart from './ChartjsHorizontalBar'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import EmployeeResultChart from './employeeResultChart'

const index = ({segmentation, dropdownData}) => {
    const [data, setData] = useState([])
    const [graphArr, setgraphArr] = useState([])
    const [empResultChartData, setempResultChartData] = useState([])
    const [empCompletedChartData, setempCompletedChartData] = useState([])
    const [empCarryChartData, setempCarryChartData] = useState([])
    const [loading, setLoading] = useState(false)
    const [departmentDropdown, setdepDropdown] = useState([])
    const [ep_batch, setEp_Batch] = useState('')
    const [dropdown_ep_batch] = useState([])
    const [ep_yearly_segmentation, setep_yearly_segmentation] = useState('')
    const Api = apiHelper()
  // ** Context, Hooks & Vars
  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    // tooltipShadow = 'rgba(0, 0, 0, 0.25)',
    gridLineColor = 'rgba(200, 200, 200, 0.2)',
    // lineChartPrimary = '#666ee8',
    // lineChartDanger = '#ff4961',
    warningColorShade = '#ffbd1f',
    // warningLightColor = '#FDAC34',
    successColorShade = '#28dac6',
    // primaryColorShade = '#836AF9',
    infoColorShade = '#299AFF',
    yellowColor = '#ffe800',
    greyColor = '#4F5D70'
    // blueColor = '#2c9aff',
    // blueLightColor = '#84D0FF',
    // greyLightColor = '#EDF1F4'
    const handleSegmentation = (id) => {
        dropdown_ep_batch.splice(0, dropdown_ep_batch.length)
        setep_yearly_segmentation(id)
        const seg = segmentation.find(pre => pre.id === id).ep_batches
        seg.forEach(element => {
            dropdown_ep_batch.push({ value: element.id, label: element.title})
        })
    
       }
    const getData = async () => {
        const formData = new FormData()
        if (ep_batch !== '' && ep_yearly_segmentation !== '') {
            formData['ep_batch'] = ep_batch
            formData['ep_yearly_segmentation'] = ep_yearly_segmentation
        }
        await Api.jsonPost(`/kpis/hr/dashboard/complexity/`, formData).then(result => {
            
            if (result) {
                setLoading(true)
                if (result.status === 200) {
                    const resultData = result.data
                    setData(resultData)
                    const departments = resultData.map(item => ({
                        label: item.title, 
                        value: item.title
                    }))
                    setdepDropdown(departments)
                    // const graphData = resultData.map(item => [item.total_result, item.carry_forward, item.completed_kpis])
                    // const finalgraphData = {
                    //     labels: ['Average Kpi Score', 'Carry Forward', 'Completed Kpis'],
                    //     datasets: [
                    //       {
                    //         borderWidth: 0,
                    //         label: 'Kpi Evaluation',
                    //         data: graphData[0],
                    //         backgroundColor: [primary, warningColorShade, successColorShade]
                    //       }
                    //     ]
                    //   }
                    
                    //   setgraphArr(finalgraphData)
                } else {
                    // Api.Toast('error', result.message)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        })  
      }
    //   useEffect(() => {
    //     getData()
    //     }, [setData])
    
        // const CallBack = useCallback(() => {
        //     getData()
        //   }, [requestData])
    const onChangeDepartmentHandler = (e) => {
        const filteredData = data.filter(item => item.title === e)
        
        const evaluationChartData = [filteredData[0].total_result, filteredData[0].carry_forward, filteredData[0].completed_kpis]
        const EvaluationChart = {
            labels: ['Average Kpi Score', 'Carry Forward', 'Completed Kpis'],
            datasets: [
              {
                borderWidth: 0,
                label: 'Kpi Evaluation',
                data: evaluationChartData,
                backgroundColor: [colors.primary.main, warningColorShade, successColorShade]
              }
            ]
          }
          setgraphArr(EvaluationChart)

        const empResultChartData = filteredData.map(item => ({
            labels: item.employees_data.map(emp => emp.name),
            values: item.employees_data.map(emp => emp.total_result)
        }))
        const EmpResultChart = {
            labels: empResultChartData[0].labels,
            datasets: [
              {
                maxBarThickness: 15,
                backgroundColor: successColorShade,
                borderColor: 'transparent',
                borderRadius: { topRight: 15, topLeft: 15 },
                data: empResultChartData[0].values
              }
            ]
          }
          setempResultChartData(EmpResultChart)

          const empCompletedGraph = filteredData.map(item => ({
            labels: item.employees_data.map(emp => emp.name),
            values: item.employees_data.map(emp => emp.Completed_kpis)
        }))
        const EmpCompletedGraph = {
            labels: empCompletedGraph[0].labels,
            datasets: [
              {
                maxBarThickness: 15,
                backgroundColor: successColorShade,
                borderColor: 'transparent',
                borderRadius: { topRight: 15, topLeft: 15 },
                data: empCompletedGraph[0].values
              }
            ]
          }
          setempCompletedChartData(EmpCompletedGraph)

          const empCarryGraph = filteredData.map(item => ({
            labels: item.employees_data.map(emp => emp.name),
            values: item.employees_data.map(emp => emp.Carry_Forward)
        }))
        console.warn(empCarryGraph)
        const EmpCarryGraph = {
            labels: empCarryGraph[0].labels,
            datasets: [
              {
                maxBarThickness: 15,
                backgroundColor: successColorShade,
                borderColor: 'transparent',
                borderRadius: { topRight: 15, topLeft: 15 },
                data: empCarryGraph[0].values
              }
            ]
          }
          setempCarryChartData(EmpCarryGraph)
    }
  return (
    <Fragment>
      {/* <Breadcrumbs breadCrumbTitle='React ChartJS 2' breadCrumbParent='Charts' breadCrumbActive='ChartJS' /> */}
      <Row className='match-height'>
        {/* <Col sm='12'>
          <p>
            React wrapper for Chart.js. Click{' '}
            <a href='https://github.com/jerairrest/react-chartjs-2' target='_blank' rel='noopener noreferrer'>
              here
            </a>{' '}
            for github repo.
          </p>
        </Col>
        <Col xl='6' sm='12'>
          <BarChart success={successColorShade} labelColor={labelColor} gridLineColor={gridLineColor} />
        </Col>
        <Col xl='6' sm='12'>
          <HorizontalBarChart
            info={colors.info.main}
            labelColor={labelColor}
            warning={colors.warning.main}
            gridLineColor={gridLineColor}
          />
        </Col>
        <Col sm='12'>
          <LineChart
            labelColor={labelColor}
            gridLineColor={gridLineColor}
            lineChartDanger={lineChartDanger}
            lineChartPrimary={lineChartPrimary}
            warningColorShade={warningColorShade}
          />
        </Col>
        <Col lg='6' sm='12'>
          <RadarChart labelColor={labelColor} gridLineColor={gridLineColor} />
        </Col> */}
        <Row>
                    <Col md="3" className="mb-1">
                       <Label className="form-label text-white">
                       Yearly Segmentation <Badge color='light-danger'>*</Badge>
                       </Label>
                       <Select
                           isClearable={false}
                           className='react-select'
                           classNamePrefix='select'
                           name="scale_group"
                           options={dropdownData.yearlySegmentation ? dropdownData.yearlySegmentation : ''}
                           onChange={ (e) => { handleSegmentation(e.value) }}
                           menuPlacement="auto" 
                            menuPosition='fixed'
                       />
                   </Col>
                     <Col md="4" className="mb-1">
                        <Label className="form-label text-white">
                        Batch <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="scale_group"
                            options={dropdown_ep_batch}
                            onChange={ (e) => { setEp_Batch(e.value) }}
                            menuPlacement="auto" 
                            menuPosition='fixed'
                        />
                    </Col>
                    <Col md={4}>
                        <Button color="warning" className="btn-next mt-2" onClick={getData}>
                            Get Reports
                        </Button>
                   </Col>
                   
        </Row>
        {!loading ? (
            <>
           { Object.values(departmentDropdown).length > 0 && (
            <Col md='12'>
            <Card>
                <CardBody>
                <Label className="form-label">
                Select Department <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="scale_group"
                    options={departmentDropdown ? departmentDropdown : ''}
                    onChange={ (e) => { onChangeDepartmentHandler(e.value) }}
                    menuPlacement="auto" 
                    menuPosition='fixed'
                />
                </CardBody>
            </Card>
            </Col>
            )}
           {Object.values(graphArr).length > 0 && (
                <Col lg='12' sm='12'>
                <EvaluationChart
                    greyColor={greyColor}
                    labelColor={labelColor}
                    yellowColor={yellowColor}
                    primary={colors.primary.main}
                    infoColorShade={infoColorShade}
                    warningColorShade={warningColorShade}
                    successColorShade={successColorShade}
                    graphData={graphArr}
                    />
                </Col>
            )}
            {Object.values(empResultChartData).length > 0 && (
                <Col lg='12' sm='12'>
                    <EmployeeResultChart  labelColor={labelColor} gridLineColor={gridLineColor} data={empResultChartData} title='Employees Kpi Score'/>
                </Col>
            )}
            {Object.values(empCompletedChartData).length > 0 && (
                <Col lg='12' sm='12'>
                    <EmployeeResultChart  labelColor={labelColor} gridLineColor={gridLineColor} data={empCompletedChartData} title='Employees Completed Kpis'/>
                </Col>
            )}
            {Object.values(empCarryChartData).length > 0 && (
                <Col lg='12' sm='12'>
                    <EmployeeResultChart  labelColor={labelColor} gridLineColor={gridLineColor} data={empCarryChartData} title='Employees Carry Forward Kpis'/>
                </Col>
            )}
            </>
        ) : <div className='text-center'><Spinner color='white'/></div>}
        
        
        {/* <Col sm='12'>
          <BubbleChart
            labelColor={labelColor}
            yellowColor={yellowColor}
            gridLineColor={gridLineColor}
            primaryColorShade={primaryColorShade}
          />
        </Col>
        <Col lg='4' sm='12'>
          <DoughnutChart
            tooltipShadow={tooltipShadow}
            successColorShade={successColorShade}
            warningLightColor={warningLightColor}
            primary={colors.primary.main}
          />
        </Col>
        <Col lg='8' sm='12'>
          <ScatterChart
            labelColor={labelColor}
            yellowColor={yellowColor}
            gridLineColor={gridLineColor}
            primary={colors.primary.main}
            successColorShade={successColorShade}
          />
        </Col>
        <Col sm='12'>
          <AreaChart
            blueColor={blueColor}
            labelColor={labelColor}
            gridLineColor={gridLineColor}
            blueLightColor={blueLightColor}
            greyLightColor={greyLightColor}
          />
        </Col> */}
      </Row>
    </Fragment>
  )
}

export default index