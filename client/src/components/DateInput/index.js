import React, { Component } from 'react'
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
});

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/[0-1]/, /[0-9]/, '/', /[0-3]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

class FormattedInputs extends Component {
  state = {
    textmask: '__/__/____',
  };

  handleChange = name => event => {
    this.props.onChange(event)
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <TextField
          id={this.props.id}
          label={this.props.label}
          className={classes.textField}
          name={this.props.name}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            shrink: true,
            inputComponent: TextMaskCustom,
            value:this.props.value,
            onChange: this.handleChange('textmask'),
          }}
        />
      </div>
    );
  }
}

FormattedInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormattedInputs);