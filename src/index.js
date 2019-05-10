import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Nav, NavItem, Navbar, Panel, Grid, Row, Button, Col, ListGroup, ListGroupItem, Table, FormGroup, FormControl, ControlLabel, Modal} from 'react-bootstrap';

import api from './api';
import MapWithAMarkerClusterer from './google-map';
import DetailModal from './detail-modal';
import PatientList from './patient-list';

const axiosBase = require('axios');
const querystring = require('querystring');
const fetch = require("isomorphic-fetch");

const PAYLOAD_TYPE = {
  UP: 0,
  DOWN: 1,
}
const STATUS = [
  '緑',
  '黄',
  '赤',
]
const BTN_STATUS = [
  'btn-outline-success',
  'btn-outline-warning',
  'btn-outline-danger',
]
const ACCOUNT_ID = '00'


class DemoApp extends React.PureComponent {
  componentWillMount() {
    this.setState({ 
      markers: [],
      destination_marker: {
        user: '',
        pregnancy: '',
        children: [],
        location: '',
        gpac: '',
        consultationRecords: [],
      },
      center: {
        lat: 35.6795613614414,
        lng: 139.739767079332,
      },
      showModal: false,
    })
    this.getUserLocations();
  }

  // componentDidMount() {
  //   socket.on("chat message", (message) => {
  //       this.messageReceive(message);
  //   });
  // }

  getUserLocations() {
    console.log('func getUserLocations');
    api.getUserSummary().subscribe(summary => {
      if(!summary) return;
      for(let data of summary){
        if(!data.children){
          data.children = []
        }
        if (!data.pregnancy){
          data.pregnancy = {}
        }

        if(!data.gpac) {
          data.gpac = {}
        }

        if(!data.consultationRecords){
          data.consultationRecords = [];
        }

        this.messageReceive(data);
      }
    });
  }


  messageReceive(data) {
    let markers = this.state.markers.concat();

    if(!data){return}
    console.log(data)

    let id = data.user.id
    let isNew = true;
    let dest = this.state.destination_marker
    let isDest = false
    if(id === dest.id){
      isDest = true
    }

    for (let i = 0; i < markers.length; i++){
        let marker = markers[i];
        console.log(marker)
        console.log(data)
        if(marker.id === id){
            isNew = false;
            markers[i] = data
            break
        }
    }

    if (isNew){
        markers.push(data)
    }
    console.log(markers);
    this.setState({
        markers: markers
    });
    if(isDest){
      this.setDestinationMarker(id)
    }
  }

  decodeMessage(message){
      let type = Number(message.slice(0,1));
      let id = message.slice(1,3);
      let lat = message.slice(3, 12);
      let lng = message.slice(12, 22);
      let status = Number(message.slice(22,23))
      let timestamp = new Date();
      timestamp.setTime(message.slice(23, 36))

      if(type !== PAYLOAD_TYPE.UP ||isNaN(lat)|| isNaN(lng) || id === null){
        return null 
      }

      let data = {
            id: id,
            lat: lat,
            lng: lng,
            name: '作業員' + id,
            timestamp: timestamp.toLocaleString('ja-JP', { hour12: false }),
            status: status,
            isOpen: false,
        };
      return data
  }

  toggleOpen(id){
    console.log("toggle open")
    let markers = this.state.markers.concat();

    for (let i = 0; i < markers.length; i++){
        let marker = markers[i];
        if(marker.user.id === id){
            marker.isOpen = !marker.isOpen
            break
        }
    }
    this.setState({
        markers: markers
    });
  }

  setDestinationMarker(id){
    let destination_marker = this.findMarkerById(id)

    this.setState({
        destination_marker: destination_marker
    });
    this.openModal();
  }

  setCenter(id){
    let centeredMarker = this.findMarkerById(id)
    this.setDestinationMarker(id);

    this.setState({
      center: {
        lat: parseFloat(centeredMarker.location.latitude),
        lng: parseFloat(centeredMarker.location.longitude),
      },
    });
  }

  findMarkerById(id){
    let markers = this.state.markers.concat();
    for (let i = 0; i < markers.length; i++){
        let marker = markers[i];
        if(marker.user.id === id){
          return marker
        }
    }
  }

  openModal(){
    this.setState({
      showModal: true,
    });
  }

  closeModal(){
    this.setState({
      showModal: false,
    });
  }

  render() {
    return (
      <div>
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">MCHD for Doctors</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem>
             © 2018 Koshizuka Lab.
            </NavItem>
          </Nav>
        </Navbar>
        <Grid>
          <Row className="mapGrid">
            <Col md={4} className="row-eq-height">
              <PatientList
                onClick={this.setCenter.bind(this)}
                id={this.state.id}
                markers={this.state.markers}
                destination_marker={this.state.destination_marker}
              />
            </Col>
            <Col md={8} >
              <MapWithAMarkerClusterer 
                center={this.state.center}
                markers={this.state.markers}
                markerOnClick={this.setDestinationMarker.bind(this)}
                toggleOpen={this.toggleOpen.bind(this)}
                setDestinationMarker={this.setDestinationMarker.bind(this)}
               />
            </Col>
          </Row>
        </Grid>
      </div>
            <DetailModal 
              showModal={this.state.showModal}
              close={this.closeModal.bind(this)}
              destination_marker={this.state.destination_marker}
              record={this.state.destination_marker.consultationRecords[0] || {}}
            />
      </div>
    )
  }
}
<DemoApp />

ReactDOM.render(<DemoApp/>, document.getElementById('root'))