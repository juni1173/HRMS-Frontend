import { Version3Client } from 'jira.js'
const JiraHelper = () => {
    // const Api = apiHelper()
    const auth = new Version3Client({
        host: 'https://api.atlassian.com/ex/jira/ebd17c20-72d8-441c-81eb-b6185d42c9d8',
        authentication: {
          oauth2: {
            accessToken: 'eyJraWQiOiJmZTM2ZThkMzZjMTA2N2RjYTgyNTg5MmEiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmODRmNDA0NS1hMDg5LTQyYzEtODNlYi00YjczYzAyZWVlMDYiLCJzdWIiOiI2MmJjYzBhN2VjNGMwZDM3N2ZhMDQ2MDkiLCJuYmYiOjE2ODI1Nzc2NzAsImlzcyI6Imh0dHBzOi8vYXRsYXNzaWFuLWFjY291bnQtcHJvZC5wdXMyLmF1dGgwLmNvbS8iLCJpYXQiOjE2ODI1Nzc2NzAsImV4cCI6MTY4MjU4MTI3MCwiYXVkIjoicTZtMWFRMkhaWXVJV1NpRER5UG5CNnRiVm5EVnd3Q20iLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudEVtYWlsIjoiOTVkZWQxMGQtMmFjMi00M2JkLWEyMGYtMzgwY2RlZGNlNDg4QGNvbm5lY3QuYXRsYXNzaWFuLmNvbSIsImh0dHBzOi8vaWQuYXRsYXNzaWFuLmNvbS9zZXNzaW9uX2lkIjoiZDI5ZjA2YTYtNGExMi00YmU3LWI0ZGQtNDI2Y2ZjNjc3NjZhIiwic2NvcGUiOiJtYW5hZ2U6amlyYS1jb25maWd1cmF0aW9uIG1hbmFnZTpqaXJhLWRhdGEtcHJvdmlkZXIgbWFuYWdlOmppcmEtcHJvamVjdCBtYW5hZ2U6amlyYS13ZWJob29rIG9mZmxpbmVfYWNjZXNzIHJlYWQ6amlyYS11c2VyIHJlYWQ6amlyYS13b3JrIHdyaXRlOmppcmEtd29yayIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS9zeXN0ZW1BY2NvdW50SWQiOiI3MTIwMjA6ZWY4ZWY3NTUtMTZmYi00NGUzLTgxMzEtMTYwMjAzMWE3MjM4IiwiaHR0cHM6Ly9pZC5hdGxhc3NpYW4uY29tL3JlZnJlc2hfY2hhaW5faWQiOiJxNm0xYVEySFpZdUlXU2lERHlQbkI2dGJWbkRWd3dDbS02MmJjYzBhN2VjNGMwZDM3N2ZhMDQ2MDktYjgyNjFlZDgtOGNhNi00MTU0LWE0NjEtMmVkODFjOTE0MTFlIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2VtYWlsRG9tYWluIjoia2F2dGVjaC5uZXQiLCJodHRwczovL2lkLmF0bGFzc2lhbi5jb20vYXRsX3Rva2VuX3R5cGUiOiJBQ0NFU1MiLCJodHRwczovL2F0bGFzc2lhbi5jb20vZmlyc3RQYXJ0eSI6ZmFsc2UsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS92ZXJpZmllZCI6dHJ1ZSwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL29hdXRoQ2xpZW50SWQiOiJxNm0xYVEySFpZdUlXU2lERHlQbkI2dGJWbkRWd3dDbSIsInZlcmlmaWVkIjoidHJ1ZSIsImh0dHBzOi8vaWQuYXRsYXNzaWFuLmNvbS9wcm9jZXNzUmVnaW9uIjoidXMtZWFzdC0xIiwiaHR0cHM6Ly9pZC5hdGxhc3NpYW4uY29tL3VqdCI6ImI5MjQ0YTI4LTA4OGYtNGQ5My04YjhjLTUxOGJmMGY4ZTk5ZSIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS8zbG8iOnRydWUsImNsaWVudF9pZCI6InE2bTFhUTJIWll1SVdTaUREeVBuQjZ0YlZuRFZ3d0NtIiwiaHR0cHM6Ly9pZC5hdGxhc3NpYW4uY29tL3ZlcmlmaWVkIjp0cnVlLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudEVtYWlsRG9tYWluIjoiY29ubmVjdC5hdGxhc3NpYW4uY29tIn0.VZQXIdvsudJ82z_0PvQW1ibeWFh5fvqfIJ2WEplX7_8ExXEBPTb8zNYtcM0Dh-BV7h_iYvZiH0K2wnakyOhSdg-FheVwLdfGYeQKl30gcriHxB34VFH3OWqe6C_-SexRXDZgItcA1kjMoScjXZTeGNddHo4ofM3mj-Xfs6MKkXks6SOgQissAbtcbbADVnwLWBdVEj7tPKOcqa0MR0Gc5iwEXxhkfIYSM2BnmSuBtniDjzuNVPagRypnm3sQZ2VJAmfFjeXtr8UEA5k7VLp4ad8PTAELo5vkKf8d2i6gNKfWffOOETPrMqEAMgMJQ_enUueO182_4T5ldy6dgc6LYg'
          }
        }
      })
   
    
      const getProjects = async () => {
       const response = await auth.projects.getAllProjects()
        return response
      }
      return {
        getProjects,
        auth
      }
}
export default JiraHelper