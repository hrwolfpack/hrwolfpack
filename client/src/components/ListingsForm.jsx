import React from 'react';
import ReactDOM from 'react-dom';
import { FormGroup, InputGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';

function Form (props){
  return (
    <form>

      <FormGroup>
        <InputGroup>
          <FormControl type="text" placeholder = "Item Name"/>
          <InputGroup.Addon></InputGroup.Addon>
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <InputGroup>
          <InputGroup.Addon>$</InputGroup.Addon>
          <FormControl type="text" placeholder = "Cost"/>
          <InputGroup.Addon>.00</InputGroup.Addon>
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <InputGroup>
          <FormControl type="text" placeholder = "Pickup Location"/>
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

    </form>

  );

}

export default Form;
