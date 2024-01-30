import React from 'react'

const COMPONENTS_COUNT = 10
const COMPONENTS = ['case', 'gpu', 'cpu', 'cooling', 'motherboard', 'power', 'ssd']
class Configurator extends React.Component {
    constructor(props){
        super(props)
        this.state = {case: 0, gpu: 0, cpu: 0, cooling: 0, motherboard: 0, power: 0, ssd: 0, total: 0}

    }
    updateData = (componentName, value) => {
        this.setState({[componentName]: value, total: 0
    })
        this.setState((state) => {
            return {total: Object.values(state).reduce((a, b) => a + b, 0)}
        })
     }
    render() {
        return (
            <React.Fragment>
                <h1>BUILD YOUR PC</h1>
                <div>
                    <ul>
                        {COMPONENTS.map((componentName, key) => (
                            <MyComponent componentName={componentName} key={key} updateData={this.updateData}/>))}
                    </ul>
                    <label>Total price: {this.state.total}</label>
                </div>
            </React.Fragment>
        )

    }
}

export default Configurator


class MyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.state = {
            selectedItemID: new URLSearchParams(window.location.search).get(this.props.componentName),
            items: [],
            currentPrice: 0
        };
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        event.preventDefault()
        this.setState({ value: event.target.value });
        for (let child of event.target.children) {
            if (child.value == event.target.value){
                let urlParams = new URLSearchParams(window.location.search)
                
                let [componentName, componentID] = child.id.split('#')
                urlParams.set(componentName, componentID)
                let newUrl = window.location.origin + window.location.pathname + '?' + urlParams.toString()
                window.history.pushState(null, null, newUrl)
                for (let component in this.state.items){
                    if (this.state.items[component].componentid == componentID){
                        this.setState({currentPrice: this.state.items[component].price})
                        this.props.updateData(componentName, this.state.items[component].price)
                        
                    }
                }
                        
            }
        }

    }


    componentDidMount() {
        fetch(`http://localhost:5000/api/v1.0/components/` + this.props.componentName)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        items: result.slice(0, COMPONENTS_COUNT)
                    });
                    let urlParams = new URLSearchParams(window.location.search)
                    let componentID = urlParams.get(this.props.componentName)

                    for (let component in this.state.items){
                        if (this.state.items[component].componentid == componentID){
                            this.ref.current.value = this.state.items[component].manufacturer + ' ' + this.state.items[component].model
                            this.props.updateData(this.props.componentName, this.state.items[component].price)
                            this.setState({currentPrice: this.state.items[component].price})
                            break
                        }
                        else {this.ref.current.value = 'Select item'}

                    }

                },
            )
            
    }


    render() {
        return (
            <li>
                <label>{this.props.componentName}:
                <select  id={this.props.componentName} onChange={this.handleChange} ref={this.ref}>
                        {this.state.items.map((component, key) => (
                            <option id={this.props.componentName+'#'+component.componentid} key={key}>{component.manufacturer + ' ' + component.model}</option>))}
                    </select>
                    <label>price: {this.state.currentPrice}</label>
                </label>
            </li>
        );
    }
}
