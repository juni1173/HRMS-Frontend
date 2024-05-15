// ** React Imports
import { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Editor } from 'react-draft-wysiwyg'
import Select, { components } from 'react-select'
import { Minus, X, Maximize2, Paperclip, MoreVertical, Trash } from 'react-feather'
import EmployeeHelper from '../../Helpers/EmployeeHelper'
// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Modal,
  Button,
  ModalBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledButtonDropdown
} from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import apiHelper from '../../Helpers/ApiHelper'
const ComposePopup = props => {
  // ** Props & Custom Hooks
  const Api = apiHelper()
  const { composeOpen, toggleCompose } = props
    const Helper = EmployeeHelper()
  // ** States
    const [ccOpen, setCCOpen] = useState(false)
    const [employeeList, setEmployeeList] = useState([])
//  To States
    const [toOtherEmails, setToOtherEmails] = useState([])
    const [emailInput, setEmailInput] = useState('')
    const [toFormData, setToFormData] = useState([])
//   CC states
    const [ccOtherEmails, setccOtherEmails] = useState([])
    const [ccemailInput, setccEmailInput] = useState('')
    const [ccFormData, setccFormData] = useState([])
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const [subject, setSubject] = useState('')
  const [editorState, setEditorState] = useState('')

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState)
  }

//   To handle Functions
  const handleToOtherChange = (e) => {
    setEmailInput(e.target.value)
  }

  const handleToOtherKeyPress = (e) => {
    if (e.key === 'Enter' || (e.key === '.' && emailInput.endsWith('.com'))) {
        const email = emailInput.trim()
        if (email !== '' && emailRegex.test(email)) {
          setToOtherEmails([...toOtherEmails, email])
          setEmailInput('')
        } else {
            Api.Toast('error', 'Email should be valid')
        }
    }
  }

  const handleRemoveEmail = (email) => {
    const updatedEmails = toOtherEmails.filter((e) => e !== email)
    setToOtherEmails(updatedEmails)
  }
  const SelectComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          <Avatar className='my-0 me-50' size='sm' img={data.img} />
          {data.label}
        </div>
      </components.Option>
    )
  }
  const handleEmployeeSelection = (selectedOptions) => {
    const emails = selectedOptions.map(option => option.email)
    setToFormData(emails)
  }
    // CC Handle Functions
    const handleccOtherChange = (e) => {
        setccEmailInput(e.target.value)
      }
    
      const handleccOtherKeyPress = (e) => {
        if (e.key === 'Enter' || (e.key === '.' && ccemailInput.endsWith('.com'))) {
            const email = ccemailInput.trim()
            if (email !== '' && emailRegex.test(email)) {
              setccOtherEmails([...ccOtherEmails, email])
              setccEmailInput('')
            } else {
                Api.Toast('error', 'Email should be valid')
            }
        }
      }
    
      const handleccRemoveEmail = (email) => {
        const updatedEmails = ccOtherEmails.filter((e) => e !== email)
        setccOtherEmails(updatedEmails)
      }
      const handleccEmployeeSelection = (selectedOptions) => {
        const emails = selectedOptions.map(option => option.email)
        setccFormData(emails)
      }
  // ** CC Toggle Function
  const toggleCC = e => {
    e.preventDefault()
    if (!ccOpen) {
        setccFormData([])
        setccOtherEmails([])
    }
    setCCOpen(!ccOpen)
  }

  // ** Toggles Compose POPUP
  const togglePopUp = e => {
    e.preventDefault()
    toggleCompose()
  }
  
  const handleSubmit = async () => {
    let to = [...toFormData, ...toOtherEmails]
        to = to.join(', ')
    let cc = [...ccFormData, ...ccOtherEmails]
    cc = cc.join(', ')
    if (to.length > 0 && subject !== '' && editorState !== '') {
        const formData = new FormData()
    formData['to_email'] = to
    if (cc.length > 0) formData['cc'] = cc
    formData['subject'] = subject
    formData['body'] = editorState.getCurrentContent().getPlainText('\u0001')
    await Api.jsonPost(`/integrations/send/mail/`, formData).then(result => {
        if (result) {
            if (result.status === 200) {
                Api.Toast('success', result.message)
                toggleCompose()
            } else {
                Api.Toast('error', result.message)
            }
        }
    })
    } else {
        Api.Toast('error', 'Please fill all required fields')
    }
    
  }
  useEffect(() => (
    Helper.fetchEmployeeDropdownImage().then(result => {
        setEmployeeList(result)
    })
  ), [setEmployeeList])
  return (
    <Modal
      scrollable
      fade={false}
      keyboard={false}
      backdrop={false}
      id='compose-mail'
      container='.content-body'
      className='modal-lg'
      isOpen={composeOpen}
      contentClassName='p-0'
      toggle={toggleCompose}
      modalClassName='modal-compose'
    >
      <div className='modal-header'>
        <h5 className='modal-title'>Compose Mail</h5>
        <div className='modal-actions'>
          <a href='/' className='text-body' onClick={togglePopUp}>
            <X size={14} />
          </a>
        </div>
      </div>
      <ModalBody className='flex-grow-1 p-0'>
        <Form className='compose-form' onSubmit={e => e.preventDefault()}>
          <div className='compose-mail-form-field'>
            <Label for='email-to' className='form-label'>
               Employees:
            </Label>
            <div className='flex-grow-1'>
              <Select
                isMulti
                id='email-to'
                isClearable={false}
                theme={selectThemeColors}
                options={employeeList}
                className='react-select select-borderless'
                classNamePrefix='select'
                components={{ Option: SelectComponent }}
                onChange={handleEmployeeSelection}
              />
            </div>
            <div>
              <a href='/' className='toggle-cc text-body me-1' onClick={toggleCC}>
                Cc
              </a>
            </div>
          </div>
            <div className='compose-mail-form-field'>
                <Label for='email-to-other' className='form-label'>
                 Other:
                </Label>
                {toOtherEmails.map((email, index) => (
                    <span key={index} className='tag' style={{margin:'0.2rem', width: 'fit-content', padding: '0 0.6rem', borderRadius: '0.357rem', backgroundColor: '#7367f0'}}>
                    <span style={{color:'#fff', paddingRight:'2px', fontSize:'12px'}}>{email}</span> 
                    <span className='remove-tag text-white cursor-pointer' style={{fontSize:'20px', paddingLeft:'2px'}} onClick={() => handleRemoveEmail(email)}>
                        &times;
                    </span>
                    </span>
                ))}
                <Input
                    id='email-to-other'
                    type='text'
                    placeholder='Enter Email'
                    value={emailInput}
                    onChange={handleToOtherChange}
                    onKeyDown={handleToOtherKeyPress}
                />
                <div>
                
                </div>
            </div>
          {ccOpen === true ? (
            <>
                <div className='compose-mail-form-field cc-wrapper'>
                <Label for='email-cc' className='form-label'>
                    Cc:
                </Label>
                <div className='flex-grow-1'>
                    <Select
                    isMulti
                    id='email-cc'
                    isClearable={false}
                    theme={selectThemeColors}
                    options={employeeList}
                    className='react-select select-borderless'
                    classNamePrefix='select'
                    components={{ Option: SelectComponent }}
                    onChange={handleccEmployeeSelection}
                    />
                </div>
                <div>
                    <a href='/' className='toggle-cc text-body' onClick={toggleCC}>
                    <X size={14} />
                    </a>
                </div>
                </div>
                <div className='compose-mail-form-field'>
                <Label for='email-to-other' className='form-label'>
                Other:
                </Label>
                {ccOtherEmails.map((email, index) => (
                    <span key={index} className='tag' style={{margin:'0.2rem', width: 'fit-content', padding: '0 0.6rem', borderRadius: '0.357rem', backgroundColor: '#7367f0'}}>
                    <span style={{color:'#fff', paddingRight:'2px', fontSize:'12px'}}>{email}</span> 
                    <span className='remove-tag text-white cursor-pointer' style={{fontSize:'20px', paddingLeft:'2px'}} onClick={() => handleccRemoveEmail(email)}>
                        &times;
                    </span>
                    </span>
                ))}
                <Input
                    id='email-to-other'
                    type='text'
                    placeholder='Enter Email'
                    value={ccemailInput}
                    onChange={handleccOtherChange}
                    onKeyDown={handleccOtherKeyPress}
                />
                <div>
                
                </div>
                </div>
            </>
          ) : null}
       
          <div className='compose-mail-form-field'>
            <Label for='email-subject' className='form-label'>
              Subject:
            </Label>
            <Input id='email-subject' placeholder='Subject' onChange={e => setSubject(e.target.value)}/>
          </div>
          <div id='message-editor'>
            <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
              placeholder='Message'
              toolbarClassName='rounded-0'
              wrapperClassName='toolbar-bottom'
              editorClassName='rounded-0 border-0'
              toolbar={{
                options: ['inline', 'textAlign'],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic', 'underline', 'strikethrough']
                }
              }}
            />
          </div>
          <div className='compose-footer-wrapper'>
            <div className='btn-wrapper d-flex align-items-center'>
                <Button color='primary' onClick={handleSubmit}>
                  Send
                </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default ComposePopup
