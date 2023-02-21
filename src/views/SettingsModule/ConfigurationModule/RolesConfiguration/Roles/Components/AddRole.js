import { useState, useEffect } from 'react'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  FormFeedback
} from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../../../../Helpers/ApiHelper'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

const AddRole = ({ CallBack, DiscardModal }) => {
    const Api = apiHelper()
    const [roleTypeArr] = useState([])
    const getRoletypes = async () => {
        await Api.get(`/roles/types/`).then(data => {
            if (data.length > 0) {
                roleTypeArr.splice(0, roleTypeArr.length)
                for (let i = 0; i < data.length; i++) {
                    if (data[i].organization === Api.org.id) {
                        roleTypeArr.push({value: data[i].id, label: data[i].title})
                    }
                }
            } else {
                Api.Toast('error', 'No role types found, Please add role types first!')
            }
        })
        }
    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: { errors }
      } = useForm({ defaultValues: { title: '', roleType: '', code: '' } })
      
    const onSubmit = async (data) => {
        if (data.title.length && Object.values(data.roleType).length && data.code.length) {
            const formData = new FormData()
            formData['role_type'] = data.roleType.value
            formData['title'] = data.title
            formData['code'] = data.code
          await Api.jsonPost(`/roles/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    CallBack()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
          })
        } else {
            for (const key in data) {
                if (data[key].length === 0) {
                  setError(key, {
                    type: 'manual'
                  })
                }
              }
        }
      }
    
      const onReset = () => {
        DiscardModal()
        reset({ title: '' })
      }
      useEffect(() => {
        getRoletypes()
      }, [])
  return (
    <Row tag='form' onSubmit={handleSubmit(onSubmit)}>
            <Col xs={6}>
              <Label className='form-label' for='roleName'>
                Title
              </Label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='title' placeholder='Enter role name' invalid={errors.title && true} />
                )}
              />
              {errors.title && <FormFeedback>Please enter a valid role name</FormFeedback>}
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='roleType'>
              {errors.roleType && <p style={{color:'red', margin:'0'}}>Please select a role type</p>}
                Role Type
              </Label>
              <Controller
                name='roleType'
                control={control}
                render={({ field }) => (
                  <Select 
                  {...field} 
                  id='roleType' 
                  placeholder='Enter role type'
                  options={roleTypeArr}/>
                )}
              />
            </Col>
            <Col xs={6}>
              <Label className='form-label' for='code'>
                Code
              </Label>
              <Controller
                name='code'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='code' placeholder='Enter role code' invalid={errors.code && true} />
                )}
              />
              {errors.code && <FormFeedback>Please enter a valid role code</FormFeedback>}
            </Col>
            <Col className='text-center mt-2' xs={12}>
              <Button type='submit' color='primary' className='me-1'>
                Submit
              </Button>
              <Button type='reset' outline onClick={onReset}>
                Discard
              </Button>
            </Col>
          </Row>
  )
}

export default AddRole