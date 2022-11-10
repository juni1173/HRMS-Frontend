import { Fragment, useState } from "react" 
import { Label, Row, Col, Input, Form, Button, Spinner } from "reactstrap" 
import { Save } from "react-feather" 
const addPosition = () => {
    const dropdown = useState({
        value: 1, label: 'name'
    })
    const [loading] = useState(true)
    const onSubmit = () => {
        alert('test')
    }
    return (
        <Fragment>
        <div className='content-header' >
          <h5 className='mb-2'>Add Job</h5>
          {/* <small>Add Job.</small> */}
        </div>
        <Form onSubmit={e => e.preventDefault()}  id="create-job-form">
          <Row>
            <Col md='6' className='mb-1'>
              <Label className='form-label'>
                Departments
              </Label>
              {!loading ? (
                  <Select
                  theme={depActive}
                    isClearable={false}
                    id='dep-type'
                    name='dep-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={dropdown}
                    defaultValue={dropdown[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label'>
                Staff Classifications
              </Label>
              {!loading ? (
                  <Select
                  theme={staffActive}
                    isClearable={false}
                    id='staff-type'
                    name='staff-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={dropdown}
                    defaultValue={dropdown[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='6' className='mb-1'>
              <label className='form-label'>
                Position Title
              </label>
                <Input
                  id="position-title"
                  name="position-title"
                  className="position-title"
                  placeholder="Position Title"
                />
            </Col>
            <Col md='6' className='mb-1'>
            <label className='form-label'>
                Salary Range
              </label>
                <div className="d-flex">
                  <Col md='3' className="mb-1 mr-1">
                      <Input
                        id="salary-range-min"
                        type="number"
                        name="salary-range-min"
                        className="salary-range-min"
                        placeholder="Min Salary Range"
                      />
                  </Col>
                  <Col md='3' className="mb-1">
                      <Input
                        id="salary-range-max"
                        type="number"
                        name="salary-range-max"
                        className="salary-range-max"
                        placeholder="Max Salary Range"
                      />
                  </Col>
                </div>
              </Col>
              <Col md='6' className='mb-1'>
                <label className='form-label'>
                  No of Individual Required
                </label>
                  <Input
                    id="individual-required"
                    name="individual-required"
                    className="individual-required"
                    placeholder="No of Individual Required"
                  />
              </Col>
              <Col md='6' className='mb-1'>
                <label className='form-label'>
                  Job Description
                </label>
                  <Input
                    id="individujob-descriptional"
                    name="job-description"
                    className="job-description"
                    placeholder="Job Description "
                  />
              </Col>
              
              <div className='row float-right'>
                <div className='col-lg-12 '>
                  <Button color='primary' className='btn-next me-1' onClick={onSubmit}>
                    <span className='align-middle d-sm-inline-block d-none'>Save</span>
                    <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
                  </Button>
                </div>
              </div>
          </Row>
          
          
        </Form>
      </Fragment>
    )
}
export default addPosition