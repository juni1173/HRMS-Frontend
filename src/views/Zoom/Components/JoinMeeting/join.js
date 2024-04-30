import React, {Fragment, useEffect} from 'react'
import { CardBody, Card } from 'reactstrap'
import '../../../../assets/scss/style.scss'
const JoinMeeting = ({ payload }) => {
    useEffect(async () => {
        const {ZoomMtg} = await import("@zoomus/websdk")
        
        ZoomMtg.setZoomJSLib('https://source.zoom.us/3.6.0/lib', '/av')
        ZoomMtg.preLoadWasm()
        ZoomMtg.prepareWebSDK()
        ZoomMtg.prepareJssdk()
        ZoomMtg.generateSDKSignature({
            meetingNumber: payload.meetingNumber,
            role:payload.role,
            sdkKey:payload.sdkKey,
            sdkSecret:payload.sdkSecret,
            success(signature) {
                ZoomMtg.init({
                    leaveUrl: payload.leaveUrl,
                    patchJsMedia: true,
                    success() {
                        if (payload.role === 1) {
                            ZoomMtg.join({
                                meetingNumber: payload.meetingNumber,
                                signature: signature.result,
                                sdkKey: payload.sdkKey,
                                userName: payload.userName,
                                userEmail: payload.userEmail,
                                passWord: payload.passWord,
                                zak: payload.token,
                                tk: '',
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
                                signature: signature.result,
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
            },
            error(error) {
                console.warn(error)
            }
        })
    }, [])
  return (
    
      <Fragment></Fragment>
  )
}

export default JoinMeeting