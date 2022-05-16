/* eslint-disable no-unused-vars */
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import * as React from "react";

interface ITableBodyProps {
  options: any;
  columns: any;
  components: any;
  renderData: any;
  initialFormData: any;

  cellEditable: boolean;
  hasAnyEditingRow: boolean;
  hasDetailPanel: boolean;
  isTreeData: boolean;
  bulkEditOpen: boolean;
  showAddRow: boolean;
  selection: boolean;

  scrollWidth: number;
  currentPage: number;
  treeDataMaxLevel: number;
  pageSize: number;

  onEditingCanceled: Function;
  onEditingApproved: Function;
  onBulkEditRowChanged: Function;
  onRowSelected: Function;
  onToggleDetailPanel: Function;
  getFieldValue: Function;
  onRowClick: Function;
  onTreeExpandChanged: Function;
  onCellEditStarted: Function;
  onCellEditFinished: Function;
  onGroupExpandChanged: Function;
  onFilterChanged: Function;

  actions: [];
  errorState: object | boolean;
  icons: object;
  detailPanel: Function | Array<object> | Array<Function>;
  localization: any;
}

export default function MTableBody(props: ITableBodyProps) {
  const defaultProps = {
    actions: [],
    currentPage: 0,
    pageSize: 5,
    renderData: [],
    selection: false,
    localization: {
      emptyDataSourceMessage: "No records to display",
      filterRow: {},
      editRow: {},
    },
  };

  const renderEmpty = (emptyRowCount: number, renderData: any) => {
    const rowHeight = props.options.padding === "default" ? 49 : 36;
    //props.pageSize = 5;
    //props.currentPage = 0;
    const localizationResolved = {
      ...defaultProps.localization,
      ...props.localization,
    };    

    if (props.options.showEmptyDataSourceMessage && renderData.length === 0) {
      let addColumn = 0;
      
      if (props.options.selection) {
        addColumn++;
      }
      if (
        props.actions &&
        props.actions.filter(
          (a: any) => a.position === "row" || typeof a === "function"
        ).length > 0
      ) {
        addColumn++;
      }
      if (props.hasDetailPanel) {
        addColumn++;
      }
      if (props.isTreeData) {
        addColumn++;
      }
      return (
        <TableRow
          style={{
            height:
              rowHeight *
              (props.options.paging && props.options.emptyRowsWhenPaging
                ? props.pageSize
                : 1),
          }}
          key={"empty-" + 0}
        >
          <TableCell
            style={{ paddingTop: 0, paddingBottom: 0, textAlign: "center" }}
            colSpan={props.columns.reduce(
              (currentVal: any, columnDef: any) =>
                columnDef.hidden ? currentVal : currentVal + 1,
              addColumn
            )}
            key="empty-"
          >
            {localizationResolved.emptyDataSourceMessage}
          </TableCell>
        </TableRow>
      );
    } else if (props.options.emptyRowsWhenPaging) {
      console.log("emptty", emptyRowCount);
      return (
        <React.Fragment>
          {[...Array(emptyRowCount)].map((r, index) => (
            <TableRow style={{ height: rowHeight }} key={"empty-" + index} />
          ))}
          {emptyRowCount > 0 && (
            <TableRow style={{ height: 1 }} key={"empty-last1"} />
          )}
        </React.Fragment>
      );
    }

    return null;
  };

  const renderUngroupedRows = (renderData: any) => {

    console.log("Render ugnrouped rows", renderData)

    return renderData.map((data: any, index: number) => {
      if (data.tableData.editing || props.bulkEditOpen) {
        return (
          <props.components.EditRow
            columns={props.columns.filter((columnDef: any) => {
              return !columnDef.hidden;
            })}
            components={props.components}
            data={data}
            errorState={props.errorState}
            icons={props.icons}
            localization={{
              ...defaultProps.localization.editRow,
              ...props.localization.editRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            key={"row-" + data.tableData.id}
            mode={props.bulkEditOpen ? "bulk" : data.tableData.editing}
            options={props.options}
            isTreeData={props.isTreeData}
            detailPanel={props.detailPanel}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            getFieldValue={props.getFieldValue}
            onBulkEditRowChanged={props.onBulkEditRowChanged}
            scrollWidth={props.scrollWidth}
          />
        );
      } else {
        return (
          <props.components.Row
            components={props.components}
            icons={props.icons}
            data={data}
            index={index}
            errorState={props.errorState}
            key={"row-" + data.tableData.id}
            level={0}
            options={props.options}
            localization={{
              ...defaultProps.localization.editRow,
              ...props.localization.editRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            onRowSelected={props.onRowSelected}
            actions={props.actions}
            columns={props.columns}
            getFieldValue={props.getFieldValue}
            detailPanel={props.detailPanel}
            path={[index + props.pageSize * props.currentPage]}
            onToggleDetailPanel={props.onToggleDetailPanel}
            onRowClick={props.onRowClick}
            isTreeData={props.isTreeData}
            onTreeExpandChanged={props.onTreeExpandChanged}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            hasAnyEditingRow={props.hasAnyEditingRow}
            treeDataMaxLevel={props.treeDataMaxLevel}
            cellEditable={props.cellEditable}
            onCellEditStarted={props.onCellEditStarted}
            onCellEditFinished={props.onCellEditFinished}
            scrollWidth={props.scrollWidth}
          />
        );
      }
    });
  };

  const renderGroupedRows = (groups: [], renderData: []) => {
    return renderData.map((groupData: any, index: any) => (
      <props.components.GroupRow
        actions={props.actions}
        key={groupData.value == null ? "" + index : groupData.value}
        columns={props.columns}
        components={props.components}
        detailPanel={props.detailPanel}
        getFieldValue={props.getFieldValue}
        groupData={groupData}
        groups={groups}
        icons={props.icons}
        level={0}
        path={[index + props.pageSize * props.currentPage]}
        onGroupExpandChanged={props.onGroupExpandChanged}
        onRowSelected={props.onRowSelected}
        onRowClick={props.onRowClick}
        onEditingCanceled={props.onEditingCanceled}
        onEditingApproved={props.onEditingApproved}
        onToggleDetailPanel={props.onToggleDetailPanel}
        onTreeExpandChanged={props.onTreeExpandChanged}
        options={props.options}
        isTreeData={props.isTreeData}
        hasAnyEditingRow={props.hasAnyEditingRow}
        localization={{
          ...defaultProps.localization.editRow,
          ...props.localization.editRow,
          dateTimePickerLocalization:
            props.localization.dateTimePickerLocalization,
        }}
        cellEditable={props.cellEditable}
        onCellEditStarted={props.onCellEditStarted}
        onCellEditFinished={props.onCellEditFinished}
        onBulkEditRowChanged={props.onBulkEditRowChanged}
        scrollWidth={props.scrollWidth}
      />
    ));
  };

  //const render = () => {
    let renderData = props.renderData;
    const groups = props.columns
      .filter((col: any) => col.tableData.groupOrder > -1)
      .sort(
        (col1: any, col2: any) =>
          col1.tableData.groupOrder - col2.tableData.groupOrder
      );

    let emptyRowCount = 0;
    if (props.options.paging) {
      emptyRowCount = props.pageSize - renderData.length;
    }

    return (
      <TableBody>
        {props.options.filtering && (
          <props.components.FilterRow
            columns={props.columns.filter(
              (columnDef: any) => !columnDef.hidden
            )}
            icons={props.icons}
            hasActions={
              props.actions.filter(
                (a: any) => a.position === "row" || typeof a === "function"
              ).length > 0
            }
            actionsColumnIndex={props.options.actionsColumnIndex}
            onFilterChanged={props.onFilterChanged}
            selection={props.options.selection}
            localization={{
              ...defaultProps.localization.filterRow,
              ...props.localization.filterRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            hasDetailPanel={!!props.detailPanel}
            detailPanelColumnAlignment={
              props.options.detailPanelColumnAlignment
            }
            isTreeData={props.isTreeData}
            filterCellStyle={props.options.filterCellStyle}
            filterRowStyle={props.options.filterRowStyle}
            hideFilterIcons={props.options.hideFilterIcons}
            scrollWidth={props.scrollWidth}
          />
        )}
        {props.showAddRow && props.options.addRowPosition === "first" && (
          <props.components.EditRow
            columns={props.columns.filter((columnDef: any) => {
              return !columnDef.hidden;
            })}
            data={props.initialFormData}
            components={props.components}
            errorState={props.errorState}
            icons={props.icons}
            key="key-add-row"
            mode="add"
            localization={{
              ...defaultProps.localization.editRow,
              ...props.localization.editRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            options={props.options}
            isTreeData={props.isTreeData}
            detailPanel={props.detailPanel}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            getFieldValue={props.getFieldValue}
            scrollWidth={props.scrollWidth}
          />
        )}

        {groups.length > 0
          ? renderGroupedRows(groups, renderData)
          : renderUngroupedRows(renderData)}

        {props.showAddRow && props.options.addRowPosition === "last" && (
          <props.components.EditRow
            columns={props.columns.filter((columnDef: any) => {
              return !columnDef.hidden;
            })}
            data={props.initialFormData}
            components={props.components}
            errorState={props.errorState}
            icons={props.icons}
            key="key-add-row"
            mode="add"
            localization={{
              ...defaultProps.localization.editRow,
              ...props.localization.editRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            options={props.options}
            isTreeData={props.isTreeData}
            detailPanel={props.detailPanel}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            getFieldValue={props.getFieldValue}
            scrollWidth={props.scrollWidth}
          />
        )}
        {renderEmpty(emptyRowCount, renderData)}
      </TableBody>
    );
  //};
}
