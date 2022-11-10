import { Fragment, useState } from "react"
import { Row, Col, Form, Input, Button, Table, Spinner } from 'reactstrap'
import { Save } from "react-feather"
import InputMask from "react-input-mask"
const applyForm = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [name, setName] = useState(null)
    const [cnic, setCnic] = useState('')
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [linkedin, setLinkedin] = useState(null)
    const handleInput = ({ target: { value } }) => setCnic(value)
    const [data] = useState([])
    function CnicInput(props) {
        return (
            <InputMask
            mask='99-99-9999'
            placeholder='DD-MM-YYYY'
            value={props.value}
            onChange={props.onChange}>
          </InputMask>
      
        )
      }
    const submit = () => {
        setLoading(true)
        if (name !== null && cnic !== null && email !== null && phone !== null && linkedin !== null) {
            data.push({name, cnic, email, phone, linkedin})
        } else {
            setError("All the fields required")
        }

        setTimeout(() => {
            setLoading(false)
          }, 1000)
    }
    return (
        <Fragment>
            <div className="row apply-head-row">
                <div className="col-lg-12 text-center">
                    <h1 className="apply-heading">JOB APPLICATION FORM</h1>
                </div>
            </div>
            {error !== null ? <p>{error}</p> : null}
            {!data ? (
                !loading ? <p>Application Submitted Successfully</p> : <Spinner />
            ) : (
                <>
                <Form onSubmit={e => e.preventDefault()}  id="create-job-form">
                <Row className="apply-form">
                    <Col md='12' className='mb-1'>
                    <label className='form-label'>
                        Candidate Name
                    </label>
                        <Input
                        id="name"
                        name="name"
                        className="name"
                        placeholder="name"
                        onChange={e => setName(e.target.value)}
                        />
                        
                    </Col>
                    
                    <Col md='12' className='mb-1'>
                    <label className='form-label'>
                        CNIC No.
                    </label>
                    
                        {/* <Input
                        id="cnic"
                        name="cnic"
                        className="cnic"
                        placeholder={!loading ? cnic : null}
                        onChange={e => idChange(e.target.value)}
                        /> */}
                        <CnicInput 
                            value={cnic} 
                            onChange={handleInput}>
                        </CnicInput>
                    </Col>

                    <Col md='12' className='mb-1'>
                    <label className='form-label'>
                        Email Address
                    </label>
                        <Input
                        id="email"
                        name="email"
                        className="email"
                        placeholder="email"
                        onChange={e => setEmail(e.target.value)}
                        />
                    </Col>

                    <Col md='12' className='mb-1'>
                    <label className='form-label'>
                        Phone No.
                    </label>
                        <Input
                        id="phone"
                        name="phone"
                        className="phone"
                        placeholder="phone"
                        onChange={e => setPhone(e.target.value)}
                        />
                    </Col>

                    <Col md='12' className='mb-1'>
                    <label className='form-label'>
                        LinkedIn Profile
                    </label>
                        <Input
                        id="essential"
                        name="essential"
                        className="essential"
                        placeholder="Essential"
                        onChange={e => setLinkedin(e.target.value)}
                        />
                    </Col>
                </Row>
            </Form>
            <div className="text-center">
            <Button color='primary' className='btn-next' onClick={submit}>
                <span className='align-middle d-sm-inline-block d-none'>Submit</span>
                <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
            </Button>
            </div>
            
            </>
            )}
            
        </Fragment>
    )
}
export default applyForm