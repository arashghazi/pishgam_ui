import React from 'react'
import FooterStandard from '../../components/landing/FooterStandard'
import NavbarStandard from '../../components/navbar/NavbarStandard'

const HeaderFooter = ({children,match,location}) => {
  return (<>
  <NavbarStandard className='no' location={location} match={match} collapsed={location.pathname!=='/'} /> 
  {location.pathname!=='/'?<div style={{height:60}}/>:null}
  {children}
  <FooterStandard />
  </>
  )
}

export default HeaderFooter