import React, { useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody
} from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import Preview from './Preview'
import { Eye } from 'react-feather'
const ResumeForm = () => {
    const Api = apiHelper()
  const [canvasViewPlacement, setCanvasViewPlacement] = useState('end')
  const [canvasViewOpen, setCanvasViewOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [summary, setSummary] = useState('')
  const [accomplishments, setAccomplishments] = useState([{ company: '', accomplishment: '' }])
  const [experiences, setExperiences] = useState([{ company: '', title: '', startDate: '', endDate: '', points: [''] }])
  const [educations, setEducations] = useState([{ university: '', degree: '', startDate: '', endDate: '' }])
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [resume_data, setresume_data] = useState()
  const addAccomplishment = () => {
    setAccomplishments([...accomplishments, { company: '', accomplishment: '' }])
  }

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: '', title: '', startDate: '', endDate: '', points: [''] }
    ])
  }

  const addPoint = (experienceIndex) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[experienceIndex].points.push('')
    setExperiences(updatedExperiences)
  }

  const removePoint = (experienceIndex, pointIndex) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[experienceIndex].points.splice(pointIndex, 1)
    setExperiences(updatedExperiences)
  }

  const addEducation = () => {
    setEducations([...educations, { university: '', degree: '', startDate: '', endDate: '' }])
  }

const formatDataToJSON = () => {
    const data = {
      name,
      location,
      mobile,
      email,
      summary,
      accomplishments,
      experiences,
      educations
    }
    const jsonData = JSON.stringify(data, null, 2)
    // console.log(jsonData)
    const formdata = new FormData()
    formdata['resume_data'] = jsonData
    Api.jsonPost(`/employees/add/resume/`, formdata).then((response) => {
        if (response.status === 200) {
          Api.Toast('success', response.message)
        } else {
          Api.Toast('error', response.message)
        }
      })
  }
const handleSubmit = (e) => {
    e.preventDefault()
    // setIsSubmitted(true)
    formatDataToJSON()
  }
const fetchpredata = async() => {
   await Api.jsonPost(`/employees/view/resume/`).then((response) => {
    // debugger
        if (response.status === 200) {
            const resumeData = JSON.parse(response.data[0].resume_data)
            setName(resumeData.name)
            setLocation(resumeData.location)
            setMobile(resumeData.mobile)
            setEmail(resumeData.email)
            setSummary(resumeData.summary)
            setAccomplishments(resumeData.accomplishments)
            setExperiences(resumeData.experiences)
            setEducations(resumeData.educations)
        } else {
        //   Api.Toast('error', response.message)
        }
      })
}
useEffect(() => {
fetchpredata()
}, [])
const toggleViewCanvasEnd = () => {
    // if (!canvasViewOpen) {
    //   setSelectedData(item)
    // } 
      setCanvasViewPlacement('end')
      setCanvasViewOpen(!canvasViewOpen)
  }
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="mobile">Mobile</Label>
              <Input type="text" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup>
              <Label for="summary">Summary</Label>
              <Input type="textarea" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <h5>ACCOMPLISHMENTS</h5>
            {accomplishments.map((item, index) => (
              <FormGroup key={index}>
                <Label for={`company-${index}`}>Company Name</Label>
                <Input
                  type="text"
                  id={`company-${index}`}
                  value={item.company}
                  onChange={(e) => {
                    const updatedAccomplishments = [...accomplishments]
                    updatedAccomplishments[index].company = e.target.value
                    setAccomplishments(updatedAccomplishments)
                  }}
                />
                <Label for={`accomplishment-${index}`}>Accomplishment</Label>
                <Input
                  type="text"
                  id={`accomplishment-${index}`}
                  value={item.accomplishment}
                  onChange={(e) => {
                    const updatedAccomplishments = [...accomplishments]
                    updatedAccomplishments[index].accomplishment = e.target.value
                    setAccomplishments(updatedAccomplishments)
                  }}
                />
              </FormGroup>
            ))}
            <Button type="button" color="secondary" onClick={addAccomplishment}>
              Add Accomplishment
            </Button>
          </Col>
        </Row>

      
        <Row>
          <Col>
            <h5>PROFESSIONAL EXPERIENCE</h5>
            {experiences.map((experience, experienceIndex) => (
              <FormGroup key={experienceIndex}>
                <Label for={`company-${experienceIndex}`}>Company Name</Label>
                <Input
                  type="text"
                  id={`company-${experienceIndex}`}
                  value={experience.company}
                  onChange={(e) => {
                    const updatedExperiences = [...experiences]
                    updatedExperiences[experienceIndex].company = e.target.value
                    setExperiences(updatedExperiences)
                  }}
                />

                <Label for={`title-${experienceIndex}`}>Title</Label>
                <Input
                  type="text"
                  id={`title-${experienceIndex}`}
                  value={experience.title}
                  onChange={(e) => {
                    const updatedExperiences = [...experiences]
                    updatedExperiences[experienceIndex].title = e.target.value
                    setExperiences(updatedExperiences)
                  }}
                />

                <Label for={`startDate-${experienceIndex}`}>Start Date</Label>
                <Input
                  type="text"
                  id={`startDate-${experienceIndex}`}
                  value={experience.startDate}
                  onChange={(e) => {
                    const updatedExperiences = [...experiences]
                    updatedExperiences[experienceIndex].startDate = e.target.value
                    setExperiences(updatedExperiences)
                  }}
                />

                <Label for={`endDate-${experienceIndex}`}>End Date</Label>
                <Input
                  type="text"
                  id={`endDate-${experienceIndex}`}
                  value={experience.endDate}
                  onChange={(e) => {
                    const updatedExperiences = [...experiences]
                    updatedExperiences[experienceIndex].endDate = e.target.value
                    setExperiences(updatedExperiences)
                  }}
                />

                <Label>key Points</Label>
                {experience.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="d-flex">
                    <Input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const updatedExperiences = [...experiences]
                        updatedExperiences[experienceIndex].points[pointIndex] = e.target.value
                        setExperiences(updatedExperiences)
                      }}
                    />
                    <Button
                      type="button"
                      color="danger"
                      className="ml-2"
                      onClick={() => removePoint(experienceIndex, pointIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" color="secondary" onClick={() => addPoint(experienceIndex)}>
                  Add Point
                </Button>
              </FormGroup>
            ))}
            <Button type="button" color="secondary" onClick={addExperience}>
              Add Experience
            </Button>
          </Col>
     
        </Row>

        <Row>
          <Col>
            <h5>EDUCATION & COURSES</h5>
            {educations.map((education, index) => (
              <FormGroup key={index}>
                <Label for={`university-${index}`}>University Name</Label>
                <Input
                  type="text"
                  id={`university-${index}`}
                  value={education.university}
                  onChange={(e) => {
                    const updatedEducations = [...educations]
                    updatedEducations[index].university = e.target.value
                    setEducations(updatedEducations)
                  }}
                />

                <Label for={`degree-${index}`}>Degree</Label>
                <Input
                  type="text"
                  id={`degree-${index}`}
                  value={education.degree}
                  onChange={(e) => {
                    const updatedEducations = [...educations]
                    updatedEducations[index].degree = e.target.value
                    setEducations(updatedEducations)
                  }}
                />

                <Label for={`startDate-${index}`}>Start Date</Label>
                <Input
                  type="text"
                  id={`startDate-${index}`}
                  value={education.startDate}
                  onChange={(e) => {
                    const updatedEducations = [...educations]
                    updatedEducations[index].startDate = e.target.value
                    setEducations(updatedEducations)
                  }}
                />

                <Label for={`endDate-${index}`}>End Date</Label>
                <Input
                  type="text"
                  id={`endDate-${index}`}
                  value={education.endDate}
                  onChange={(e) => {
                    const updatedEducations = [...educations]
                    updatedEducations[index].endDate = e.target.value
                    setEducations(updatedEducations)
                  }}
                />
              </FormGroup>
            ))}
            <Button type="button" color="secondary" onClick={addEducation}>
              Add Education
            </Button>
          </Col>
        </Row>
<div className='mt-1 text-center'>
<Button onClick={() => toggleViewCanvasEnd()} color="success" className='mr-1'>
                                            Preview
                                        </Button>
        <Button type="submit" color="primary">
          Submit
        </Button>
        </div>
      </Form>
      <Offcanvas direction={canvasViewPlacement} isOpen={canvasViewOpen} toggle={toggleViewCanvasEnd} className="largeCanvas">
          <OffcanvasHeader toggle={toggleViewCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
          <Preview name={name} location={location} mobile={mobile} email={email} summary={summary} accomplishments={accomplishments} experiences={experiences} educations={educations}/>
          </OffcanvasBody>
        </Offcanvas>
      
    </Container>
  )
}

export default ResumeForm
