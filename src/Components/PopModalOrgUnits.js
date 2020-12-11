import React, { useContext, useState } from 'react'
import { GetOrgUnits } from '../Data/OrgDataHook'
import { Modal, Button, Form } from 'react-bootstrap'
import {userIntelContext} from '../App'
const OrgData = (props) => {
  const universalUrl = 'https://dev.hisprwanda.org/hiv/api/organisationUnits/'
  let [provinceData, districtData, subDistrictData, sectorData, hospitalData] = [null, null, null, null, null]
  let [provinceRender, districtRender, subDistrictRender, sectorRender, hospitalRender] = [null, null, null, null, null]
  const levels = ['National', 'Province', 'District', 'Sub District', 'Sector', 'Hospital']
  const [province, setProvince] = useState()
  const [district, setDistrict] = useState()
  const [subDistrict, setSubDistrict] = useState()
  const [sector, setSector] = useState()
  // get orgunit name
  const [hospitalparentOrgunit, setHospitalParentOrgunit] = useState('')
  // logged in user info
  const user = useContext(userIntelContext)
  const userId=user.userToken.orgunit
  // 
  const [show, setShow] = useState(false)
  const handleClose = () => ([setShow(false), [districtData.data, subDistrictData.data, sectorData.data, hospitalData.data] = [null, null, null, null]])
  const handleShow = () => setShow(true)
  const getSelectedText = (elementId) => {
    let elt = document.getElementById(elementId);
    if (elt.selectedIndex === -1) return null;
    return elt.options[elt.selectedIndex].text;
  };
  const country = GetOrgUnits(`${universalUrl}?paging=false&level=1`)
  let countryLevelId = null;
  if (country.data !== null) {
    countryLevelId = country.data.organisationUnits[0].id;
  }
  provinceData = GetOrgUnits(`${universalUrl}${userId}?level=1`)
  const handleProvinceChange = (event) => {
    setProvince(event.target.value)
    districtData = subDistrictData = sectorData = hospitalData = null
    setDistrict(null)
    setSubDistrict(null)
    setSector(null)
    let getName = getSelectedText(event.target.id)
    props.onChange({ orgUnitId: event.target.value, level: 2, orgUnitName: getName})
  }
  const handleDistrictChange = (event) => {
    setDistrict(event.target.value)
    districtData = null
    subDistrictData = null
    sectorData = null
    hospitalData = null
    setSubDistrict(null)
    setSector(null)
    let getName = getSelectedText(event.target.id)
    props.onChange({ orgUnitId: event.target.value, level: 3, orgUnitName: getName})
  }
  const handleSubDistrictChange = (event) => {
    setSubDistrict(event.target.value)
    sectorData = null
    hospitalData = null
    setSector(null)
    let getName = getSelectedText(event.target.id)
    setHospitalParentOrgunit(getSelectedText(event.target.id))
    props.onChange({ orgUnitId: event.target.value, level: 4, orgUnitName: getName ,parentOrgunit:countryLevelId,parentOrgunitName:country.data.organisationUnits[0].displayName })
  }
  const handleSectorChange = (event) => {
    setSector(event.target.value)
    let getName = getSelectedText(event.target.id)
    props.onChange({ orgUnitId: event.target.value, level: 5, orgUnitName: getName})
  }
  const handleHospitalChange = (event) => {
    let getName = getSelectedText(event.target.id)
    props.onChange({ orgUnitId: event.target.value, level: 6, orgUnitName: getName ,parentOrgunit:subDistrict,parentOrgunitName:hospitalparentOrgunit})
  }
  districtData = GetOrgUnits(`${universalUrl}${province}?level=1`)
  subDistrictData = GetOrgUnits(`${universalUrl}${district}?level=1`)
  sectorData = GetOrgUnits(`${universalUrl}${subDistrict}?level=1`)
  hospitalData = GetOrgUnits(`${universalUrl}${sector}?level=1`)
  if (provinceData.data) {
    provinceRender =
      <div>
        <Form.Group controlId="provinceSelect">
          <Form.Label>{levels[provinceData.data.organisationUnits[0].level - 1]} Level</Form.Label>
          <Form.Control as="select" custom onChange={handleProvinceChange}>
            <option value="">...</option>
            {Object.keys(provinceData.data.organisationUnits).map(key => <option key={key} value={provinceData.data.organisationUnits[key].id}>{provinceData.data.organisationUnits[key].name}</option>)}
          </Form.Control>
        </Form.Group>
      </div>
  }
  if (districtData.data && districtData !== null) {
    districtRender =
      <div>
        <Form.Group controlId="districtSelect">
          <Form.Label>{levels[districtData.data.organisationUnits[0].level - 1]} Level</Form.Label>
          <Form.Control as="select" custom onChange={handleDistrictChange}>
            <option value="">...</option>
            {Object.keys(districtData.data.organisationUnits).map(key => <option key={key} value={districtData.data.organisationUnits[key].id}>{districtData.data.organisationUnits[key].name}</option>)}
          </Form.Control>
        </Form.Group>
      </div>
  }
  if (subDistrictData.data) {
    subDistrictRender =
      <div>
        <Form.Group controlId="subDistrictSelect">
          <Form.Label>{levels[subDistrictData.data.organisationUnits[0].level - 1]} Level</Form.Label>

          <Form.Control as="select" custom onChange={handleSubDistrictChange}>
            <option value="">...</option>
            {Object.keys(subDistrictData.data.organisationUnits).map(key => <option key={key} value={subDistrictData.data.organisationUnits[key].id}>{subDistrictData.data.organisationUnits[key].name}</option>)}
          </Form.Control>
        </Form.Group>

      </div>
  }
  if (sectorData.data) {
    sectorRender =
      <div>
        <Form.Group controlId="sectorSelect">
          <Form.Label>{levels[sectorData.data.organisationUnits[0].level - 1]} Level</Form.Label>
          <Form.Control as="select" custom onChange={handleSectorChange}>
            <option value="">...</option>
            {Object.keys(sectorData.data.organisationUnits).map(key => <option key={key} value={sectorData.data.organisationUnits[key].id}>{sectorData.data.organisationUnits[key].name}</option>)}
          </Form.Control>
        </Form.Group>
      </div>
  }
  if (hospitalData.error && hospitalData.error_type.response.status === 404) {
    hospitalRender = <div>No Hospitals in your region</div>
  }
  if (hospitalData.data && sector !== "" && subDistrict !== "") {
    hospitalRender =
      <div>
        <Form.Group controlId="hospitalSelect">
          <Form.Label>{levels[hospitalData.data.organisationUnits[0].level - 1]} Level</Form.Label>
          <Form.Control as="select" custom onChange={handleHospitalChange}>
            <option value="">...</option>
            {Object.keys(hospitalData.data.organisationUnits).map(key => <option key={key} value={hospitalData.data.organisationUnits[key].id}>{hospitalData.data.organisationUnits[key].name}</option>)}
          </Form.Control>
        </Form.Group>
      </div>
  }
  return (
    <div>
      <Button variant={props.btnColor} onClick={handleShow}>
        {props.btnName}
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Select Organisation Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="myForm">
            {provinceRender}{districtRender}{subDistrictRender}{sectorRender}{hospitalRender}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default OrgData
