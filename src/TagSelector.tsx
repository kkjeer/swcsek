import { Stack, TextField, Text, IconButton } from "@fluentui/react";
import * as React from "react";

interface ITagSelectorProps {
  onChange: (items: string[]) => void;
  items: string[];
  placeholder?: string;
}

interface ITagSelectorState {
  pendingItem: string;
}

export class TagSelector extends React.Component<
  ITagSelectorProps,
  ITagSelectorState
> {
  constructor(props: ITagSelectorProps) {
    super(props);
    this.state = {
      pendingItem: "",
    };
  }

  render() {
    const { items, placeholder } = this.props;
    const { pendingItem } = this.state;

    return (
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          placeholder={placeholder}
          value={pendingItem}
          onChange={this.changePendingItem}
          onKeyDown={this.addItem}
        />
        <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
          {items.map((item) => (
            <Stack
              key={item}
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 8 }}
              styles={{
                root: {
                  padding: "0px 10px",
                  paddingRight: 0,
                  borderRadius: 15,
                  background: "#f4f4f4",
                },
              }}
            >
              <Text>{item}</Text>
              <IconButton
                iconProps={{ iconName: "StatusCircleErrorX" }}
                onClick={this.deleteItem(item)}
                styles={{
                  root: {
                    borderRadius: 15,
                    width: 28,
                    height: 28,
                    background: "#ededed",
                  },
                }}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  }

  changePendingItem = (ev: any, val?: string) => {
    this.setState({ pendingItem: val || "" });
  };

  addItem = (ev: any) => {
    if (ev.key !== "Enter") {
      return;
    }

    const items = [...this.props.items, this.state.pendingItem];
    this.props.onChange(items);
    this.setState({ pendingItem: "" });
  };

  deleteItem = (item: string) => (ev: any) => {
    const items = this.props.items.filter((it) => it !== item);
    this.props.onChange(items);
  };
}
