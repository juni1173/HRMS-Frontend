import React, { Fragment, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Mails from './Mails'
import classnames from 'classnames'
import { Spinner } from 'reactstrap'
import '@styles/react/apps/app-email.scss'
import apiHelper from '../../Helpers/ApiHelper'

const panel = () => {
    const Api = apiHelper()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [composeOpen, setComposeOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mails, setMails] = useState([])
    const toggleCompose = () => setComposeOpen(!composeOpen)
    const [params, setParams] = useState({
        action: 'inbox',
        type: 'seen',
        page_number: 1,
        page_size: 10
    })
    const fetchEmails = async (action = 'inbox', type = 'seen', page_number = params.page_number, page_size = params.page_size) => {
        // return false
        setLoading(true)
        const formData = new FormData()
                formData['action'] = action
                formData['status'] = type
                formData['page_size'] = page_size
                formData['page_number'] = page_number
            const response = await Api.jsonPost(`/integrations/mail/inbox/data/`, formData)
            if (response.status === 200) {
                const data = response.data 
                    setMails(data)
            } else {
                Api.Toast('error', response.message)
            }
            setLoading(false)
    } 
    const handleParams = (action = params.action, type = params.type, page_number = params.page_number, page_size = params.page_size) => {
        if (action) {
            setParams(prevState => ({
                ...prevState,
                action
                }))
        }
        if (type) {
            setParams(prevState => ({
                ...prevState,
                type
                }))
        }
        if (page_number) {
            setParams(prevState => ({
                ...prevState,
                page_number
                }))
        }
        if (page_size) {
            setParams(prevState => ({
                ...prevState,
                page_size
                }))
        }
        fetchEmails(action, type, page_number, page_size)
      }
    useEffect(() => {
        fetchEmails()
      }, [setMails, setParams])
  return (
    <Fragment>
        <Sidebar
        // store={store}
        // dispatch={dispatch}
        getMails={fetchEmails}
        sidebarOpen={sidebarOpen}
        handleParams={handleParams}
        toggleCompose={toggleCompose}
        setSidebarOpen={setSidebarOpen}
        // resetSelectedMail={resetSelectedMail}
      />
      <div className='content-right'>
        <div className='content-body'>
          <div
            className={classnames('body-content-overlay', {
              show: sidebarOpen
            })}
            onClick={() => setSidebarOpen(false)}
          ></div>
          {!loading ? (
            <Mails
            // store={store}
            // query={query}
            // setQuery={setQuery}
            // dispatch={dispatch}
            // getMails={getMails}
            // selectMail={selectMail}
            updateMails={fetchEmails}
            mails={mails}
            getMails={fetchEmails}
            composeOpen={composeOpen}
            handleParams={handleParams}
            params={params}
            setParams={setParams}
            toggleCompose={toggleCompose}
            setSidebarOpen={setSidebarOpen}
            // updateMailLabel={updateMailLabel}
            // selectCurrentMail={selectCurrentMail}
            // resetSelectedMail={resetSelectedMail}
          />
          ) : <div className='text-center'><Spinner/></div>}
          
        </div>
      </div>
    </Fragment>
  )
}

export default panel