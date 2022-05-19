import {
  Icon,
  IconButton,
  Tooltip,
  TableRow,
  TableCell,
  Checkbox,
} from "@mui/material";
import * as React from "react";
import * as CommonValues from "../utils/common-values"

const MTableBodyRow = (props) => {
  const {
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
    ...rowProps
  } = props;

  const renderColumns = () => {
    const size = CommonValues.elementSize(props);
    const mapArr = columns
      .filter(
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index) => {
        const value = getFieldValue(data, columnDef);

        if (
          data.tableData.editCellList &&
          data.tableData.editCellList.find(
            (c) => c.tableData.id === columnDef.tableData.id
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

  const rotateIconStyle = (isOpen) => ({
    transform: isOpen ? "rotate(90deg)" : "none",
  });

  const renderDetailPanelColumn = () => {
    const size = CommonValues.elementSize(props);
    const CustomIcon = ({ icon, iconProps }) =>
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
            {detailPanel.map((panel, index) => {
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

  const getStyle = (index, level) => {
    let style = {
      transition: "all ease 300ms",
      cursor: "",
      opacity: 1,
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
      style.opacity = style.opacity > 0 ? style.opacity : 0.2;
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
      actions.filter((a) => a.position === "row" || typeof a === "function")
        .length > 0
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
      .filter((columnDef) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef) => {
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
          {...rowProps}
          hover={onRowClick ? true : false}
          style={getStyle(index, level)}
          onClick={(event) => {
            onRowClick &&
              onRowClick(event, data, (panelIndex) => {
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
          data.tableData.childRows.map((data, index) => {
            if (data.tableData.editing) {
              return (
                <components.EditRow
                  columns={columns.filter((columnDef) => {
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
};

export default MTableBodyRow;
