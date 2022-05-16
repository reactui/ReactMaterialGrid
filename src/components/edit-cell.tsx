/* eslint-disable no-unused-vars */
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade } from "@material-ui/core/styles/colorManipulator";
import withTheme from "@material-ui/core/styles/withTheme";
import { useState } from "react";
// import { MTable } from "../index-metarial-table";

interface ITableEditCellProps {
  cellEditable: any;
  columnDef: any;
  components: any;
  errorState: object | boolean;
  icons: any;
  localization: any;
  onCellEditFinished: Function;
  rowData: [];
  size: number;
}

interface ITableEditCellState {
  isLoading: boolean;
  theValue: any;
}
function MTableEditCell({
  cellEditable,
  columnDef,
  components,
  errorState,
  icons,
  localization,
  onCellEditFinished,
  rowData,
  size,
}: ITableEditCellProps) {
  const [state, setState] = useState<ITableEditCellState>({
    isLoading: false,
    theValue: rowData[columnDef.field],
  });

  const getStyle = () => {
    let cellStyle = {
      boxShadow: "2px 0px 15px rgba(125,147,178,.25)",
      color: "inherit",
      width: columnDef.tableData.width,
      boxSizing: "border-box",
      fontSize: "inherit",
      fontFamily: "inherit",
      fontWeight: "inherit",
      padding: "0 16px",
    };

    if (typeof columnDef.cellStyle === "function") {
      cellStyle = {
        ...cellStyle,
        ...columnDef.cellStyle(state.theValue, rowData),
      };
    } else {
      cellStyle = { ...cellStyle, ...columnDef.cellStyle };
    }

    if (typeof cellEditable.cellStyle === "function") {
      cellStyle = {
        ...cellStyle,
        ...cellEditable.cellStyle(state.theValue, rowData, columnDef),
      };
    } else {
      cellStyle = { ...cellStyle, ...cellEditable.cellStyle };
    }

    return cellStyle;
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      onApprove();
    } else if (e.keyCode === 27) {
      onCancel();
    }
  };

  const onApprove = () => {
    setState({ ...state, isLoading: true });
    cellEditable
      .onCellEditApproved(
        state.theValue, // newValue
        rowData[columnDef.field], // oldValue
        rowData, // rowData with old value
        columnDef // columnDef
      )
      .then(() => {
        setState({ ...state, isLoading: false });
        onCellEditFinished(rowData, columnDef);
      })
      .catch((error: any) => {
        setState({ ...state, isLoading: false });
      });
  };

  const onCancel = () => {
    onCellEditFinished(rowData, columnDef);
  };

  const renderActions = () => {
    if (state.isLoading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", width: 60 }}>
          <CircularProgress size={20} />
        </div>
      );
    }

    const actions = [
      {
        icon: icons.Check,
        tooltip: localization.saveTooltip,
        onClick: onApprove,
        disabled: state.isLoading,
      },
      {
        icon: icons.Clear,
        tooltip: localization.cancelTooltip,
        onClick: onCancel,
        disabled: state.isLoading,
      },
    ];

    return (
      <components.Actions
        actions={actions}
        components={components}
        size="small"
      />
    );
  };

  return (
    <TableCell /*size={size} style={getStyle()} */ padding="none">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, marginRight: 4 }}>
          <components.EditField
            columnDef={columnDef}
            value={state.theValue}
            onChange={(newValue: any) =>
              setState({ ...state, theValue: newValue })
            }
            onKeyDown={handleKeyDown}
            disabled={state.isLoading}
            autoFocus
          />
        </div>
        {renderActions()}
      </div>
    </TableCell>
  );
}

// MTableEditCell.defaultProps = {
//   columnDef: {},
// };

// MTableEditCell.propTypes = {
//   cellEditable: PropTypes.object.isRequired,
//   columnDef: PropTypes.object.isRequired,
//   components: PropTypes.object.isRequired,
//   errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   icons: PropTypes.object.isRequired,
//   localization: PropTypes.object.isRequired,
//   onCellEditFinished: PropTypes.func.isRequired,
//   rowData: PropTypes.object.isRequired,
//   size: PropTypes.string,
// };

// @ts-ignore
export default withTheme(MTableEditCell);
