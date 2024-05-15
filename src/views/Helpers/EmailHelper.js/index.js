import apiHelper from "../ApiHelper"
const EmailHelper = () => {

    const Api = apiHelper()
   
  
    const fetchEmails = async (folder = 'inbox', type = 'all') => {
        let result = []
        const formData = new FormData()
                formData['action'] = folder
                formData['status'] = type
            console.warn(formData)
            const response = await Api.jsonPost(`/integrations/mail/inbox/data/`, formData)
            if (response.status === 200) {
                const data = response.data 
                if (Object.values(data).length > 0) {
                    result = data
                } else {
                    Api.Toast('error', response.message)
                }
            } else {
                Api.Toast('error', response.message)
            }
        
        return result
    } 
    const getMedium = async () => {
        let medium = null
        await Api.get(`/integrations/add/mail/credentials/`)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    const data = result.data[0]
                        medium = data.medium
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not Found!')
            }
        })
        return medium
    }

    return {
        fetchEmails,
        getMedium
    }

}
export default EmailHelper