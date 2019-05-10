import React,{Component} from 'react';
import {Panel, Table} from 'react-bootstrap';

export default class PatientList extends React.Component{
    render(){
      return(
        <Panel bsStyle="success" className="max-width list-panel">
          <Panel.Heading>
            <Panel.Title componentClass="h3">List</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Table responsive striped>
              <thead>
                <th>ID</th>
                <th>氏名</th>
                <th>産前/産後</th>
                {/* <th>トリアージレベル</th> */}
              </thead>
              <tbody>
                {this.props.markers.map(marker=>(
                    <TableTr
                        onClick={this.props.onClick}
                        isActive={marker.user.id===this.props.destination_marker.user.id}
                        marker={marker}
                    />
                ))}
              </tbody>
            </Table>
          </Panel.Body>
        </Panel>
      )
    }
}

class TableTr extends React.Component{
    TRIAGE_LEVEL = ['赤', '黄', '緑']
  
    render(){
        const label = this.props.isActive ? 'table-active' : null
        const marker = this.props.marker
        return(
        <tr className={label} onClick={(e)=>this.props.onClick(marker.user.id)}>
            <td>{marker.user.id}</td>
            <td>{marker.user.full_name}</td>
            <td>{marker.pregnancy.birth_already ? '産後' : '産前'}</td>

            {/* <td>{this.TRIAGE_LEVEL[marker.user.triage_level]}</td> */}
        </tr>
        )
    }
}