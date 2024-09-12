import React, {Fragment, useEffect} from 'react'
import { CardBody, Card } from 'reactstrap'
import '../../../../assets/scss/style.scss'
import KJUR from 'jsrsasign'
import apiHelper from '../../../Helpers/ApiHelper'
const JoinMeeting = ({ payload }) => {
    const Api = apiHelper()
    function generateSignature(key, secret, meetingNumber, role) {

        const iat = Math.round(new Date().getTime() / 1000) - 30
        const exp = iat + (60 * 60 * 2)
        const oHeader = { alg: 'HS256', typ: 'JWT' }
      
        const oPayload = {
          sdkKey: key,
          appKey: key,
          mn: meetingNumber,
          role,
          iat,
          exp,
          tokenExp: exp
        }
      
        const sHeader = JSON.stringify(oHeader)
        const sPayload = JSON.stringify(oPayload)
        const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret)
        return sdkJWT
      }
      const returnZak = async () => {
        await Api.get(`/meetings/zak/token/`).then(result => {
            if (result) {
                if (result.status === 200) {
                   return result.data.token
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
            Api.Toast('error', 'Server not responding!')   
            }
        }) 
      }
      
      
    useEffect(async () => {
        // console.warn(generateSignature(payload.sdkKey, payload.sdkSecret, payload.meetingNumber, payload.role))
        const {ZoomMtg} = await import("@zoomus/websdk")
        const signature = generateSignature(payload.sdkKey, payload.sdkSecret, payload.meetingNumber, payload.role)
        console.warn(signature)
        ZoomMtg.setZoomJSLib('https://source.zoom.us/2.12.0/lib', '/av')
        ZoomMtg.preLoadWasm()
        ZoomMtg.prepareWebSDK()
        ZoomMtg.i18n.load('en-US')
        ZoomMtg.i18n.reload('en-US')
        // ZoomMtg.prepareJssdk()
        ZoomMtg.init({
            leaveUrl: payload.leaveUrl,
            success() {
                if (payload.role === 1) {
                    ZoomMtg.join({
                        meetingNumber: payload.meetingNumber,
                        signature,
                        sdkKey: payload.sdkKey,
                        userName: payload.userName,
                        userEmail: payload.userEmail,
                        passWord: payload.passWord,
                        zak: returnZak(),
                        success() {
                            console.warn('-----joined----')
                        },
                        error(error) {
                            console.warn(error)
                        }
                    })
                } else {
                    ZoomMtg.join({
                        meetingNumber: payload.meetingNumber,
                        signature,
                        sdkKey: payload.sdkKey,
                        userName: payload.userName,
                        userEmail: payload.userEmail,
                        passWord: payload.passWord,
                        tk: '',
                        success() {
                            console.warn('-----joined----')
                        },
                        error(error) {
                            console.warn(error)
                        }
                    })
                }
                
            },
            error(error) {
                console.warn(error)
            }
        })
        // ZoomMtg.generateSDKSignature({
        //     appKey: payload.sdkKey,
        //     iat: 1646937553,
        //     exp: 1646944753,
        //     tokenExp: 1646944753,
        //     meetingNumber: payload.meetingNumber,
        //     role:payload.role,
        //     sdkKey:payload.sdkKey,
        //     sdkSecret:payload.sdkSecret,
        //     success(signature) {
                
        //     },
        //     error(error) {
        //         console.warn(error)
        //     }
        // })
    }, [])
  return (
    
      <Fragment>
         <link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.12.0/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.12.0/css/react-select.css" />
      </Fragment>
  )
}

export default JoinMeeting