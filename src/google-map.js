import React,{Component} from 'react';
import {Button} from 'react-bootstrap';

const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapWithAMarkerClusterer = compose(
  withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAdk8qQIzp_NQa_KCaDYoXLhrJYE2ZkxMY.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `900px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={14}
    center={props.center}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={marker['id']}
          position={{ lat: Number(marker.location.latitude), lng: Number(marker.location.longitude)}}
          onClick={(e => props.toggleOpen(marker.user.id))} 
        >
         {marker.isOpen && <InfoWindow onCloseClick={e => props.toggleOpen(marker.user.id)}>
            <MarkerInfo marker={marker} setDestinationMarker={props.setDestinationMarker}/>
          </InfoWindow>}
        </Marker>
      ))}
    </MarkerClusterer>
  </GoogleMap>
);

class MarkerInfo extends React.Component {
  render(){
    let marker = this.props.marker
    let name = 'ID: ' + marker.user.id
    let id = marker.user.id
    return(
      <Button className={"btn " } bsStyle="" onClick={e => this.props.setDestinationMarker(id)}>{name}</Button>
    )
  }
}

export default MapWithAMarkerClusterer;
