import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const BUILDS_COUNT = 3
const FIELDNAMES = ['case', 'cooling', 'cpu', 'gpu', 'motherboard', 'power', 'ssd']


const FeaturedPage = () => {  // TODO https://react.semantic-ui.com/modules/popup/#types-trigger
    const builds = []
    var [buildsData, setBuilds] = useState(builds)

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`http://localhost:5000/api/v1.0/builds`)
            const body = await result.json()
            setBuilds(body.slice(0, BUILDS_COUNT))
        }
        fetchData()
    }, [])


    return (
        <React.Fragment>
            <h1>FEATURED BUILDS</h1>
            <div>
                {buildsData.map((build, key) => (
                    <Build buildData={build} key={key} />))}
            </div>
        </React.Fragment>
    )
}
class Build extends React.Component {
    constructor(props) {
        super(props)
        this.urlParams = new URLSearchParams()
        FIELDNAMES.forEach(fieldName => this.urlParams.append(fieldName, this.props.buildData[fieldName].componentid))
        this.state = {
            case: {'componentid': this.props.buildData.case.componentid},
            cooling: {'componentid': this.props.buildData.cooling.componentid},
            cpu: {'componentid': this.props.buildData.cpu.componentid},
            gpu: {'componentid': this.props.buildData.gpu.componentid},
            motherboard: {'componentid': this.props.buildData.motherboard.componentid},
            power: {'componentid': this.props.buildData.power.componentid},
            ssd: {'componentid': this.props.buildData.ssd.componentid},
            totalPrice: 0,
            configuratorUrl: (window.location.origin + '/build-your-own?' + this.urlParams.toString()),
            buildLink: (window.location.href + '/' + this.props.buildData.buildid),
            img: 'http://localhost:5000/img/' + this.props.buildData.img  // Template img
        }
        this.capitalizeFirstLetter = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
    }

    componentDidMount() {
        for (const i in FIELDNAMES){
            fetch(`http://localhost:5000/api/v1.0/components/` + FIELDNAMES[i] + '/' + this.state[FIELDNAMES[i]].componentid)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState((state) => ({
                        [FIELDNAMES[i]]: result, totalPrice: state.totalPrice + result.price
                    }))
                },
            )
        }
    }
    

    

    render() {
        return (
        <div>
            <h2>{this.props.buildData.buildName}</h2>
            <Popup trigger={<img alt="PC" src={this.state.img} width='600px' height='600px' />} position="right center" on='click' closeOnDocumentClick>
                <ul>
                    <li>Publish date: {this.props.buildData['date']}</li>
                    <li><a href={this.state.buildLink}>More details</a></li>
                    <div>{FIELDNAMES.map((fieldName, key) => (
                    <li key={key}>{this.capitalizeFirstLetter(fieldName)}: {this.state[fieldName].manufacturer}  {this.state[fieldName].model}</li>))}
                    </div>
                </ul>
            </Popup>
        </div>
        )

}
}
export default FeaturedPage