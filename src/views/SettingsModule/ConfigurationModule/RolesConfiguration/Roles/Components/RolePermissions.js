import { useState, useEffect } from 'react'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
  Spinner
} from 'reactstrap'
// import Select from 'react-select'
import apiHelper from '../../../../../Helpers/ApiHelper'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

const RolePermissions = ({ role_id, CallBack, DiscardModal }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [rolesArr] = useState([])
    const [role_navigation] = useState([])
    const [watchValues, setWatchValues] = useState({})
    const getNav =  async () => {
        setLoading(true)
        const formData = new FormData()
        formData['role_id'] = role_id
         await Api.jsonPost(`/navigations/pre/data/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                  
                    const data = result.data.navigation
                    if (Object.values(data).length > 0) {
                        rolesArr.splice(0, rolesArr.length)
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].level === 0) {
                                rolesArr.push({title: data[i].title, id: data[i].id})
                            }
                        }
                    } else {
                        Api.Toast('error', 'No role types found')
                    }
                    const nav_data = result.data.role_navigation
                    if (Object.values(nav_data).length > 0) {
                        role_navigation.splice(0, role_navigation.length)
                        for (let i = 0; i < nav_data.length; i++) {
                            role_navigation.push(nav_data[i])
                            if (nav_data[i].can_view) {
                                setWatchValues(prevValues => ({
                                    ...prevValues,
                                    [nav_data[i].navigation_title]: true
                                })) 
                            }
                        }
                      
                    } else {
                        role_navigation.splice(0, role_navigation.length)
                    }
                   
                } else {
                    Api.Toast('error', result.message)
                }
                 
            } else {
                Api.Toast('error', 'Server not responding!')
            }
            
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        }
  
    const {
        reset,
        control,
        handleSubmit
      } = useForm()

    const onSubmit = (data) => {
        const formData_initial = new FormData()
        Object.keys(data).forEach(key => formData_initial.append(key, data[key]))
        const result = []
        rolesArr.forEach((navigation) => {
            let view = false
            let create = false
            let update = false
            let del = false
            if (watchValues[navigation.title] !== 'undefined') {
                 view = watchValues[navigation.title]
            } else {
                 view = false
            }
            if (formData_initial.get(`create-${navigation.title}`) !== 'undefined') {
                create = formData_initial.get(`create-${navigation.title}`)
           } else {
            create = false
           }
           if (formData_initial.get(`update-${navigation.title}`) !== 'undefined') {
            update = formData_initial.get(`update-${navigation.title}`)
            } else {
                update = false
            }
            if (formData_initial.get(`delete-${navigation.title}`) !== 'undefined') {
                del = formData_initial.get(`delete-${navigation.title}`)
            } else {
                del = false
            }
          
          result.push({
            role: role_id,
            navigation: navigation.id,
            can_view: view ? view : false,
            can_add: create ? /^true$/i.test(create) : false,
            can_update: update ? /^true$/i.test(update) : false,
            can_delete: del ? /^true$/i.test(del) : false
          })
        })
      
        console.warn(result)
        // const arr = []  
        // result.forEach((result_data) => {
        //     const key = Object.keys(result_data)
        //     const formData = new FormData()
        //      formData[key] = result_data[key]
        //      arr.push(formData)
        // })
        
        // console.warn(formData)
        
        Api.jsonPost(`/navigations/roles/data/`, result).then(response => {
            if (response) {
                if (response.status === 200) {
                    Api.Toast('success', response.message)
                } else {
                    Api.Toast('error', response.message)
                }
            } else {
                Api.Toast('error', 'Server not found!')
            }
        })
        if (!result) {
            CallBack()
        }
      }
      const onReset = () => {
        DiscardModal()
        reset({ title: '' })
      }
      useEffect(() => {
        getNav()
      }, [])
  return (
    <Row>
        <form onSubmit={handleSubmit(onSubmit)}>
    <Col xs={12}>
      <Table className='table-flush-spacing' responsive>
        <tbody>
          {!loading ? (
            Object.values(rolesArr).map((role, index) => {
                return (
                  <tr key={index}>
                    <td className='text-nowrap fw-bolder'>{role.title}</td>
                    <td>
                      <div className='d-flex'>
                        <div className='form-check me-3 me-lg-5'>
                        <Controller
                            name={`View-${role}`}
                            control={control}
                            render={({ field }) => (
                            <Input {...field} type='checkbox' id={`View-${role.title}`} 
                            defaultChecked={role_navigation.find(pre => pre.navigation === role.id) && role_navigation.find(pre => pre.navigation === role.id).can_view}
                            onChange={(e) => {
                                setWatchValues({
                                  ...watchValues,
                                  [role.title]: e.target.checked
                                })
                                console.warn(watchValues)
                              }}/>
                            )}
                        />
                          <Label className='form-check-label' for={`View-${role.title}`}>
                            View
                          </Label>
                        </div>
                        <div className='form-check me-3 me-lg-5'>
                        <Controller
                            name={`create-${role.title}`}
                            control={control}
                            render={({ field }) => (
                            <Input {...field} type='checkbox' id={`create-${role.title}`}
                            defaultChecked={role_navigation.find(pre => pre.navigation === role.id) && role_navigation.find(pre => pre.navigation === role.id).can_add}
                            disabled={!watchValues[role.title]}/>
                            
                            )}
                        />
                          <Label className='form-check-label' for={`create-${role.title}`}>
                            Create
                          </Label>
                        </div>
                        <div className='form-check me-3 me-lg-5'>
                        <Controller
                            name={`update-${role.title}`}
                            control={control}
                            render={({ field }) => (
                            <Input {...field} type='checkbox' id={`update-${role.title}`}
                            defaultChecked={role_navigation.find(pre => pre.navigation === role.id) && role_navigation.find(pre => pre.navigation === role.id).can_update}
                            disabled={!watchValues[role.title]}/>
                            )}
                        />
                          <Label className='form-check-label' for={`update-${role.title}`}>
                            Update
                          </Label>
                        </div>
                        <div className='form-check'>
                        <Controller
                            name={`delete-${role.title}`}
                            control={control}
                            render={({ field }) => (
                            <Input {...field} type='checkbox' id={`delete-${role.title}`}
                            defaultChecked={role_navigation.find(pre => pre.navigation === role.id) && role_navigation.find(pre => pre.navigation === role.id).can_delete}
                            disabled={!watchValues[role.title]}/>
                            )}
                        />
                          <Label className='form-check-label' for={`delete-${role.title}`}>
                            Delete
                          </Label>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })
          ) : (
            <tr className='text-center'>
                <td colSpan={5}> <Spinner/></td>
            </tr>
            
          )
          }
        </tbody>
      </Table>
    </Col>
    <Col className='text-center mt-2' xs={12}>
      <Button type='submit' color='primary' className='me-1'>
        Submit
      </Button>
      <Button type='reset' outline onClick={onReset}>
        Discard
      </Button>
    </Col>
    </form>
  </Row>
  )
}

export default RolePermissions