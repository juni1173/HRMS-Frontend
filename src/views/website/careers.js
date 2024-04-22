import {React, useEffect, useState} from 'react'
import { Helmet } from 'react-helmet'
import { Facebook } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'
import { Spinner } from 'reactstrap'

const CareersPage = () => {
    const Api = apiHelper()
    // const baseUrl = 'http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/'
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const getJobs = async () => {
        setLoading(true)
        await Api.get(`/jobs/kavtech/website/`).then(result => {
          if (result) {
            if (result.status === 200) {
              setData(result.data)
            } else {
              setData([])
            }
          } else {
            Api.Toast('error', 'Server not responding!')
          }
        })
        setTimeout(() => {
          setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        // Load jQuery and Bootstrap scripts
        const loadScripts = async () => {
          const jqueryScript = document.createElement('script')
          jqueryScript.src = 'http://code.jquery.com/jquery-3.3.1.min.js'
          jqueryScript.integrity = 'sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8='
          jqueryScript.crossOrigin = 'anonymous'
          document.body.appendChild(jqueryScript)
    
          const popperScript = document.createElement('script')
          popperScript.src = '//cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js'
          document.body.appendChild(popperScript)
    
          const bootstrapScript = document.createElement('script')
          bootstrapScript.src = '//stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'
          document.body.appendChild(bootstrapScript)
    
          const templateScript = document.createElement('script')
          templateScript.src = 'http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/assets/js/template.js'
          document.body.appendChild(templateScript)
        }
    
        loadScripts()
        getJobs()
        return () => {
          // Cleanup function to remove added scripts
          document.body.removeChild(jqueryScript)
          document.body.removeChild(popperScript)
          document.body.removeChild(bootstrapScript)
          document.body.removeChild(templateScript)
        }
      }, [])
  return (
    <div className='career-body body'>
        <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
        <link rel="stylesheet" href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/style.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        {/* <link rel="stylesheet" href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/assets/font-awesome-4.7.0/css/font-awesome.min.css" /> */}
        <link href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/assets/css/template.css" rel="stylesheet" type="text/css" />
        <title>Careers</title>
      </Helmet>
      <div className="container-fluid" style={{ height: '65px' }}>
            <div className="nav">
                 <div className="nav-animation"></div>
                 <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
                    <div className="container nav-container" style={{backgroundColor: 'transparent'}}>
                       <a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/index.html" className="brand w-nav-brand"><img src="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/images/logo-white.png" width="200" loading="lazy" alt="Kavtech logo"/></a>
                       <nav role="navigation" className="nav-menu w-nav-menu">
                          <a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/about.html" className="nav-link w-nav-link">About</a><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/our-people.html" className="nav-link w-nav-link">Team</a><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/careers.html" className="nav-link w-nav-link">Careers</a><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/case-studies.html" className="nav-link w-nav-link">Case Studies</a>
                          <div className="nav-button-wrapper">
                             <div className="button-wrapper">
                                <a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/contact.html" className="button w-button">Give us a call</a>
                                <div className="button-background"></div>
                             </div>
                          </div>
                       </nav>
                       <div className="menu-button w-nav-button">
                          <div className="hamburger-menu">
                             <div className="hamburger-line line-one"></div>
                             <div className="hamburger-line line-two"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
      </div>

      <div className="row page-header-section">
              <div className="col-md-7" style={{padding: '100px'}}>
                  <h1 className="sub-title text-white">Careers</h1>
                  <p style={{textAlign:'inherit'}}>Where Passion Meets Purpose </p>
              </div>
              <div className="col-md-5 float-right">
                  <img src="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/images/Careers-Image.png" className="w-100" />
              </div>
          </div>

      <div className="careers-background">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <h2 className="sub-title text-center text-white">Careers at Kavtech</h2>
                        <p className="text-center">As we continue to expand our horizons and push the boundaries of technology, we are on the lookout for passionate individuals to join our dynamic team. We are not just seeking candidates; we are on a quest for individuals who are ready to embark on a journey of growth, creativity, and excellence. If you are driven by a thirst for knowledge, fueled by curiosity, and inspired to make a meaningful impact, then Kavtech is the place for you. Explore our open vacancies below and discover the exciting opportunities that await you in shaping the future of technology with us.</p>
                        <div className="d-flex justify-content-center mb-5">
                                <a href="#job_div"><button type="button" className="btn btn-primary rounded-pill">Explore Open Roles</button></a>
                        </div>
                        <hr></hr>    
                    </div>
                    <div className="col-md-2"></div>
                </div>
                    
                <div className="row justify-content-center mt-2" id='job_div'>
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <h3 className="sub-title text-center text-white">Our Roles</h3>
                        <p className="text-center">Join our talent Community</p>
                    </div>
                    <div className="col-md-3"></div>
                    <div className="col-md-12">
                        <div className="col-md-12 mb-5" id="">
                            
                            {!loading ? (
                                Object.values(data).length > 0 ? (
                                    Object.values(data).map((item, index) => (
                                        <a href={`http://178.128.85.114:30/apply/${item.uuid}`} index={index} target="_blank">
                                        <div  className="card text-white careers-card bg-dark" style={{cursor: 'pointer'}}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className='text-white'>{item.jd_title ? item.jd_title : 'No title found!'}</h4>
                                                </div>
                                                <div className="col-md-6"><p className="float-right">Openings <span className="fa fa-arrow-down"></span></p></div>
                                            </div>
                                        </div>
                                        </div>
                                        </a>
                                    ))
                                    
                                ) : (
                                    <div  className="card text-white careers-card bg-dark" style={{cursor: 'pointer'}}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className='text-white'>No Job Found!</h4>
                                                </div>
                                            </div>
                                        
                                        </div>
                                        </div>
                                )
                            ) : (
                                <div className='text-center'><Spinner color='white' type='grow'/></div>
                            )
                            
                            }
                           
                           
                </div>
                    </div>
                </div>
            </div>
      </div>

      {/* Footer section */}
      <div className="container footer">
            <div className="row">
              <div className="col-md-4">
                <a href="index.html"><img src="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/images/logo-white.png" width="200" style={{paddingBottom:'10px', paddingTop: '10px'}}/></a>
                <p>Facing challenges in boosting your business performance? Or struggling with data? At Kavtech, we re-invent the data, using some of the most sophisticated, leading-edge tools in the industry.</p>
              </div>
              <div className="col-md-4" style={{paddingTop: '50px', paddingLeft: '50px'}}>
                <ul style={{listStyleType: 'none'}}>
                  <li><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/">Services</a></li>
                  <li><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/about.html">Who we are</a></li>
                  <li><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/pricing.html">Pricing</a></li>
                  <li><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/careers.html">Careers</a></li>
                  <li><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/our-values.html">Our Values</a></li>
                  <li><a href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/contact.html">Contact</a></li>
                </ul>
              </div>
              <div className="col-md-4 socials">
                <div className="row float-right">
                  <div className="p-2">
                    <a href="https://www.facebook.com/KavTechSolutions/" target="_blank"><Facebook color='white' /></a>
                  </div>
                  <div className="p-2">
                    <a href="https://www.instagram.com/kavtechsolutionspvtltd/" target="_blank"><i className="fa fa-instagram float-right fa-2x" aria-hidden="true" style={{paddingTop: '50px'}}></i></a>
                  </div>
                  <div className="p-2">
                    <a href="https://pk.linkedin.com/company/kavtech-solutions-pvt.-ltd." target="_blank"><i className="fa fa-linkedin-square float-right fa-2x" aria-hidden="true" style={{paddingTop: '50px'}}></i></a>
                  </div>
                </div>
              </div>
            </div>
     </div>
      
    </div>
  )
}

export default CareersPage
