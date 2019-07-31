
import React,{Component} from 'react';
import {ListGroup, ListGroupItem, Modal, Panel, Table} from 'react-bootstrap';

const modalStyle = {
    position: 'fixed',
    zIndex: 1040,
    top: 0, bottom: 0, left: 0, right: 0,
    // 'overflow-y': 'scroll'
    'overflowY': 'scroll'
};

const backdropStyle = {
    ...modalStyle,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
};

const dialogStyle = function() {
    // we use some psuedo random coords so nested modals
    // don't sit right on top of each other.
    let top = 50;
    let left = 50;

    return {
        position: 'absolute',
        width: 400,
        top: top + '%', left: left + '%',
        transform: `translate(-${top}%, -${left}%)`,
        border: '1px solid #e5e5e5',
        backgroundColor: 'white',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)',
        padding: 20
    };
};

export default class DetailModal extends React.Component {
    DETECTION_CHOICES = ['-', '+', '++']
    TRIAGE_LEVEL = ['赤', '黄', '緑']
    EXIST_CHOICES = ['不明', 'あり', 'なし']

    PLACENTA_ATTACHMENT_SITES = ['不明', '正常', '辺縁', '後壁']
    DELIVERY_METHODS = ['不明', '経膣分娩', '帝王切開']

    shouldComponentUpdate(){
        console.log("detailmodal")
        console.log(this.props.destination_marker)
        return true
    }
    render(){
        const record = this.props.record
        const records = this.props.destination_marker.consultationRecords
        const children = this.props.destination_marker.children
        let child_idx = 1;
        return(
            <div className='modal-example'>
                <Modal
                    aria-labelledby='modal-label'
                    style={modalStyle}
                    backdropStyle={backdropStyle}
                    show={this.props.showModal}
                    onHide={this.props.close}
                >

                    <div style={dialogStyle()} >

                        <button type="button" className="close" data-dismiss="Modal" onClick={this.props.close}><span>×</span></button>
                        <h4 id='modal-label'>患者情報 (ID: {this.props.destination_marker.user.id})</h4>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title>
                                    基本情報
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>項目名</th>
                                            <th>値</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>氏名</td>
                                            <td>{this.props.destination_marker.user.full_name}</td>
                                        </tr>
                                        {/* <tr>
                                            <td>トリアージレベル</td>
                                            <td>{this.TRIAGE_LEVEL[this.props.destination_marker.user.triage_level]}</td>
                                        </tr> */}
                                        <tr>
                                            <td>産前/産後</td>
                                            <td>{this.props.destination_marker.pregnancy.birth_already ? '産後' : '産前'}</td>
                                        </tr>
                                        <tr>
                                            <td>出産日</td>
                                            <td>{this.props.destination_marker.pregnancy.birthday}</td>
                                        </tr>
                                        <tr>
                                            <td>分娩方法</td>
                                            <td>{this.DELIVERY_METHODS[this.props.destination_marker.pregnancy.delivery_method]}</td>
                                        </tr>
                                        <tr>
                                            <td>出産予定日</td>
                                            <td>{this.props.destination_marker.pregnancy.expected_delivery_date}</td>
                                        </tr>
                                        <tr>
                                            <td>最終月経開始日</td>
                                            <td>{this.props.destination_marker.pregnancy.last_menstruation_start_date}</td>
                                        </tr>
                                        <tr>
                                            <td>帝王切開の予定</td>
                                            <td>{this.props.destination_marker.pregnancy.will_caesaren_section ? 'あり': 'なし'}</td>
                                        </tr>
                                        <tr>
                                            <td>胎盤付着部位</td>
                                            <td>{this.PLACENTA_ATTACHMENT_SITES[this.props.destination_marker.pregnancy.placenta_attachment_site]}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    母体・胎児に関するデータ
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    {
                                        children.map(child => {
                                        return(
                                            <Child
                                                child={child}
                                                id={child_idx++}
                                            />
                                        )
                                        })
                                    }
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    過去の妊娠に関するデータ
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>項目名</th>
                                                <th>値</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>妊娠回数</td>
                                                <td>{this.props.destination_marker.gpac.gravidity}</td>
                                            </tr>
                                            <tr>
                                                <td>出産回数</td>
                                                <td>{this.props.destination_marker.gpac.parity}</td>
                                            </tr>
                                            <tr>
                                                <td>自然/人口流産の回数</td>
                                                <td>{this.props.destination_marker.gpac.abortion}</td>
                                            </tr>
                                            <tr>
                                                <td>帝王切開の回数</td>
                                                <td>{this.props.destination_marker.gpac.caesarean_section}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    妊婦健診結果一覧
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    {records.map(record => {
                                        return(
                                            <ConsultationRecord
                                                record={record}
                                                key={record.id}
                                            />
                                        )
                                    })}
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                    </div>
                </Modal>
            </div>
        )
    }
}
class Child extends React.Component{
    // PLACENTA_ATTACHMENT_SITES = ['不明', '正常', '辺縁', '後壁']
    PRESENTATIONS = ['不明', '頭位', '骨盤位', '肩甲位']
    render(){
        return(
            <Panel id="collapsible-panel-example-2">
                <Panel.Heading>
                    <Panel.Title toggle>
                        胎児{this.props.id}に関するデータ
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th>項目名</th>
                                    <th>値</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td>胎盤付着部位</td>
                                    <td>{this.PLACENTA_ATTACHMENT_SITES[this.props.child.placenta_attachment_site]}</td>
                                </tr> */}
                                <tr>
                                    <td>胎位</td>
                                    <td>{this.PRESENTATIONS[this.props.child.presentation]}</td>
                                </tr>
                                <tr>
                                    <td>推定体重[g]</td>
                                    <td>{this.props.child.estimated_weight}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }

}

class ConsultationRecord extends React.Component{
    DETECTION_CHOICES = ['-', '+', '++', '++', '+++', '++++']
    TRIAGE_LEVEL = ['赤', '黄', '緑']
    EXIST_CHOICES = ['不明', 'あり', 'なし']
    CERVICAL_CHOICES = ['不明', '正常', '短い']
    render(){
        return(
            <Panel id="collapsible-panel-example-2">
                <Panel.Heading>
                <Panel.Title toggle>
                    {this.props.record.consultation_date}の健康診断結果
                </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                <Panel.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>項目名</th>
                                <th>値</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>浮腫</td>
                                <td>{this.DETECTION_CHOICES[this.props.record.edema]}</td>
                            </tr>
                            <tr>
                                <td>尿蛋白</td>
                                <td>{this.DETECTION_CHOICES[this.props.record.urinary_protein]}</td>
                            </tr>
                            <tr>
                                <td>尿糖</td>
                                <td>{this.DETECTION_CHOICES[this.props.record.urinary_sugar]}</td>
                            </tr>
                            <tr>
                                <td>頸管長</td>
                                <td>{this.CERVICAL_CHOICES[this.props.record.cervical_length]}</td>
                            </tr>
                            <tr>
                                <td>体重[kg]</td>
                                <td>{this.props.record.weight}</td>
                            </tr>
                            <tr>
                                <td>子宮底長[cm]</td>
                                <td>{this.props.record.uterotome_length}</td>
                            </tr>
                            <tr>
                                <td>最高血圧[mmHg]</td>
                                <td>{this.props.record.systolic_blood_pressure}</td>
                            </tr>
                            <tr>
                                <td>最低血圧[mmHg]</td>
                                <td>{this.props.record.diastolic_blood_pressure}</td>
                            </tr>
                            <tr>
                                <td>腹囲[cm]</td>
                                <td>{this.props.record.abdominal_circumference}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }
}