import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, Spinner } from 'reactstrap'
import LineGraph from './LineGraph'
import apiHelper from '../../../../Helpers/ApiHelper'
import Select from 'react-select'
const index = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [activeProject, setActiveProjects] = useState('')
    const [projDropdown, setProjectDropdown] = useState([])
    // const [expand, setExpand] = useState(false)
const preData = async (project) => {
    await Api.get(`/taskify/get/task/count/report/${project.value}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                setData(result.data)
                setActiveProjects(project)
            } else {
                // Api.Toast('error', result.message)
            }
        }
    })
 }
 const projectDropdown =  (projectsData) => {
    const arr = []
    if (projectsData) {
        for (const pro of projectsData) {
            arr.push({value: pro.id, label: pro.name})
        }
    }
    return arr
    }
const getProjects = async () => {
    setLoading(true)
    await Api.get(`/taskify/get/project/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const projectsData = result.data
                if (projectsData.length > 0) {
                    setProjectDropdown(projectDropdown(projectsData))
                    setActiveProjects({value: projectsData[0].id, label: projectsData[0].name})
                    preData({value: projectsData[0].id, label: projectsData[0].name})
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
    setTimeout(() => {
        setLoading(false)
    }, 500)
}
 
 useEffect(() => {
    getProjects()
 }, [])
  return (
    <div>
        <Card style={{ minHeight: '250px', position: 'relative', overflow: 'hidden' }}>
  <CardBody
    // style={{
    //   maxHeight: expand ? '100%' : '175px',  // Full height on expand
    //   overflow: expand ? 'auto' : 'hidden'
    // }}
  >
    {!loading ? (
      <>
        <div className="d-flex justify-content-between">
          <div>
            <Select
              isClearable={false}
              className="react-select w-100 float-right mb-1"
              classNamePrefix="select"
              name="project"
              options={projDropdown}
              placeholder="Select Project"
              components={{ IndicatorSeparator: () => null }}
              defaultValue={projDropdown.length > 0 ? projDropdown[0] : null}
              menuPlacement="auto"
              menuPosition="fixed"
              onChange={(e) => preData(e)}
            />
          </div>
          <div>
            <a href="/tasks" className="cursor-pointer">
              <h4>{activeProject !== '' ? activeProject.label : ''}</h4>
            </a>
          </div>
        </div>
        {data && Object.keys(data).length > 0 ? (
          <LineGraph data={data} />
        ) : (
          <h5 className="text-center mt-5">
            You have no assigned task under {activeProject.label}! <a href="/tasks">Go to Tasks Manager</a>
          </h5>
        )}
      </>
    ) : (
      <div className="text-center">
        <Spinner /> Getting Tasks Data!
      </div>
    )}
  </CardBody>
  {/* <CardFooter
  style={{
    position: expand ? 'static' : 'absolute',
    bottom: 0,
    padding: '1rem',
    border: 0,
    width: '100%',
    overflow: 'hidden', // Hide anything beyond the set height
    backgroundColor: 'white' // Card background color
  }}
>
  {/* Apply gradient overlay for fade-out effect */}
  {/* {!expand && (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',  // Full height of the footer
        pointerEvents: 'none' // Allows clicks to pass through the overlay
      }}
    />
  )}
  <p className="text-center cursor-pointer" onClick={() => setExpand(!expand)}>
    {expand ? 'Collapse' : 'Expand'}
  </p> */}
{/* </CardFooter> */} 


</Card>

      
    </div>
  )
}

export default index
