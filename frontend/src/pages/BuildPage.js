import React from 'react'

const FIELDNAMES = ['case', 'cooling', 'cpu', 'gpu', 'motherboard', 'power', 'ssd']


class BuildPage extends React.Component {
    constructor(props) {
        super(props)
        let urlSplitted = window.location.pathname.split('/')
        this.state = {
            case: {'componentid': null, 'description': null},
            cooling: {'componentid': null, 'description': null},
            cpu: {'componentid': null, 'description': null},
            gpu: {'componentid': null, 'description': null},
            motherboard: {'componentid': null, 'description': null},
            power: {'componentid': null, 'description': null},
            ssd: {'componentid': null, 'description': null},
            totalPrice: 0,
            configuratorUrl: null,
            buildID: urlSplitted[urlSplitted.length - 1],
            date: null,
            buildDescription: null,
            sameStorePrice: null,
            img: null,
            buildName: null
        }
    }

    componentDidMount() {
        fetch(`http://localhost:5000/api/v1.0/builds/` + this.state.buildID)
                .then(res => res.json())
                .then(
                    (result) => {
                        let buildParams = new URLSearchParams()
                        this.setState({
                            date: result.date,
                            buildDescription: result.description,
                            sameStorePrice: result.sameStorePrice,
                            img: 'http://localhost:5000/img/' + result.img,
                            buildName: result.buildName})
                        for (const i in FIELDNAMES){
                            buildParams.append(FIELDNAMES[i], result[FIELDNAMES[i]].componentid)
                        fetch(`http://localhost:5000/api/v1.0/components/` + FIELDNAMES[i] + '/' + result[FIELDNAMES[i]].componentid)
                                    .then(res => res.json())
                                    .then(
                                        (result) => {
                                            this.setState((state) => ({
                                                [FIELDNAMES[i]]: result, 
                                                totalPrice: state.totalPrice + result.price, 
                                                configuratorUrl: window.location.origin + '/build-your-own?' + buildParams.toString()
                                            }))
                                        },
                                    )
                        }
                    },
                )
    }


    render() {
        return (
            <ul>
                <h1>{this.state.buildName}</h1>
            <img src={this.state.img} alt="logo" width='600px' height='600px' />
            <li>{this.state.buildDescription}</li>
            <li>Publish date: {this.state.date}</li>
            <li><a href={this.state.configuratorUrl}>Change build configuration</a></li>
            <li>Total price: {this.state.totalPrice} vs {this.state.sameStorePrice} in same stores</li>
            <div>{FIELDNAMES.map((fieldName, key) => (
                    <li key={key}>
                    {fieldName}: {this.state[fieldName].manufacturer}  {this.state[fieldName].model}. {this.state[fieldName].description}
                </li>
                ))}
            </div>
            <p>{this.state.buildDescription}</p>
            </ul>
        )

}
}
export default BuildPage

