/* eslint-disable no-unused-vars */
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import * as React from "react";
import * as CommonValues from "../utils/common-values";

interface TableBodyRowsProps {
  actions: [];
  icons: any;
  index: number;
  data: any; // object,
  datailPanel: Function | [object | Function];
  hasAnyEditingRow: boolean;
  options: any; // object,
  onRowSelected: Function;
  path: [number];
  treeDataMaxLevel: number;
  getFieldValue: Function;
  columns: [];
  onToggleDetailPanel: Function;
  onRowClick: Function;
  onEditingApproved: Function;
  onEditingCanceled: Function;
  errorState: Object | boolean;
  components: any;
  detailPanel: any;
  isTreeData: boolean;
  onTreeExpandChanged: Function;
  localization: any;
  cellEditable: boolean;
  onCellEditStarted: Function;
  onCellEditFinished: Function;
  scrollWidth: number;
  level: number;
}

export default function MTableBodyRow({
  icons,
  data,
  columns,
  components,
  detailPanel,
  getFieldValue,
  isTreeData,
  onRowClick,
  onRowSelected,
  onTreeExpandChanged,
  onToggleDetailPanel,
  onEditingCanceled,
  onEditingApproved,
  options,
  hasAnyEditingRow,
  treeDataMaxLevel,
  localization,
  actions,
  errorState,
  cellEditable,
  onCellEditStarted,
  onCellEditFinished,
  scrollWidth,
  level,
  index,
  path,
  ...props
}: TableBodyRowsProps) {
  //const MTableBodyRow = props => {

  const renderColumns = () => {
    const size = CommonValues.elementSize(props);
    const mapArr = columns
      .filter(
        (columnDef: any) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort(
        (a: any, b: any) => a.tableData.columnOrder - b.tableData.columnOrder
      )
      .map((columnDef: any, index) => {
        const value = getFieldValue(data, columnDef);

        if (
          data.tableData.editCellList &&
          data.tableData.editCellList.find(
            (c: any) => c.tableData.id === columnDef.tableData.id
          )
        ) {
          return (
            <components.EditCell
              components={components}
              icons={icons}
              localization={localization}
              columnDef={columnDef}
              size={size}
              key={"cell-" + data.tableData.id + "-" + columnDef.tableData.id}
              rowData={data}
              cellEditable={cellEditable}
              onCellEditFinished={onCellEditFinished}
              scrollWidth={scrollWidth}
            />
          );
        } else {
          return (
            <components.Cell
              size={size}
              errorState={errorState}
              icons={icons}
              columnDef={{
                cellStyle: options.cellStyle,
                ...columnDef,
              }}
              value={value}
              key={"cell-" + data.tableData.id + "-" + columnDef.tableData.id}
              rowData={data}
              cellEditable={columnDef.editable !== "never" && !!cellEditable}
              onCellEditStarted={onCellEditStarted}
              scrollWidth={scrollWidth}
            />
          );
        }
      });
    return mapArr;
  };

  const renderActions = () => {
    const size = CommonValues.elementSize(props);
    const actions = CommonValues.rowActions(props);
    const width = actions.length * CommonValues.baseIconSize(props);
    return (
      <TableCell
        size={size}
        padding="none"
        key="key-actions-column"
        style={{
          width: width,
          padding: "0px 5px",
          boxSizing: "border-box",
          ...options.actionsCellStyle,
        }}
      >
        <div style={{ display: "flex" }}>
          <components.Actions
            data={data}
            actions={actions}
            components={components}
            size={size}
            disabled={hasAnyEditingRow}
          />
        </div>
      </TableCell>
    );
  };

  const renderSelectionColumn = () => {
    let checkboxProps = options.selectionProps || {};
    if (typeof checkboxProps === "function") {
      checkboxProps = checkboxProps(data);
    }

    const size = CommonValues.elementSize(props);
    const selectionWidth = CommonValues.selectionMaxWidth(
      props,
      treeDataMaxLevel
    );

    const styles =
      size === "medium"
        ? {
            marginLeft: level * 9,
          }
        : {
            padding: "4px",
            marginLeft: 5 + level * 9,
          };

    return (
      <TableCell
        size={size}
        padding="none"
        key="key-selection-column"
        style={{ width: selectionWidth }}
      >
        <Checkbox
          size={size}
          checked={data.tableData.checked === true}
          onClick={(e) => e.stopPropagation()}
          value={data.tableData.id.toString()}
          onChange={(event) => onRowSelected(event, path, data)}
          style={styles}
          {...checkboxProps}
        />
      </TableCell>
    );
  };

  const rotateIconStyle = (isOpen: boolean) => ({
    transform: isOpen ? "rotate(90deg)" : "none",
  });

  const renderDetailPanelColumn = () => {
    const size = CommonValues.elementSize(props);
    const CustomIcon = ({ icon, iconProps }: { icon: any; iconProps: any }) =>
      typeof icon === "string" ? (
        <Icon {...iconProps}>{icon}</Icon>
      ) : (
        React.createElement(icon, { ...iconProps })
      );

    if (typeof detailPanel == "function") {
      return (
        <TableCell
          size={size}
          padding="none"
          key="key-detail-panel-column"
          style={{
            width: 42,
            textAlign: "center",
            ...options.detailPanelColumnStyle,
          }}
        >
          <IconButton
            size={size}
            style={{
              transition: "all ease 200ms",
              ...rotateIconStyle(data.tableData.showDetailPanel),
            }}
            onClick={(event) => {
              onToggleDetailPanel(path, detailPanel);
              event.stopPropagation();
            }}
          >
            <icons.DetailPanel />
          </IconButton>
        </TableCell>
      );
    } else {
      return (
        <TableCell size={size} padding="none" key="key-detail-panel-column">
          <div
            style={{
              width: 42 * detailPanel.length,
              textAlign: "center",
              display: "flex",
              ...options.detailPanelColumnStyle,
            }}
          >
            {detailPanel.map((panel: any, index: number) => {
              if (typeof panel === "function") {
                panel = panel(data);
              }

              const isOpen =
                (data.tableData.showDetailPanel || "").toString() ===
                panel.render.toString();

              let iconButton = <icons.DetailPanel />;
              let animation = true;
              if (isOpen) {
                if (panel.openIcon) {
                  iconButton = (
                    <CustomIcon
                      icon={panel.openIcon}
                      iconProps={panel.iconProps}
                    />
                  );
                  animation = false;
                } else if (panel.icon) {
                  iconButton = (
                    <CustomIcon icon={panel.icon} iconProps={panel.iconProps} />
                  );
                }
              } else if (panel.icon) {
                iconButton = (
                  <CustomIcon icon={panel.icon} iconProps={panel.iconProps} />
                );
                animation = false;
              }

              iconButton = (
                <IconButton
                  size={size}
                  key={"key-detail-panel-" + index}
                  style={{
                    transition: "all ease 200ms",
                    ...rotateIconStyle(animation && isOpen),
                  }}
                  disabled={panel.disabled}
                  onClick={(event) => {
                    onToggleDetailPanel(path, panel.render);
                    event.stopPropagation();
                  }}
                >
                  {iconButton}
                </IconButton>
              );

              if (panel.tooltip) {
                iconButton = (
                  <Tooltip
                    key={"key-detail-panel-" + index}
                    title={panel.tooltip}
                  >
                    {iconButton}
                  </Tooltip>
                );
              }

              return iconButton;
            })}
          </div>
        </TableCell>
      );
    }
  };

  const renderTreeDataColumn = () => {
    const size = CommonValues.elementSize(props);
    if (data.tableData.childRows && data.tableData.childRows.length > 0) {
      return (
        <TableCell
          size={size}
          padding="none"
          key={"key-tree-data-column"}
          style={{ width: 48 + 9 * (treeDataMaxLevel - 2) }}
        >
          <IconButton
            size={size}
            style={{
              transition: "all ease 200ms",
              marginLeft: level * 9,
              ...rotateIconStyle(data.tableData.isTreeExpanded),
            }}
            onClick={(event) => {
              onTreeExpandChanged(path, data);
              event.stopPropagation();
            }}
          >
            <icons.DetailPanel />
          </IconButton>
        </TableCell>
      );
    } else {
      return <TableCell padding="none" key={"key-tree-data-column"} />;
    }
  };

  const getStyle = (index: number, level: number) => {
    let style: any = {
      transition: "all ease 300ms",
    };

    if (typeof options.rowStyle === "function") {
      style = {
        ...style,
        ...options.rowStyle(data, index, level, hasAnyEditingRow),
      };
    } else if (options.rowStyle) {
      style = {
        ...style,
        ...options.rowStyle,
      };
    }

    if (onRowClick) {
      style.cursor = "pointer";
    }

    if (hasAnyEditingRow) {
      style.opacity = style.opacity ? style.opacity : 0.2;
    }

    return style;
  };

  const render = () => {
    const size = CommonValues.elementSize(props);
    const renderColumnsRef = renderColumns();
    if (options.selection) {
      renderColumnsRef.splice(0, 0, renderSelectionColumn());
    }
    if (
      actions &&
      actions.filter(
        (a: any) => a.position === "row" || typeof a === "function"
      ).length > 0
    ) {
      if (options.actionsColumnIndex === -1) {
        renderColumnsRef.push(renderActions());
      } else if (options.actionsColumnIndex >= 0) {
        let endPos = 0;
        if (options.selection) {
          endPos = 1;
        }
        renderColumnsRef.splice(
          options.actionsColumnIndex + endPos,
          0,
          renderActions()
        );
      }
    }

    // Then we add detail panel icon
    if (detailPanel) {
      if (options.detailPanelColumnAlignment === "right") {
        renderColumnsRef.push(renderDetailPanelColumn());
      } else {
        renderColumnsRef.splice(0, 0, renderDetailPanelColumn());
      }
    }

    // Lastly we add tree data icon
    if (isTreeData) {
      renderColumnsRef.splice(0, 0, renderTreeDataColumn());
    }

    columns
      .filter((columnDef: any) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef: any) => {
        renderColumnsRef.splice(
          0,
          0,
          <TableCell
            size={size}
            padding="none"
            key={"key-group-cell" + columnDef.tableData.id}
          />
        );
      });

    return (
      <>
        <TableRow
          selected={hasAnyEditingRow}
          {...props}
          hover={onRowClick ? true : false}
          style={getStyle(index, level)}
          onClick={(event) => {
            onRowClick &&
              onRowClick(event, data, (panelIndex: number) => {
                let panel = detailPanel;
                if (Array.isArray(panel)) {
                  panel = panel[panelIndex || 0];
                  if (typeof panel === "function") {
                    panel = panel(data);
                  }
                  panel = panel.render;
                }
                onToggleDetailPanel(path, panel);
              });
          }}
        >
          {renderColumnsRef}
        </TableRow>
        {data.tableData && data.tableData.showDetailPanel && (
          <TableRow
          // selected={index % 2 === 0}
          >
            <TableCell
              size={size}
              colSpan={renderColumnsRef.length}
              padding="none"
            >
              {data.tableData.showDetailPanel(data)}
            </TableCell>
          </TableRow>
        )}
        {data.tableData.childRows &&
          data.tableData.isTreeExpanded &&
          data.tableData.childRows.map((data: any, index: number) => {
            if (data.tableData.editing) {
              return (
                <components.EditRow
                  columns={columns.filter((columnDef: any) => {
                    return !columnDef.hidden;
                  })}
                  components={components}
                  data={data}
                  icons={icons}
                  localization={localization}
                  getFieldValue={getFieldValue}
                  key={index}
                  mode={data.tableData.editing}
                  options={options}
                  isTreeData={isTreeData}
                  detailPanel={detailPanel}
                  onEditingCanceled={onEditingCanceled}
                  onEditingApproved={onEditingApproved}
                  errorState={errorState}
                />
              );
            } else {
              return (
                <components.Row
                  {...props}
                  data={data}
                  index={index}
                  key={index}
                  level={level + 1}
                  path={[...path, index]}
                  onEditingCanceled={onEditingCanceled}
                  onEditingApproved={onEditingApproved}
                  hasAnyEditingRow={hasAnyEditingRow}
                  treeDataMaxLevel={treeDataMaxLevel}
                  errorState={errorState}
                  cellEditable={cellEditable}
                  onCellEditStarted={onCellEditStarted}
                  onCellEditFinished={onCellEditFinished}
                />
              );
            }
          })}
      </>
    );
  };

  return <>{render()}</>;
}

// export default MTableBodyRow;

// MTableBodyRow.defaultProps = {
//   actions: [],
//   index: 0,
//   data: {},
//   options: {},
//   path: [],
// };

// MTableBodyRow.propTypes = {
//   actions: PropTypes.array,
//   icons: PropTypes.any.isRequired,
//   index: PropTypes.number.isRequired,
//   data: PropTypes.object.isRequired,
//   detailPanel: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func])),
//   ]),
//   hasAnyEditingRow: PropTypes.bool,
//   options: PropTypes.object.isRequired,
//   onRowSelected: PropTypes.func,
//   path: PropTypes.arrayOf(PropTypes.number),
//   treeDataMaxLevel: PropTypes.number,
//   getFieldValue: PropTypes.func.isRequired,
//   columns: PropTypes.array,
//   onToggleDetailPanel: PropTypes.func.isRequired,
//   onRowClick: PropTypes.func,
//   onEditingApproved: PropTypes.func,
//   onEditingCanceled: PropTypes.func,
//   errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
// };
