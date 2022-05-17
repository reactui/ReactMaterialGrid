import { TableCell, TableRow, Typography }  from "@mui/material";
import { useState } from "react";
import { byString, setByString } from "../utils";
import * as CommonValues from "../utils/common-values";
interface ITableEditRow {
  data: any;
  columnDef: any;
  columns: [];
  level: number;
  mode: string;
  isTreeData: boolean;

  components: any;
  getFieldValue: any;
  icons: any;
  localization: any;
  options: any;
  detailPanel: any;

  onBulkEditRowChange: Function;
  onBulkEditRowChanged: any;
  onEditingApproved: Function;
  onEditingCanceled: Function;
}

export default function MTableEditRow(props: ITableEditRow) {
  const createRowData = () => {
    return props.columns
      .filter((column: any) => "initialEditValue" in column && column.field)
      .reduce((prev: any, column: any) => {
        prev[column.field] = column.initialEditValue;
        return prev;
      }, {});
  };

  const [state, setState] = useState({
    data: props.data ? JSON.parse(JSON.stringify(props.data)) : createRowData(),
  });

  const renderColumns = () => {
    const size = CommonValues.elementSize(props);
    const mapArr = props.columns
      .filter(
        (columnDef: any) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort(
        (a: any, b: any) => a.tableData.columnOrder - b.tableData.columnOrder
      )
      .map((columnDef: any, index) => {
        const value =
          typeof state.data[columnDef.field] !== "undefined"
            ? state.data[columnDef.field]
            : byString(state.data, columnDef.field);
        const getCellStyle = (columnDef: any, value: any) => {
          let cellStyle: any = {
            color: "inherit",
          };
          if (typeof columnDef.cellStyle === "function") {
            cellStyle = {
              ...cellStyle,
              ...columnDef.cellStyle(value, props.data),
            };
          } else {
            cellStyle = { ...cellStyle, ...columnDef.cellStyle };
          }
          if (columnDef.disableClick) {
            cellStyle.cursor = "default";
          }

          return { ...cellStyle };
        };

        const style: any = {};
        if (index === 0) {
          style.paddingLeft = 24 + props.level * 20;
        }

        let allowEditing = false;

        if (columnDef.editable === undefined) {
          allowEditing = true;
        }
        if (columnDef.editable === "always") {
          allowEditing = true;
        }
        if (columnDef.editable === "onAdd" && props.mode === "add") {
          allowEditing = true;
        }
        if (columnDef.editable === "onUpdate" && props.mode === "update") {
          allowEditing = true;
        }
        if (typeof columnDef.editable === "function") {
          allowEditing = columnDef.editable(columnDef, props.data);
        }
        if (!columnDef.field || !allowEditing) {
          const readonlyValue = props.getFieldValue(state.data, columnDef);
          return (
            <props.components.Cell
              size={size}
              icons={props.icons}
              columnDef={columnDef}
              value={readonlyValue}
              key={columnDef.tableData.id}
              rowData={props.data}
              style={getCellStyle(columnDef, value)}
            />
          );
        } else {
          const { editComponent, ...cellProps } = columnDef;
          const EditComponent = editComponent || props.components.EditField;
          let error = { isValid: true, helperText: "" };
          if (columnDef.validate) {
            const validateResponse = columnDef.validate(state.data);
            switch (typeof validateResponse) {
              case "object":
                error = { ...validateResponse };
                break;
              case "boolean":
                error = { isValid: validateResponse, helperText: "" };
                break;
              case "string":
                error = { isValid: false, helperText: validateResponse };
                break;
            }
          }
          return (
            <TableCell
              size={size}
              key={columnDef.tableData.id}
              align={
                ["numeric"].indexOf(columnDef.type) !== -1 ? "right" : "left"
              }
              style={getCellStyle(columnDef, value)}
            >
              <EditComponent
                key={columnDef.tableData.id}
                columnDef={cellProps}
                value={value}
                error={!error.isValid}
                helperText={error.helperText}
                locale={props.localization.dateTimePickerLocalization}
                rowData={state.data}
                onChange={(value: any) => {
                  const data = { ...state.data };
                  setByString(data, columnDef.field, value);
                  // data[columnDef.field] = value;
                  setState({
                    data: props.onBulkEditRowChanged ? props.data : null,
                  });
                }}
                onRowDataChange={(data: any) => {
                  setState({
                    data: props.onBulkEditRowChanged ? props.data : null,
                  });
                }}
              />
            </TableCell>
          );
        }
      });
    return mapArr;
  };

  const handleSave = () => {
    const newData = state.data;
    delete newData.tableData;
    props.onEditingApproved(props.mode, state.data, props.data);
  };

  const renderActions = () => {
    if (props.mode === "bulk") {
      return <TableCell padding="none" key="key-actions-column" />;
    }

    const size = CommonValues.elementSize(props);
    const localization = {
      ...defaultProps.localization,
      ...props.localization,
    };
    const isValid = props.columns.every((column: any) => {
      if (column.validate) {
        const response = column.validate(state.data);
        switch (typeof response) {
          case "object":
            return response.isValid;
          case "string":
            return response.length === 0;
          case "boolean":
            return response;
        }
      } else {
        return true;
      }
    });
    const actions = [
      {
        icon: props.icons.Check,
        tooltip: localization.saveTooltip,
        disabled: !isValid,
        onClick: handleSave,
      },
      {
        icon: props.icons.Clear,
        tooltip: localization.cancelTooltip,
        onClick: () => {
          props.onEditingCanceled(props.mode, props.data);
        },
      },
    ];
    return (
      <TableCell
        size={size}
        padding="none"
        key="key-actions-column"
        style={{
          width: 42 * actions.length,
          padding: "0px 5px",
          ...props.options.editCellStyle,
        }}
      >
        <div style={{ display: "flex" }}>
          <props.components.Actions
            data={props.data}
            actions={actions}
            components={props.components}
            size={size}
          />
        </div>
      </TableCell>
    );
  };

  const getStyle = () => {
    const style = {
      // boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
      borderBottom: "1px solid red",
    };

    return style;
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 && e.target.type !== "textarea") {
      handleSave();
    } else if (e.keyCode === 13 && e.target.type === "textarea" && e.shiftKey) {
      handleSave();
    } else if (e.keyCode === 27) {
      props.onEditingCanceled(props.mode, props.data);
    }
  };

  const render = () => {
    const size = CommonValues.elementSize(props);
    const localization = {
      ...defaultProps.localization,
      ...props.localization,
    };
    let columns: any;
    if (
      props.mode === "add" ||
      props.mode === "update" ||
      props.mode === "bulk"
    ) {
      columns = renderColumns();
    } else {
      const colSpan = props.columns.filter(
        (columnDef: any) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      ).length;
      columns = [
        <TableCell
          size={size}
          padding={props.options.actionsColumnIndex === 0 ? "none" : undefined}
          key="key-edit-cell"
          colSpan={colSpan}
        >
          <Typography variant="h6">{localization.deleteText}</Typography>
        </TableCell>,
      ];
    }

    if (props.options.selection) {
      columns.splice(
        0,
        0,
        <TableCell padding="none" key="key-selection-cell" />
      );
    }
    if (props.isTreeData) {
      columns.splice(
        0,
        0,
        <TableCell padding="none" key="key-tree-data-cell" />
      );
    }

    if (props.options.actionsColumnIndex === -1) {
      columns.push(renderActions());
    } else if (props.options.actionsColumnIndex >= 0) {
      let endPos = 0;
      if (props.options.selection) {
        endPos = 1;
      }
      if (props.isTreeData) {
        endPos = 1;
        if (props.options.selection) {
          columns.splice(1, 1);
        }
      }
      columns.splice(
        props.options.actionsColumnIndex + endPos,
        0,
        renderActions()
      );
    }

    // Lastly we add detail panel icon
    if (props.detailPanel) {
      const aligment = props.options.detailPanelColumnAlignment;
      const index = aligment === "left" ? 0 : columns.length;
      columns.splice(
        index,
        0,
        <TableCell padding="none" key="key-detail-panel-cell" />
      );
    }

    props.columns
      .filter((columnDef: any) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef: any) => {
        columns.splice(
          0,
          0,
          <TableCell
            padding="none"
            key={"key-group-cell" + columnDef.tableData.id}
          />
        );
      });

    return (
      <>
        <TableRow
          onKeyDown={handleKeyDown}
          //{...rowProps}
          {...props}
          style={getStyle()}
        >
          {columns}
        </TableRow>
      </>
    );
  };

  const defaultProps = {
    actions: [],
    index: 0,
    options: {},
    path: [],
    localization: {
      saveTooltip: "Save",
      cancelTooltip: "Cancel",
      deleteText: "Are you sure you want to delete this row?",
    },
    onBulkEditRowChanged: () => {},
  };
}
