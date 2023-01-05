import { Fragment } from 'react'
import { Button, Form, Label, Card, CardBody, CardHeader, CardText, Input, CardTitle } from 'reactstrap'
const EvaluationForm = ({uuid}) => {
    console.warn(uuid)
    
  return (
    <Fragment>
        <Form>
            <div className='row'>
                <div className='col-lg-12 mb-1'>
                    <h2>Evaluation Form</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle tag='h4'>Intelligence</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <CardText className='mb-1'>
                            Quick and out of the box thinking ability.
                            </CardText>
                            <div className='demo-inline-spacing'>
                            <div className='form-check form-check-primary'>
                                <Input type='radio' id='radio-primary' name='question'/>
                                <Label className='form-check-label' for='radio-primary'>
                                Excellent
                                </Label>
                            </div>
                            <div className='form-check form-check-success'>
                                <Input type='radio' id='radio-success' name='question'/>
                                <Label className='form-check-label' for='radio-success'>
                                Good
                                </Label>
                            </div>
                            <div className='form-check form-check-warning'>
                                <Input type='radio' id='radio-warning' name='question'/>
                                <Label className='form-check-label' for='radio-warning'>
                                Average
                                </Label>
                            </div>
                            <div className='form-check form-check-danger'>
                                <Input type='radio' id='radio-danger' name='question'/>
                                <Label className='form-check-label' for='radio-danger'>
                                Bad
                                </Label>
                            </div>
                            
                            </div>
                        </CardBody>
                    </Card>
                </div>
                
                <div className='col-lg-12 mb-1'>
                    <Button className='btn btn-primary float-right'>
                        Submit
                    </Button>
                </div>
            </div> 
        </Form>
        
    </Fragment>
    
  )
}

export default EvaluationForm