import * as React from "react";
import {
  TableCell,
  TableRow,
  TextField,
  FormControl,
  Select,
  Input,
  InputLabel,
} from "@mui/material";
import {
  MenuItem,
  Checkbox,
  ListItemText,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { TimePicker, DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateFnsUtils from "@date-io/date-fns";
import { useEffect, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface ITableFilterRow {
  columns: [];
  isTreeData: boolean;
  hideFilterIcons: boolean;
  hasActions: boolean;
  hasDetailPanel: boolean;
  icons: any;
  localization: any;
  filterCellStyle: any;
  filterRowStyle: any;
  selection: any;
  actionsColumnIndex: number;
  detailPanelColumnAlignment: string;
  onFilterChanged: Function;
}

export default function MTableFilterRow(props: ITableFilterRow) {

  const getLocalizationData = () => ({
    ...defaultProps.localization,
    ...props.localization,
  });

  const getLocalizedFilterPlaceHolder = (columnDef: any) => {
    return (
      columnDef.filterPlaceholder ||
      getLocalizationData().filterPlaceHolder ||
      ""
    );
  };

  const LookupFilter = ({ columnDef }: any) => {
    const [selectedFilter, setSelectedFilter] = useState(
      columnDef.tableData.filterValue || []
    );

    useEffect(() => {
      setSelectedFilter(columnDef.tableData.filterValue || []);
    }, [columnDef.tableData.filterValue]);

    //useEffect(() => {
    // setSelectedFilter(columnDef.tableData.filterValue || []);
    //});

    return (
      <FormControl style={{ width: "100%" }}>
        <InputLabel
          htmlFor={"select-multiple-checkbox" + columnDef.tableData.id}
          style={{ marginTop: -16 }}
        >
          {getLocalizedFilterPlaceHolder(columnDef)}
        </InputLabel>
        <Select
          multiple
          value={selectedFilter}
          onClose={() => {
            if (columnDef.filterOnItemSelect !== true)
              props.onFilterChanged(columnDef.tableData.id, selectedFilter);
          }}
          onChange={(event) => {
            setSelectedFilter(event.target.value);
            if (columnDef.filterOnItemSelect === true)
              props.onFilterChanged(columnDef.tableData.id, event.target.value);
          }}
          input={
            <Input id={"select-multiple-checkbox" + columnDef.tableData.id} />
          }
          renderValue={(selecteds: any) =>
            selecteds
              .map((selected: any) => columnDef.lookup[selected])
              .join(", ")
          }
          MenuProps={MenuProps}
          style={{ marginTop: 0 }}
        >
          {Object.keys(columnDef.lookup).map((key) => (
            <MenuItem key={key} value={key}>
              <Checkbox checked={selectedFilter.indexOf(key.toString()) > -1} />
              <ListItemText primary={columnDef.lookup[key]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderFilterComponent = (columnDef: any) =>
    React.createElement(columnDef.filterComponent, {
      columnDef: columnDef,
      onFilterChanged: props.onFilterChanged,
    });

  const renderBooleanFilter = (columnDef: any) => (
    <Checkbox
      indeterminate={columnDef.tableData.filterValue === undefined}
      checked={columnDef.tableData.filterValue === "checked"}
      onChange={() => {
        let val;
        if (columnDef.tableData.filterValue === undefined) {
          val = "checked";
        } else if (columnDef.tableData.filterValue === "checked") {
          val = "unchecked";
        }

        props.onFilterChanged(columnDef.tableData.id, val);
      }}
    />
  );

  const renderDefaultFilter = (columnDef: any) => {
    const localization = getLocalizationData();
    const FilterIcon = props.icons.Filter;
    return (
      <TextField
        style={columnDef.type === "numeric" ? { float: "right" } : {}}
        type={columnDef.type === "numeric" ? "number" : "search"}
        value={columnDef.tableData.filterValue || ""}
        placeholder={getLocalizedFilterPlaceHolder(columnDef)}
        onChange={(event) => {
          props.onFilterChanged(columnDef.tableData.id, event.target.value);
        }}
        inputProps={{ "aria-label": `filter data by ${columnDef.title}` }}
        InputProps={
          props.hideFilterIcons || columnDef.hideFilterIcon
            ? undefined
            : {
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title={localization.filterTooltip}>
                      <FilterIcon />
                    </Tooltip>
                  </InputAdornment>
                ),
              }
        }
      />
    );
  };

  const renderDateTypeFilter = (columnDef: any) => {
    const onDateInputChange = (date: any) =>
      props.onFilterChanged(columnDef.tableData.id, date);
    const pickerProps:any = {
      value: columnDef.tableData.filterValue || null,
      onChange: onDateInputChange,
      placeholder: getLocalizedFilterPlaceHolder(columnDef),
      clearable: true,
    };

    let dateInputElement: any = null;
    if (columnDef.type === "date") {
      dateInputElement = (
        <DatePicker
          {...pickerProps}
          renderInput={(pickerProps) => <TextField  />}
          // renderInput={(pickerProps) => <TextField {...pickerProps} />}
        />
      );
    } else if (columnDef.type === "datetime") {
      dateInputElement = (
        <DateTimePicker
          {...pickerProps}
          renderInput={(pickerProps) => <TextField  />}
          // renderInput={(pickerProps) => <TextField {...pickerProps} />}
        />
      );
    } else if (columnDef.type === "time") {
      dateInputElement = (
        <TimePicker
          {...pickerProps}
          renderInput={(pickerProps) => <TextField  />}
          // renderInput={(pickerProps) => <TextField {...pickerProps} />}
        />
      );
    }
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        utils={DateFnsUtils}
        locale={props.localization.dateTimePickerLocalization}
      >
        {dateInputElement}
      </LocalizationProvider>
    );
  };

  const getComponentForColumn = (columnDef: any) => {
    if (columnDef.filtering === false) {
      return null;
    }

    if (columnDef.field || columnDef.customFilterAndSearch) {
      if (columnDef.filterComponent) {
        return renderFilterComponent(columnDef);
      } else if (columnDef.lookup) {
        return <LookupFilter columnDef={columnDef} />;
      } else if (columnDef.type === "boolean") {
        return renderBooleanFilter(columnDef);
      } else if (["date", "datetime", "time"].includes(columnDef.type)) {
        return renderDateTypeFilter(columnDef);
      } else {
        return renderDefaultFilter(columnDef);
      }
    }

    return null;
  };

  const render = () => {
    const columns = props.columns
      .filter(
        (columnDef: any) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort(
        (a: any, b: any) => a.tableData.columnOrder - b.tableData.columnOrder
      )
      .map((columnDef: any) => (
        <TableCell
          key={columnDef.tableData.id}
          style={{
            ...props.filterCellStyle,
            ...columnDef.filterCellStyle,
          }}
        >
          {getComponentForColumn(columnDef)}
        </TableCell>
      ));

    if (props.selection) {
      columns.splice(
        0,
        0,
        <TableCell padding="none" key="key-selection-column" />
      );
    }

    if (props.hasActions) {
      if (props.actionsColumnIndex === -1) {
        columns.push(<TableCell key="key-action-column" />);
      } else {
        let endPos = 0;
        if (props.selection) {
          endPos = 1;
        }
        columns.splice(
          props.actionsColumnIndex + endPos,
          0,
          <TableCell key="key-action-column" />
        );
      }
    }

    if (props.hasDetailPanel) {
      const alignment = props.detailPanelColumnAlignment;
      const index = alignment === "left" ? 0 : columns.length;
      columns.splice(
        index,
        0,
        <TableCell padding="none" key="key-detail-panel-column" />
      );
    }

    if (props.isTreeData) {
      columns.splice(
        0,
        0,
        <TableCell padding="none" key={"key-tree-data-filter"} />
      );
    }

    props.columns
      .filter((columnDef: any) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef: any) => {
        columns.splice(
          0,
          0,
          <TableCell
            padding="checkbox"
            key={"key-group-filter" + columnDef.tableData.id}
          />
        );
      });

    return (
      <TableRow style={{ height: 10, ...props.filterRowStyle }}>
        {columns}
      </TableRow>
    );
  };

  return <>{render()}</>;
}

const defaultProps = {
  columns: [],
  detailPanelColumnAlignment: "left",
  selection: false,
  hasActions: false,
  localization: {
    filterTooltip: "Filter",
  },
  hideFilterIcons: false,
};

// MTableFilterRow.propTypes = {
//   columns: PropTypes.array.isRequired,
//   hasDetailPanel: PropTypes.bool.isRequired,
//   detailPanelColumnAlignment: PropTypes.string,
//   isTreeData: PropTypes.bool.isRequired,
//   onFilterChanged: PropTypes.func.isRequired,
//   filterCellStyle: PropTypes.object,
//   filterRowStyle: PropTypes.object,
//   selection: PropTypes.bool.isRequired,
//   actionsColumnIndex: PropTypes.number,
//   hasActions: PropTypes.bool,
//   localization: PropTypes.object,
//   hideFilterIcons: PropTypes.bool,
// };

//export default MTableFilterRow;
