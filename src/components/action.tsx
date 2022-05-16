import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

interface ActionProps {
  action: Function | object;
  data: object;
  disabled: boolean;
  size: number;
}

export default function MTableAction({
  action,
  data,
  disabled,
  size,
}: ActionProps) {
  const render = () => {
    let result: any;

    if (typeof action === "function") {
      result = action(data);
      if (!action) {
        return null;
      }
    }

    if (result.action) {
      result = result.action(data);
      if (!action) {
        return null;
      }
    }

    if (result.hidden) {
      return null;
    }

    const disabledResolved = result.disabled || disabled;

    const handleOnClick = (event: any) => {
      if (result.onClick) {
        result.onClick(event, data);
        event.stopPropagation();
      }
    };
    const icon =
      typeof result.icon === "string" ? (
        <Icon {...result.iconProps}>{result.icon}</Icon>
      ) : typeof result.icon === "function" ? (
        result.icon({ ...result.iconProps, disabled: disabledResolved })
      ) : (
        <result.icon />
      );

    const button = (
      <IconButton
        //size={size}
        color="inherit"
        disabled={disabledResolved}
        onClick={handleOnClick}
      >
        {icon}
      </IconButton>
    );

    if (result.tooltip) {
      return disabled ? (
        <Tooltip title={result.tooltip}>
          <span>{button}</span>
        </Tooltip>
      ) : (
        <Tooltip title={result.tooltip}>{button}</Tooltip>
      );
    } else {
      return button;
    }
  };

  return <>{render()}</>;
}
