import apiHelper from "./ApiHelper"

const JiraHelper = () => {
    const Api = apiHelper()
    const getJiraTokens = async () => {
        await Api.get(`/jira/tokens/`).then(result => {
            if (result) {
                if (result.status === 200) {
                   return result.data
                } else {
                    Api.Toast('error', result.message)
                }
            }
        })
    }
    const postJiraTokens = async (data) => {
        console.warn(data)
        await Api.jsonPost(`/jira/tokens/`, data).then(result => {
            if (result) {
                if (result.status === 200) {
                    console.warn('tokens saved')
                } else {
                    Api.Toast('error', result.message)
                }
            }
        })
    }
      return {
        getJiraTokens,
        postJiraTokens
      }
}
export default JiraHelper

