import React from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, InputGroup, FormControl, Button, DropdownButton, MenuItem, Grid, HelpBlock } from 'react-bootstrap';
import $ from 'jquery';
import getListingCoordinates from '../../Geocode.js'

class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      description: "",
      price: "",
      location: "",
      img_url: "",
      url: "",
      packSize: "",
      formValidationErrors: {
        item: "",
        price: "",
        location: "",
        packSize: ""
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  componentDidMount() {
    if (this.props.prePopulate) {
      this.setState({
        name: this.props.prePopulate.description,
        price: this.props.prePopulate.list_price,
        description: this.props.prePopulate.long_description,
        img_url: this.props.prePopulate.medium_image,
        url: this.props.prePopulate.url

      });
    }
  }


  onChange(e){
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e){
    e.preventDefault();
    getListingCoordinates(this.state.location, (results) => {
      console.log(results);
      this.props.socket.emit('newListing', {
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        location: this.state.location,
        lat: results.results[0].geometry.location.lat,
        lng: results.results[0].geometry.location.lng,
        initializer: this.props.userId,
        image_url: this.state.img_url,
        url: this.state.url,
        num_of_participants: this.state.packSize
      });
      this.props.hideModal();
      this.props.history.push('/initiated');

    });
  }

  render () {
    const errorStyle = {
      color: 'red'
    };
    return (
      <form>
        <FormGroup controlId="item" validationState={this.state.formValidationErrors.item.length > 0 ? "error" : null}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Item Name"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
          <span style={errorStyle}>{this.state.formValidationErrors.item}</span>
        </FormGroup>
        <FormGroup controlId="price" validationState={this.state.formValidationErrors.price.length > 0 ? "error" : null}>
          <label
            className={'control-label'}
            htmlFor='price'>Total Price
          </label>
          <InputGroup>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl
              type="number"
              placeholder="Price (eg. 11, 7.53 or 78.40)"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
          <span style={errorStyle}>{this.state.formValidationErrors.price}</span>
        </FormGroup>
        <FormGroup controlId="pricePerWolf">
          <label
            className={'control-label'}
            htmlFor='pricePerWolf'>Price Per Wolf
          </label>
          <InputGroup>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl
              type="number"
              placeholder=""
              name="pricePerWolf"
              value={((this.state.price / (Number(this.state.packSize) + 1) )).toFixed(2)}
              onChange={this.onChange}
              readOnly="true"
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
          <HelpBlock>This is the price that each wolf will have to pay.</HelpBlock>
        </FormGroup>
        <FormGroup controlId="location" validationState={this.state.formValidationErrors.location.length > 0 ? "error" : null}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder = "Pickup Location"
              name="location"
              value={this.state.location}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
          <span style={errorStyle}>{this.state.formValidationErrors.location}</span>
        </FormGroup>
        <FormGroup controlId="packSize" validationState={this.state.formValidationErrors.packSize.length > 0 ? "error" : null}>
          <InputGroup id='packSize'>
            <FormControl
              type="number"
              placeholder="How many more wolves do you want in your pack? (eg. 3, 2 or 8)"
              name="packSize"
              value={this.state.packSize}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
          <span style={errorStyle}>{this.state.formValidationErrors.packSize}</span>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Link to Item"
              name="url"
              value={this.state.url}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Item Image URL"
              name="img_url"
              value={this.state.img_url}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Description for your Campaign"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              />
            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <Button bsStyle="success" onClick={this.onSubmit}>Create</Button>
      </form>
    );
  }
}

export default Form;

        // <DropdownButton
        //   componentClass={InputGroup.Button}
        //   id="input-dropdown-addon"
        //   title="Pack Size"
        //   >
        //   <MenuItem key="1">2</MenuItem>
        //   <MenuItem key="2">3</MenuItem>
        //   <MenuItem key="3">4</MenuItem>
        //   <MenuItem key="4">5</MenuItem>
        //   <MenuItem key="5">6</MenuItem>
        //   <MenuItem key="6">7</MenuItem>
        //   <MenuItem key="7">8</MenuItem>
        // </DropdownButton>
