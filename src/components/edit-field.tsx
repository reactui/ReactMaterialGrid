import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

interface ITableEditField {
  columnDef: any;
  rowData: any;
  value: any;
  locale?: any;

  scrollWidth: number;

  helperText: string;

  omRowDataChange: Function;
  onBulkEditRowChange: Function;
  onKeyDown: any;
  onChange: any;

  errorState: object | boolean;
  error?: boolean | undefined;
  autoFocus: boolean;
}

export default function MTableEditField(props: ITableEditField) {
  const renderLookupField = () => {
    return (
      <FormControl error={Boolean(props.error)}>
        <Select
          {...props}
          value={props.value === undefined ? "" : props.value}
          onChange={(event) => props.onChange(event.target.value)}
          style={{
            fontSize: 13,
          }}
          SelectDisplayProps={{ "aria-label": props.columnDef.title }}
        >
          {Object.keys(props.columnDef.lookup).map((key) => (
            <MenuItem key={key} value={key}>
              {props.columnDef.lookup[key]}
            </MenuItem>
          ))}
        </Select>
        {Boolean(props.helperText) && (
          <FormHelperText>{props.helperText}</FormHelperText>
        )}
      </FormControl>
    );
  };

  const renderBooleanField = () => {
    return (
      <FormControl error={Boolean(props.error)} component="fieldset">
        <FormGroup>
          <FormControlLabel
            label=""
            control={
              <Checkbox
                {...props}
                value={String(props.value)}
                checked={Boolean(props.value)}
                onChange={(event) => props.onChange(event.target.checked)}
                style={{
                  padding: 0,
                  width: 24,
                  marginLeft: 9,
                }}
                inputProps={{
                  "aria-label": props.columnDef.title,
                }}
              />
            }
          />
        </FormGroup>
        <FormHelperText>{props.helperText}</FormHelperText>
      </FormControl>
    );
  };

  const renderDateField = () => {
    const dateFormat =
      props.columnDef.dateSetting && props.columnDef.dateSetting.format
        ? props.columnDef.dateSetting.format
        : "dd.MM.yyyy";
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
        <DatePicker
          {...props}
          format={dateFormat}
          value={props.value || null}
          onChange={props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            },
          }}
          inputProps={{
            "aria-label": `${props.columnDef.title}: press space to edit`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const renderTimeField = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
        <TimePicker
          {...props}
          format="HH:mm:ss"
          value={props.value || null}
          onChange={props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            },
          }}
          inputProps={{
            "aria-label": `${props.columnDef.title}: press space to edit`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const renderDateTimeField = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={props.locale}>
        <DateTimePicker
          //{...this.getProps()}
          {...props}
          format="dd.MM.yyyy HH:mm:ss"
          value={props.value || null}
          onChange={props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            },
          }}
          inputProps={{
            "aria-label": `${props.columnDef.title}: press space to edit`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const renderTextField = () => {
    return (
      <TextField
        //...this.getProps()}
        {...props}
        fullWidth
        style={props.columnDef.type === "numeric" ? { float: "right" } : {}}
        type={props.columnDef.type === "numeric" ? "number" : "text"}
        placeholder={props.columnDef.editPlaceholder || props.columnDef.title}
        value={props.value === undefined ? "" : props.value}
        onChange={(event: any) =>
          props.onChange(
            props.columnDef.type === "numeric"
              ? event.target.valueAsNumber
              : event.target.value
          )
        }
        InputProps={{
          style: {
            fontSize: 13,
          },
        }}
        inputProps={{
          "aria-label": props.columnDef.title,
        }}
      />
    );
  };

  const renderCurrencyField = () => {
    return (
      <TextField
        //{...this.getProps()}
        {...props}
        placeholder={props.columnDef.editPlaceholder || props.columnDef.title}
        style={{ float: "right" }}
        type="number"
        value={props.value === undefined ? "" : props.value}
        onChange={(event: any) => {
          let value = event.target.valueAsNumber;
          if (!value && value !== 0) {
            value = undefined;
          }
          return props.onChange(value);
        }}
        InputProps={{
          style: {
            fontSize: 13,
            textAlign: "right",
          },
        }}
        inputProps={{
          "aria-label": props.columnDef.title,
        }}
        onKeyDown={props.onKeyDown}
        autoFocus={props.autoFocus}
      />
    );
  };

  const render = () => {
    let component: any = "ok";

    if (props.columnDef.lookup) {
      component = renderLookupField();
    } else if (props.columnDef.type === "boolean") {
      component = renderBooleanField();
    } else if (props.columnDef.type === "date") {
      component = renderDateField();
    } else if (props.columnDef.type === "time") {
      component = renderTimeField();
    } else if (props.columnDef.type === "datetime") {
      component = renderDateTimeField();
    } else if (props.columnDef.type === "currency") {
      component = renderCurrencyField();
    } else {
      component = renderTextField();
    }

    return component;
  };
}

// MTableEditField.propTypes = {
//   value: PropTypes.any,
//   onChange: PropTypes.func.isRequired,
//   columnDef: PropTypes.object.isRequired,
//   locale: PropTypes.object,
// };
