import React, { Fragment, useEffect, useState } from 'react'
import apiHelper from '../../../Helpers/ApiHelper'
import { Row } from 'reactstrap'
import Avatar from '@components/avatar'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'

const HistoryLog = ({ task_id }) => {
    const Api = apiHelper()
    const [data, setData] = useState([])

    const attributes = [
        'title', 'estimated_time', 'task_type_title', 'description',
        'priority', 'project', 'project_name', 'parent', 'planned_hours', 'actual_hours',
        'account_hour', 'external_ticket_reference', 'start_date', 'due_date',
        'assign_to_name', 'status_title', 'is_deactivated'
    ]
    const formatAttributeString = (attribute) => {
        return attribute
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the first letter of each word
    }
    const checkAttributesAndGenerateMessages = (data, attributes) => {
        const messages = []
    
        data.forEach(item => {
            attributes.forEach(attribute => {
                if (item.hasOwnProperty(attribute)) {
                    const message = (
                        <div key={`${item.id}-${attribute}`} style={{ marginBottom: '8px', fontSize: '12px' }}>
                            <Avatar size='sm' img={item.created_by_image ? item.created_by_image : defaultAvatar} style={{ marginRight: '3px' }} />
                            <strong style={{ fontSize: 'inherit' }}>{item.created_by_name}</strong> changed <strong style={{ fontSize: 'inherit' }}>{formatAttributeString(attribute)}</strong> to "<em style={{ fontSize: 'inherit' }}><b>{item[attribute]}</b></em>" at <time style={{ fontSize: 'inherit' }}>{Api.formatDateDifference(item.created_at)}</time>
                        </div>
                    )
                    messages.push(message)
                }
            })
        })
    
        return messages // Return just the array of messages
    }

    const GetHistoryLog = async () => {
        const url = `/taskify/get/task/logs/${task_id}/`
        await Api.get(url).then(result => {
            if (result && result.status === 200) {
                const resultData = checkAttributesAndGenerateMessages(result.data, attributes)
                setData(resultData) // Set data to the array of messages
            } else {
                Api.Toast('error', result.message || 'Server error!')
            }
        })
    }

    useEffect(() => {
        GetHistoryLog()
    }, [task_id])

    return (
        <Fragment>
            <Row>
                {data.map(message => message)}
            </Row>
        </Fragment>
    )
}

export default HistoryLog
