import {
  Checkbox,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import classNames from "classnames";
import { withStyles } from "@mui/styles";

// @ts-ignore
import { CsvBuilder } from "filefy";

import PropTypes, { oneOf } from "prop-types";
import "jspdf-autotable";
import * as React from "react";
import { useState } from "react";
const jsPDF = typeof window !== "undefined" ? require("jspdf").jsPDF : null;

function MTableToolbar(props: any) {
  const [state, setState] = useState({
    columnsButtonAnchorEl: null,
    exportButtonAnchorEl: null,
    searchText: props.searchText,
  });

  const onSearchChange = (searchText: any) => {
    props.dataManager.changeSearchText(searchText);
    setState({ ...state, searchText });
  };

  const getTableData = () => {
    const columns = props.columns
      .filter(
        (columnDef: any) =>
          (!columnDef.hidden || columnDef.export === true) &&
          columnDef.export !== false &&
          columnDef.field
      )
      .sort((a: any, b: any) =>
        a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1
      );
    const data = (props.exportAllData ? props.data : props.renderData).map(
      (rowData: any) =>
        columns.map((columnDef: any) => props.getFieldValue(rowData, columnDef))
    );

    return [columns, data];
  };

  // const defaultExportCsv = () => {
  //   const [columns, data] = getTableData();

  //   let fileName = props.title || "data";
  //   if (props.exportFileName) {
  //     fileName =
  //       typeof props.exportFileName === "function"
  //         ? props.exportFileName()
  //         : props.exportFileName;
  //   }

  //   const builder = new CsvBuilder(fileName + ".csv");
  //   builder
  //     .setDelimeter(props.exportDelimiter)
  //     .setColumns(columns.map((columnDef:any) => columnDef.title))
  //     .addRows(data)
  //     .exportFile();
  // };

  const defaultExportPdf = () => {
    if (jsPDF !== null) {
      const [columns, data] = props.getTableData();

      let content = {
        startY: 50,
        head: [columns.map((columnDef: any) => columnDef.title)],
        body: data,
      };

      const unit = "pt";
      const size = "A4";
      const orientation = "landscape";

      const doc = new jsPDF(orientation, unit, size);
      doc.setFontSize(15);
      doc.text(props.exportFileName || props.title, 40, 40);
      doc.autoTable(content);
      doc.save((props.exportFileName || props.title || "data") + ".pdf");
    }
  };

  const exportCsv = () => {
    if (props.exportCsv) {
      props.exportCsv(props.columns, props.data);
    } else {
      //defaultExportCsv();
    }
    setState({ ...state, exportButtonAnchorEl: null });
  };

  const exportPdf = () => {
    if (props.exportPdf) {
      props.exportPdf(props.columns, props.data);
    } else {
      defaultExportPdf();
    }
    setState({ ...state, exportButtonAnchorEl: null });
  };

  const renderSearch = () => {
    const localization = {
      ...defaultProps.localization,
      ...props.localization,
    };

    if (props.search) {
      return (
        <TextField
          autoFocus={props.searchAutoFocus}
          className={
            props.searchFieldAlignment === "left" && props.showTitle === false
              ? null
              : props.classes.searchField
          }
          value={state.searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={localization.searchPlaceholder}
          variant={props.searchFieldVariant}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title={localization.searchTooltip}>
                  <props.icons.Search fontSize="small" />
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={!state.searchText}
                  onClick={() => onSearchChange("")}
                  aria-label={localization.clearSearchAriaLabel}
                >
                  <props.icons.ResetSearch
                    fontSize="small"
                    aria-label="clear"
                  />
                </IconButton>
              </InputAdornment>
            ),
            style: props.searchFieldStyle,
            inputProps: {
              "aria-label": localization.searchAriaLabel,
            },
          }}
        />
      );
    } else {
      return null;
    }
  };

  const renderDefaultActions = () => {
    const localization = {
      ...defaultProps.localization,
      ...props.localization,
    };
    const { classes } = props;

    return (
      <div>
        {props.columnsButton && (
          <span>
            <Tooltip title={localization.showColumnsTitle}>
              <IconButton
                color="inherit"
                onClick={(event: any) =>
                  setState({
                    ...state,
                    columnsButtonAnchorEl: event.currentTarget,
                  })
                }
                aria-label={localization.showColumnsAriaLabel}
              >
                <props.icons.ViewColumn />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={state.columnsButtonAnchorEl}
              open={Boolean(state.columnsButtonAnchorEl)}
              onClose={() =>
                setState({ ...state, columnsButtonAnchorEl: null })
              }
            >
              <MenuItem
                key={"text"}
                disabled
                style={{
                  opacity: 1,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {localization.addRemoveColumns}
              </MenuItem>
              {props.columns.map((col: any) => {
                if (!col.hidden || col.hiddenByColumnsButton) {
                  return (
                    <li key={col.tableData.id}>
                      <MenuItem
                        className={classes.formControlLabel}
                        component="label"
                        htmlFor={`column-toggle-${col.tableData.id}`}
                        disabled={col.removable === false}
                      >
                        <Checkbox
                          checked={!col.hidden}
                          id={`column-toggle-${col.tableData.id}`}
                          onChange={() =>
                            props.onColumnsChanged(col, !col.hidden)
                          }
                        />
                        <span>{col.title}</span>
                      </MenuItem>
                    </li>
                  );
                }
                return null;
              })}
            </Menu>
          </span>
        )}
        {props.exportButton && (
          <span>
            <Tooltip title={localization.exportTitle}>
              <IconButton
                color="inherit"
                onClick={(event: any) =>
                  setState({
                    ...state,
                    exportButtonAnchorEl: event.currentTarget,
                  })
                }
                aria-label={localization.exportAriaLabel}
              >
                <props.icons.Export />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={state.exportButtonAnchorEl}
              open={Boolean(state.exportButtonAnchorEl)}
              onClose={() => setState({ ...state, exportButtonAnchorEl: null })}
            >
              {(props.exportButton === true || props.exportButton.csv) && (
                <MenuItem key="export-csv" onClick={exportCsv}>
                  {localization.exportCSVName}
                </MenuItem>
              )}
              {(props.exportButton === true || props.exportButton.pdf) && (
                <MenuItem key="export-pdf" onClick={exportPdf}>
                  {localization.exportPDFName}
                </MenuItem>
              )}
            </Menu>
          </span>
        )}
        <span>
          <props.components.Actions
            actions={
              props.actions &&
              props.actions.filter((a: any) => a.position === "toolbar")
            }
            components={props.components}
          />
        </span>
      </div>
    );
  };

  const renderSelectedActions = () => {
    return (
      <React.Fragment>
        <props.components.Actions
          actions={props.actions.filter(
            (a: any) => a.position === "toolbarOnSelect"
          )}
          data={props.selectedRows}
          components={props.components}
        />
      </React.Fragment>
    );
  };

  const renderActions = () => {
    const { classes } = props;

    return (
      <div className={classes.actions}>
        <div>
          {props.selectedRows && props.selectedRows.length > 0
            ? renderSelectedActions()
            : renderDefaultActions()}
        </div>
      </div>
    );
  };

  const renderToolbarTitle = (title: any) => {
    const { classes } = props;
    const toolBarTitle =
      typeof title === "string" ? (
        <Typography
          variant="h6"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
      ) : (
        title
      );

    return <div className={classes.title}>{toolBarTitle}</div>;
  };

  const render = () => {
    const { classes } = props;
    const localization = {
      ...defaultProps.localization,
      ...props.localization,
    };
    const title =
      props.showTextRowsSelected &&
      props.selectedRows &&
      props.selectedRows.length > 0
        ? typeof localization.nRowsSelected === "function"
          ? localization.nRowsSelected(props.selectedRows.length)
          : localization.nRowsSelected.replace("{0}", props.selectedRows.length)
        : props.showTitle
        ? props.title
        : null;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]:
            props.showTextRowsSelected &&
            props.selectedRows &&
            props.selectedRows.length > 0,
        })}
      >
        {title && renderToolbarTitle(title)}
        {props.searchFieldAlignment === "left" && renderSearch()}
        {props.toolbarButtonAlignment === "left" && renderActions()}
        <div className={classes.spacer} />
        {props.searchFieldAlignment === "right" && renderSearch()}
        {props.toolbarButtonAlignment === "right" && renderActions()}
      </Toolbar>
    );
  };

  return <>{render()}</>;
}

const defaultProps = {
  actions: [],
  columns: [],
  columnsButton: false,
  localization: {
    addRemoveColumns: "Add or remove columns",
    nRowsSelected: "{0} row(s) selected",
    showColumnsTitle: "Show Columns",
    showColumnsAriaLabel: "Show Columns",
    exportTitle: "Export",
    exportAriaLabel: "Export",
    exportCSVName: "Export as CSV",
    exportPDFName: "Export as PDF",
    searchTooltip: "Search",
    searchPlaceholder: "Search",
    searchAriaLabel: "Search",
    clearSearchAriaLabel: "Clear Search",
  },
  search: true,
  showTitle: true,
  searchText: "",
  showTextRowsSelected: true,
  toolbarButtonAlignment: "right",
  searchAutoFocus: false,
  searchFieldAlignment: "right",
  searchFieldVariant: "standard",
  selectedRows: [],
  title: "No Title!",
};

MTableToolbar.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.array,
  columnsButton: PropTypes.bool,
  components: PropTypes.object.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  localization: PropTypes.object.isRequired,
  onColumnsChanged: PropTypes.func.isRequired,
  dataManager: PropTypes.object.isRequired,
  searchText: PropTypes.string,
  onSearchChanged: PropTypes.func.isRequired,
  search: PropTypes.bool.isRequired,
  searchFieldStyle: PropTypes.object,
  searchFieldVariant: PropTypes.string,
  selectedRows: PropTypes.array,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  showTitle: PropTypes.bool.isRequired,
  showTextRowsSelected: PropTypes.bool.isRequired,
  toolbarButtonAlignment: PropTypes.string.isRequired,
  searchFieldAlignment: PropTypes.string.isRequired,
  renderData: PropTypes.array,
  data: PropTypes.array,
  exportAllData: PropTypes.bool,
  exportButton: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({ csv: PropTypes.bool, pdf: PropTypes.bool }),
  ]),
  exportDelimiter: PropTypes.string,
  exportFileName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  exportCsv: PropTypes.func,
  exportPdf: PropTypes.func,
  classes: PropTypes.object,
  searchAutoFocus: PropTypes.bool,
};

export const styles = (theme: any) => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: "1 1 10%",
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    overflow: "hidden",
  },
  searchField: {
    minWidth: 150,
    paddingLeft: theme.spacing(2),
  },
  formControlLabel: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
});

// @ts-ignore
export default withStyles(styles)(MTableToolbar);
