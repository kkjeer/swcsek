import {
  Checkbox,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  SearchBox,
  Stack,
  Text,
} from "@fluentui/react";
import * as React from "react";
import { getLockPrettyName, LOCKS, LOCK_COLORS, PROPERTIES } from "./constants";
import { getImage } from "./images";

interface IBuyPropertiesProps {
  availMoney: number;
  availProperties: string[];
  onBuy: (properties: string[]) => void;
  onCancel: () => void;
}

interface IBuyPropertiesState {
  spendingMoney: number;
  pendingProperties: string[];

  searchProperty: string;
  lockFilters: string[];
}

export class BuyProperties extends React.Component<
  IBuyPropertiesProps,
  IBuyPropertiesState
> {
  private prevLockFilters: string[] = [];

  constructor(props: IBuyPropertiesProps) {
    super(props);

    this.state = {
      spendingMoney: props.availMoney,
      pendingProperties: [],
      searchProperty: "",
      lockFilters: ["all"],
    };
  }

  render() {
    const { availMoney, availProperties, onCancel } = this.props;
    const { spendingMoney, pendingProperties, searchProperty, lockFilters } =
      this.state;

    const lockOptions = [
      { key: "all", text: "All" },
      ...LOCKS.map((lock) => ({ key: lock, text: getLockPrettyName(lock) })),
    ];

    let propertiesToShow = [...availProperties];

    if (searchProperty) {
      propertiesToShow = propertiesToShow.filter((p) => {
        if (pendingProperties.indexOf(p) !== -1) {
          return true;
        }
        return p.toLowerCase().indexOf(searchProperty.toLowerCase()) !== -1;
      });
    }

    if (lockFilters.length > 0 && lockFilters.indexOf("all") === -1) {
      propertiesToShow = propertiesToShow.filter((p) => {
        if (pendingProperties.indexOf(p) !== -1) {
          return true;
        }
        return lockFilters.indexOf(PROPERTIES[p].lock) !== -1;
      });
    }

    return (
      <Stack
        id="buy-properties-root"
        verticalAlign="center"
        horizontalAlign="center"
        styles={{
          root: {
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#cccccc77",
          },
        }}
      >
        <Stack
          id="buy-properties-center"
          tokens={{ childrenGap: 20 }}
          styles={{
            root: {
              width: "70vw",
              height: "80vh",
              background: "white",
              borderRadius: 10,
              padding: 12,
            },
          }}
        >
          <Stack
            id="buy-properties-header"
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 16 }}
          >
            <Text variant="xLarge">Buying properties</Text>
            <Text variant="large">
              Available spending money: ${spendingMoney}
            </Text>
            <PrimaryButton
              onClick={this.buyProperties}
              disabled={spendingMoney < 0 || pendingProperties.length === 0}
            >
              Buy {pendingProperties.length}{" "}
              {pendingProperties.length === 1 ? "property" : "properties"} for $
              {availMoney - spendingMoney}
            </PrimaryButton>
            <DefaultButton onClick={onCancel}>Close</DefaultButton>
          </Stack>
          <Stack
            id="buy-properties-search"
            horizontal
            verticalAlign="end"
            tokens={{ childrenGap: 20 }}
          >
            <SearchBox
              placeholder="Search properties"
              underlined
              onChange={this.searchProperty}
            />
            <Dropdown
              label="Show lock(s)"
              multiSelect
              options={lockOptions}
              selectedKeys={lockFilters}
              onChange={this.toggleLockFilter}
              styles={{ root: { minWidth: 120, maxWidth: 220 } }}
            />
            <Text>
              Cart ({pendingProperties.length}): {pendingProperties.join(", ")}
            </Text>
          </Stack>
          <Stack
            id="buy-properties-property-list"
            horizontal
            wrap
            grow
            tokens={{ childrenGap: 24 }}
            styles={{
              root: {
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
              },
            }}
          >
            {propertiesToShow.map((p: string, idx: number) => (
              <Stack
                key={`buy-properties-property-${p}`}
                styles={{
                  root: {
                    width: 260,
                    height: 280,
                    borderRadius: 10,
                    position: "relative",
                  },
                }}
              >
                <img
                  id={`buy-properties-image-${p}`}
                  src={getImage(p)}
                  alt={p}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: 10,
                  }}
                />
                <Stack
                  id={`buy-properties-contents-${p}`}
                  styles={{
                    root: {
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      overflow: "hidden",
                      background: "#d7d7d788",
                      borderRadius: 10,
                      cursor: "pointer",
                      selectors: {
                        ":hover": {
                          background: "#e7e7e7aa",
                        },
                      },
                    },
                  }}
                  onClick={this.toggleProperty(p)}
                >
                  <Stack
                    id={`buy-properties-header-${p}`}
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                    tokens={{ childrenGap: 6 }}
                    styles={{
                      root: {
                        background: "#f0f0f0aa",
                        padding: 10,
                        borderRadius: 10,
                        overflow: "hidden",
                        width: "100%",
                      },
                    }}
                  >
                    <Stack
                      horizontal
                      verticalAlign="center"
                      tokens={{ childrenGap: 10 }}
                    >
                      <Stack
                        styles={{
                          root: {
                            width: 30,
                            height: 15,
                            background: LOCK_COLORS[PROPERTIES[p].lock],
                            borderRadius: 8,
                          },
                        }}
                      />
                      {/* <Text
                        variant="large"
                        styles={{
                          root: {
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 120,
                            overflow: "hidden",
                          },
                        }}
                      >
                        {p}
                      </Text> */}
                    </Stack>
                    <Text variant="large">${PROPERTIES[p].price}</Text>
                    <Checkbox
                      label="Buy"
                      onChange={this.toggleProperty(p)}
                      checked={pendingProperties.indexOf(p) !== -1}
                    />
                  </Stack>
                  <Stack
                    id={`buy-properties-name-${p}`}
                    grow
                    verticalAlign="center"
                    horizontalAlign="center"
                    styles={{
                      root: { padding: "0px 20px" },
                    }}
                  >
                    <Text
                      // variant="xxLarge"
                      styles={{
                        root: {
                          textAlign: "center",
                          fontSize: 28,
                          fontWeight: 600,
                          fontFamily: "Cinzel Decorative",
                        },
                      }}
                    >
                      {p}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  buyProperties = (ev: any) => {
    const { onBuy } = this.props;
    const { pendingProperties } = this.state;

    onBuy(pendingProperties);
  };

  toggleProperty = (property: string) => (ev: any) => {
    let spendingMoney = this.state.spendingMoney;

    const pendingProperties = [...this.state.pendingProperties];
    if (pendingProperties.indexOf(property) === -1) {
      pendingProperties.push(property);
      spendingMoney -= PROPERTIES[property].price;
    } else {
      pendingProperties.splice(pendingProperties.indexOf(property, 1));
      spendingMoney += PROPERTIES[property].price;
    }

    this.setState({ pendingProperties, spendingMoney });
  };

  searchProperty = (ev: any, val?: string) => {
    this.setState({ searchProperty: val || "" });
  };

  toggleLockFilter = (ev: any, option?: IDropdownOption) => {
    if (!option) return;

    let lockFilters = [...this.state.lockFilters];

    if (option.selected) {
      if (option.key === "all") {
        lockFilters = ["all"];
      } else {
        if (lockFilters.indexOf("all") !== -1) {
          lockFilters.splice(lockFilters.indexOf("all"), 1);
        }
        lockFilters.push(option.key.toString());
        this.prevLockFilters = [...lockFilters];
      }
    } else {
      if (option.key === "all") {
        lockFilters = [...this.prevLockFilters];
      } else {
        lockFilters.splice(lockFilters.indexOf(option.key.toString()), 1);
        this.prevLockFilters = [...lockFilters];
      }
    }

    this.setState({ lockFilters });
  };
}
