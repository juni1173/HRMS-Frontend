import React, { useEffect, useState, Fragment } from "react"
import apiHelper from "../../../../Helpers/ApiHelper"
import { Spinner, Row, Col } from "reactstrap"
import Select from "react-select"
import ProjectBasedKpiChart from "./ProjectBasedKpiChart"
const ProjectBasedKpiData = ({ id }) => {
  const [loading, setLoading] = useState(false)
  const Api = apiHelper()
  const [projectList] = useState([])
  const [data, setData] = useState([])
  const [inputData, setInputData] = useState({
    project: "",
    ep_batch: ""
  })
  const getProjectbasedKpiData = async () => {
    const formData = new FormData()
       if (id) formData["employee"] = id
        if (inputData.project !== '') formData["project"] = inputData.project
        setLoading(true)
      await Api.jsonPost(`/kpis/project/based/result/`, formData).then(
        (result) => {
          if (result) {
            if (result.status === 200) {
              const resultData = result.data
              setData(resultData)
            } else {
            //   Api.Toast("error", result.message)
            }
          }
        }
      )
      setTimeout(() => {
        setLoading(false)
      }, 500)
  }
  const getData = async () => {
    if (id) {
      if (projectList.length > 0) {
        projectList.splice(0, projectList.length)
      }
      const formData = new FormData()
        formData["employee"] = id
      await Api.jsonPost(`/projects/employee/projects/`, formData).then(
        (roleResult) => {
          if (roleResult) {
            if (roleResult.status === 200) {
              const projectData = roleResult.data
              for (let i = 0; i < projectData.length; i++) {
                projectList.push({
                  value: projectData[i].project,
                  label: projectData[i].project_title
                })
              }
            }
          }
        }
      )
      let project_id = ''
      if (projectList.length > 0) {
        project_id = projectList[0].value
        setInputData((prev) => ({
            ...prev,
            project: project_id
          }))
      }
    //   getProjectbasedKpiData()
    }
    
  }
  useEffect(() => {
    getData()
  }, [projectList])
  useEffect(() => {
    getProjectbasedKpiData()
  }, [inputData])
  const onProjectChange = (e) => {
    if (e.value && e.value !== "") {
      setInputData((prev) => ({
        ...prev,
        project: e.value
      }))
    }
  }
  return (
    <Fragment>
        <Row>
            <Col md="12" className=''>
            {
                projectList.length > 0 && (
                    <div className="w-25 float-right mb-1">
                            <Select
                            type="text"
                            placeholder="Select Project"
                            name="project"
                            options={projectList}
                            defaultValue={(inputData.project !== '') ? projectList.find(pre => pre.value === inputData.project) : projectList[0]}
                            onChange={(e) => {
                                onProjectChange(e)
                            }}
                            menuPlacement="auto"
                            />
                        </div>
                )}
            </Col>
            <Col md="12">
                {!loading ? (
                    data && data.length > 0 ? (
                        
                            <div className="w-100">
                            <ProjectBasedKpiChart data={data} success='#28dac6'/>
                            </div>
                        
                    ) : (
                        <div>No data found!</div>
                    )
                ) : (
                    <div className="text-center"><Spinner /> loading data...</div>
                )}
            </Col>
        </Row>
      
            
    </Fragment>
  )
}

export default ProjectBasedKpiData
