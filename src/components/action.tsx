import { Icon, IconButton, Tooltip } from "@mui/material";

const MTableAction = ({ action, data, disabled, size }) => {
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
  };

  return <>{render()}</>;
};

export default MTableAction;
