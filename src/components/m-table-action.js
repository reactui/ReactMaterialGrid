/* eslint-disable no-unused-vars */
import * as React from "react";
import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
/* eslint-enable no-unused-vars */

const MTableAction = props => {

  const {
    action,
    data,
    disabled,
    size
  } = props;

  const render = () => {  

    if (typeof action === "function") {
      action = action(data);
      if (!action) {
        return null;
      }
    }

    if (action.action) {
      action = action.action(data);
      if (!action) {
        return null;
      }
    }

    if (action.hidden) {
      return null;
    }

    const disabledResolved = action.disabled || disabled;

    const handleOnClick = (event) => {
      if (action.onClick) {
        action.onClick(event, data);
        event.stopPropagation();
      }
    };

    const icon =
      typeof action.icon === "string" ? (
        <Icon {...action.iconProps}>{action.icon}</Icon>
      ) : typeof action.icon === "function" ? (
        action.icon({ ...action.iconProps, disabled: disabledResolved })
      ) : (
        <action.icon />
      );

    const button = (
      <IconButton
        size={size}
        color="inherit"
        disabled={disabledResolved}
        onClick={handleOnClick}
      >
        {icon}
      </IconButton>
    );

    if (action.tooltip) {
      
      return disabled ? (
        <Tooltip title={action.tooltip}>
          <span>{button}</span>
        </Tooltip>
      ) : (
        <Tooltip title={action.tooltip}>{button}</Tooltip>
      );
    } else {
      return button;
    }
  }

  return (
    <>
    {render()}
    </>
  );
}

MTableAction.defaultProps = {
  action: {},
  data: {},
};

MTableAction.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  disabled: PropTypes.bool,
  size: PropTypes.string,
};

export default MTableAction;
