import { Toolbar, Chip, Typography } from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function MTableGroupbar(props: any) {
  //class MTableGroupbar extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: '8px 16px',
    margin: `0 ${8}px 0 0`,

    // change background colour if dragging
    // background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? 'lightblue' : '#0000000a',
    background: "#0000000a",
    display: "flex",
    width: "100%",
    padding: 8,
    overflow: "auto",
    border: "1px solid #ccc",
    borderStyle: "dashed",
  });

  const render = () => {
    return (
      <Toolbar style={{ padding: 0, minHeight: "unset" }}>
        <Droppable
          droppableId="groups"
          direction="horizontal"

          /*placeholder="Deneme"*/
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {props.groupColumns.length > 0 && (
                <Typography variant="caption" style={{ padding: 8 }}>
                  {props.localization.groupedBy}
                </Typography>
              )}
              {props.groupColumns.map((columnDef: any, index: number) => {
                return (
                  <Draggable
                    key={columnDef.tableData.id}
                    draggableId={columnDef.tableData.id.toString()}
                    index={index}
                  >
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Chip
                          {...provided.dragHandleProps}
                          onClick={() => props.onSortChanged(columnDef)}
                          label={
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div style={{ float: "left" }}>
                                {columnDef.title}
                              </div>
                              {columnDef.tableData.groupSort && (
                                <props.icons.SortArrow
                                  style={{
                                    transition: "300ms ease all",
                                    transform:
                                      columnDef.tableData.groupSort === "asc"
                                        ? "rotate(-180deg)"
                                        : "none",
                                    fontSize: 18,
                                  }}
                                />
                              )}
                            </div>
                          }
                          style={{ boxShadow: "none", textTransform: "none" }}
                          onDelete={() =>
                            props.onGroupRemoved(columnDef, index)
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {props.groupColumns.length === 0 && (
                <Typography variant="caption" style={{ padding: 8 }}>
                  {props.localization.placeholder}
                </Typography>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Toolbar>
    );
  };
}

const defaultProps = {};

// MTableGroupbar.propTypes = {
//   localization: PropTypes.shape({
//     groupedBy: PropTypes.string,
//     placeholder: PropTypes.string,
//   }),
// };
