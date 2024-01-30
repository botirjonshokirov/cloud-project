import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import React from 'react'

  export class Maps extends React.Component {
    render() {
      const mapStyles = {
        width: "50%",
        height: "50%",
      };
      return (
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 53.205328483991, lng: 28.042706992248295 }}>
          <Marker position={{ lat: 53.205328483991, lng: 28.042706992248295 }}/>
        </Map>
      );
    }
  }
  
  export default GoogleApiWrapper({
    apiKey: "AIzaSyBwT6FbIE5j3nJHB9wpwa-PGNhf0geF1U8",
  })(Maps);