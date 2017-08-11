import React from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, InputGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import $ from 'jquery';

class Form extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      price: "",
      location: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e){
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  onSubmit(e){
    var that = this;
    e.preventDefault();
    $.post("/listings", {
      name: that.state.name, price: that.state.price, location: that.state.location}, function(data){
        that.props.getListings();
    });
  }

  render () {
    return (
      <form>

        <FormGroup>
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
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl
              type="text"
              placeholder="Price"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              />

            <InputGroup.Addon></InputGroup.Addon>
          </InputGroup>
        </FormGroup>

        <FormGroup>
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
        </FormGroup>
        <DropdownButton
          componentClass={InputGroup.Button}
          id="input-dropdown-addon"
          title="Pack Size"
          >
          <MenuItem key="1">2</MenuItem>
          <MenuItem key="2">3</MenuItem>
          <MenuItem key="3">4</MenuItem>
          <MenuItem key="4">5</MenuItem>
          <MenuItem key="5">6</MenuItem>
          <MenuItem key="6">7</MenuItem>
          <MenuItem key="7">8</MenuItem>
        </DropdownButton>
        <Button bsStyle="success" onClick={this.onSubmit}>Create</Button>

      </form>
    );
  }
}

export default Form;
