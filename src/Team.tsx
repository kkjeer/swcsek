import {
  DefaultButton,
  Dropdown,
  IconButton,
  IDropdownOption,
  PrimaryButton,
  ProgressIndicator,
  SearchBox,
  Stack,
  Text,
  TextField,
  Toggle,
} from "@fluentui/react";
import * as React from "react";
import {
  getLockPrettyName,
  getPropertiesByLock,
  ITransaction,
  LOCK_COLORS,
  PROPERTIES,
  PROPS_BY_LOCK,
  TEAM_COLORS,
} from "./constants";
import { getImage } from "./images";
import "./Team.css";

interface ITeamProps {
  n: number;
  numTeams: number;
  freeParking: number;
  players: string[];
  money: number;
  properties: string[];
  onTransaction: (transaction: ITransaction) => void;
  onSellProperty: (property: string) => void;
  onMortgageProperty: (property: string) => void;
  onUnmortgageProperty: (property: string) => void;
  onOpenPropertyBuyer: () => void;
}

interface ITeamState {
  transaction: ITransaction;
  searchProperty: string;
  viewingProperty: string;
  mortgaged: string[];
}

export class Team extends React.Component<ITeamProps, ITeamState> {
  private options: IDropdownOption[];

  constructor(props: ITeamProps) {
    super(props);

    this.options = [];
    for (let i = 1; i <= props.numTeams; ++i) {
      if (i !== props.n) {
        this.options.push({ key: String(i), text: `Team ${i}` });
      }
    }
    this.options.push({ key: "bank", text: "Bank" });
    this.options.push({ key: "freeParking", text: "Free Parking" });

    this.state = {
      transaction: {
        direction: "pay",
        entity: this.options[0].key.toString(),
        amount: 0,
      },
      searchProperty: "",
      viewingProperty: "",
      mortgaged: [],
    };
  }

  render() {
    const { n, players } = this.props;

    return (
      <Stack
        id={`team-${n}-root`}
        tokens={{ childrenGap: 10 }}
        styles={{
          root: {
            width: "48vw",
            height: "calc(0.5 * (100vh - 45px - 52px))",
            overflow: "hidden",
            background: "#eaeaea",
            borderRadius: 10,
            padding: 0,
          },
        }}
      >
        <Stack
          id={`team-${n}-top-bar`}
          horizontal
          tokens={{ childrenGap: 20 }}
          verticalAlign="center"
          styles={{
            root: {
              backgroundColor: TEAM_COLORS[n - 1],
              padding: 4,
              borderRadius: 10,
              height: 45,
            },
          }}
        >
          <Text
            variant="large"
            styles={{
              root: {
                maxWidth: 200,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              },
            }}
          >
            Team {n} -{" "}
            {players.length === 2 ? players.join(" and ") : players.join(", ")}
          </Text>
          {this.money()}
        </Stack>
        {this.properties()}
      </Stack>
    );
  }

  ////// MONEY METHODS //////

  money = () => {
    const { money, freeParking } = this.props;
    const { direction, amount, entity } = this.state.transaction;

    let disabled = amount <= 0 || amount > money;
    if (entity === "freeParking" && direction === "receive") {
      disabled = disabled || amount > freeParking;
    }

    const showToggle = false;

    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
        <Text variant="xxLarge">${money}</Text>
        {showToggle && (
          <Toggle
            onText="Pay"
            offText="Receive"
            checked={direction === "pay"}
            onChange={this.changeDirection}
            styles={{ root: { marginBottom: 0 } }}
          />
        )}
        <TextField
          prefix={showToggle ? "$" : "Pay $"}
          value={amount.toString()}
          onChange={this.changeAmount}
          type="number"
          styles={{ root: { width: showToggle ? 105 : 130 } }}
        />
        <Text>{direction === "pay" ? "to" : "from"}</Text>
        <Dropdown
          label=""
          selectedKey={entity}
          options={this.options}
          onRenderOption={this.onRenderOption}
          onRenderTitle={this.onRenderTitle}
          onChange={this.changeEntity}
          styles={{ root: { width: 130 } }}
        />
        <PrimaryButton
          disabled={disabled}
          onClick={this.transact}
          styles={{ root: { minWidth: "unset" } }}
        >
          Pay
        </PrimaryButton>
      </Stack>
    );
  };

  onRenderTitle = (options?: IDropdownOption[]) => {
    if (!options) return null;
    return this.onRenderOption(options[0]);
  };

  onRenderOption = (option?: IDropdownOption) => {
    if (!option) return null;

    const renderThing = () => {
      let color = "#666666";
      if (option.key === "freeParking") {
        color = "#222222";
      }

      const idx = Number(option.key);
      if (!isNaN(idx)) {
        color = TEAM_COLORS[idx - 1];
        color = color.substring(0, color.length - 2) + "99";
      }

      return (
        <Stack
          styles={{
            root: {
              width: 10,
              height: 10,
              backgroundColor: color,
              borderRadius: 8,
            },
          }}
        />
      );
    };

    return (
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
        {renderThing()}
        <Text>{option.text}</Text>
      </Stack>
    );
  };

  changeDirection = (ev: any, checked?: boolean) => {
    this.setState({
      transaction: {
        ...this.state.transaction,
        direction: checked ? "pay" : "receive",
      },
    });
  };

  changeAmount = (ev: any, val?: string) => {
    const result = Number(val);
    this.setState({
      transaction: {
        ...this.state.transaction,
        amount: isNaN(result) ? 0 : result,
      },
    });
  };

  changeEntity = (ev: any, option?: IDropdownOption) => {
    if (!option) return;
    this.setState({
      transaction: {
        ...this.state.transaction,
        entity: String(option.key),
      },
    });
  };

  transact = (ev: any) => {
    this.props.onTransaction(this.state.transaction);
    this.setState({
      transaction: {
        direction: "pay",
        amount: 0,
        entity: this.state.transaction.entity,
      },
    });
  };

  ////// PROPERTIES METHODS //////

  properties = () => {
    return (
      <Stack
        horizontal
        tokens={{ childrenGap: 20 }}
        styles={{
          root: { height: "calc(100% - 55px)" },
        }}
      >
        {this.allProperties()}
        {this.singlePropertyView()}
      </Stack>
    );
  };

  allProperties = () => {
    const { n, properties } = this.props;
    const { searchProperty, mortgaged } = this.state;

    let searchedProps = [...properties];
    if (searchProperty) {
      searchedProps = searchedProps.filter((p) => {
        const property = PROPERTIES[p];
        return (
          getLockPrettyName(property.lock)
            .toLowerCase()
            .indexOf(searchProperty.toLowerCase()) !== -1 ||
          p.toString().toLowerCase().indexOf(searchProperty.toLowerCase()) !==
            -1
        );
      });
    }

    const propsByLock = getPropertiesByLock(searchedProps);

    return (
      <Stack
        id={`team-${n}-allproperties`}
        tokens={{ childrenGap: 10 }}
        styles={{
          root: {
            width: 210,
            minWidth: 210,
            maxWidth: 210,
            overflowX: "hidden",
            paddingLeft: 10,
            paddingBottom: 6,
          },
        }}
      >
        <SearchBox
          underlined
          placeholder="Search properties"
          onChange={this.searchProperty}
        />
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          tokens={{ childrenGap: 6 }}
        >
          <Text>{properties.length} properties</Text>
          <PrimaryButton
            onClick={this.props.onOpenPropertyBuyer}
            styles={{ root: { width: "unset", height: "unset", padding: 6 } }}
          >
            Buy property
          </PrimaryButton>
        </Stack>
        <Stack
          tokens={{ childrenGap: 8 }}
          grow
          styles={{
            root: {
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
              padding: 6,
              paddingTop: 0,
            },
          }}
        >
          {Object.keys(propsByLock).map((lock) => {
            const props = propsByLock[lock];
            const allPropsWithLock = PROPS_BY_LOCK[lock];
            return (
              <Stack
                key={`team-${n}-${lock}-properties`}
                tokens={{ childrenGap: 6 }}
              >
                <ProgressIndicator
                  percentComplete={props.length / allPropsWithLock.length}
                  styles={{
                    progressTrack: {
                      background: "#ddd",
                      height: 8,
                      borderRadius: 8,
                    },
                    progressBar: {
                      background: LOCK_COLORS[lock],
                      height: 8,
                      borderRadius: 8,
                    },
                  }}
                />
                <Stack horizontal wrap tokens={{ childrenGap: 6 }}>
                  {props.map((p) => (
                    <DefaultButton
                      key={`team-${n}-lock-${lock}-property-${p.name}`}
                      onClick={this.viewProperty(p.name || "")}
                      styles={{
                        root: {
                          padding: "4px 6px",
                          height: "unset",
                          borderRadius: 15,
                          background: "#f4f4f4",
                          borderColor: LOCK_COLORS[lock],
                        },
                      }}
                    >
                      <Text
                        styles={{
                          root: {
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: 180,
                            color:
                              mortgaged.indexOf(p.name || "") !== -1
                                ? "#aaa"
                                : "initial",
                          },
                        }}
                      >
                        {p.name}
                      </Text>
                    </DefaultButton>
                  ))}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  searchProperty = (ev: any, val?: string) => {
    this.setState({ searchProperty: val || "" });
  };

  viewProperty = (property: string) => (ev: any) => {
    this.setState({ viewingProperty: property });
  };

  singlePropertyView = () => {
    const { money } = this.props;
    const { viewingProperty, mortgaged } = this.state;
    if (!viewingProperty) return null;

    const isMortgaged = mortgaged.indexOf(viewingProperty) !== -1;

    const cardStyles = {
      flex: 1,
      borderRadius: 10,
    };

    const buttonStyles = {
      width: "unset",
      height: "unset",
      minWidth: "unset",
      padding: 4,
    };

    const property = PROPERTIES[viewingProperty];
    const lockColor = LOCK_COLORS[property.lock];
    const canUnmortgage = money >= 0.5 * property.price;

    return (
      <Stack
        id={`single-property-view-${viewingProperty}`}
        tokens={{ childrenGap: 8 }}
        grow
        styles={{ root: { paddingRight: 10, paddingBottom: 6 } }}
      >
        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}>
          {!isMortgaged && (
            <PrimaryButton
              onClick={this.sellProperty}
              styles={{ root: { ...buttonStyles } }}
            >
              Sell
            </PrimaryButton>
          )}
          {!isMortgaged && (
            <DefaultButton
              onClick={this.mortgageProperty}
              styles={{ root: { ...buttonStyles } }}
            >
              Mortage
            </DefaultButton>
          )}
          {isMortgaged && (
            <DefaultButton
              disabled={!canUnmortgage}
              onClick={this.unmortgageProperty}
              styles={{ root: { ...buttonStyles } }}
            >
              Unmortage
            </DefaultButton>
          )}
          <IconButton
            iconProps={{ iconName: "StatusCircleErrorX" }}
            styles={{
              root: {
                ...buttonStyles,
                background: "#ededed",
                border: "1px solid #bbb",
              },
            }}
            onClick={this.viewProperty("")}
          >
            Close
          </IconButton>
        </Stack>
        <Stack
          horizontal
          tokens={{ childrenGap: 10 }}
          styles={{
            root: {
              overflow: "hidden",
              height: "calc(100% - 10px)",
            },
          }}
        >
          <img
            src={getImage(viewingProperty)}
            style={{ ...cardStyles, width: 200 }}
            alt="property"
          />
          <Stack
            id={`single-property-view-back-${viewingProperty}`}
            verticalAlign="space-between"
            tokens={{ childrenGap: 10 }}
            className={isMortgaged ? "singlePropertyViewBackCardMortgaged" : ""}
            styles={{
              root: {
                ...cardStyles,
                backgroundColor: "#f8f8f8",
                padding: 8,
                color: isMortgaged ? "red !important" : "initial",
              },
            }}
          >
            <Stack
              id={`single-property-view-back-header-${viewingProperty}`}
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              tokens={{ childrenGap: 8 }}
            >
              <Stack
                id={`single-property-view-back--lock-title-${viewingProperty}`}
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 8 }}
              >
                <Stack
                  id={`single-property-view-lock-color-${viewingProperty}`}
                  styles={{
                    root: {
                      width: 10,
                      height: 15,
                      background: lockColor,
                      borderRadius: 8,
                    },
                  }}
                />
                <Text
                  variant="large"
                  styles={{
                    root: {
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      maxWidth: 160,
                    },
                  }}
                >
                  {viewingProperty}
                </Text>
              </Stack>
              <Text variant="large">${property.rent}</Text>
            </Stack>
            <Stack
              id={`single-property-view-cottage-rents-${viewingProperty}`}
              grow
              verticalAlign="space-around"
            >
              {property.cottageRents.length > 4 && (
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between"
                  tokens={{ childrenGap: 8 }}
                >
                  <Text
                    variant="mediumPlus"
                    styles={{ root: { fontWeight: 500 } }}
                  >
                    With a castle:
                  </Text>
                  <Stack
                    grow
                    styles={{
                      root: {
                        flex: 1,
                        height: "80%",
                        borderBottom: "1px dotted #111",
                      },
                    }}
                  />
                  <Text
                    variant="mediumPlus"
                    styles={{ root: { fontWeight: 500 } }}
                  >
                    ${property.cottageRents[4]}
                  </Text>
                </Stack>
              )}
              {property.cottageRents.map((rent, idx) => {
                if (idx >= 4) return null;
                return (
                  <Stack
                    key={rent}
                    horizontal
                    verticalAlign="center"
                    horizontalAlign="space-between"
                    tokens={{ childrenGap: 8 }}
                  >
                    <Text>
                      With {idx + 1} {idx + 1 === 1 ? "cottage" : "cottages"}:
                    </Text>
                    <Stack
                      grow
                      styles={{
                        root: {
                          flex: 1,
                          height: "80%",
                          borderBottom: "1px dotted #333",
                        },
                      }}
                    />
                    <Text>${rent}</Text>
                  </Stack>
                );
              })}
            </Stack>
            <Stack
              id={`single-property-view-price-${property}`}
              horizontal
              verticalAlign="center"
              horizontalAlign="center"
              tokens={{ childrenGap: 12 }}
              styles={{
                root: {
                  borderTop: `1px solid ${lockColor}`,
                  paddingTop: 6,
                },
              }}
            >
              <Text variant="small">Price: ${property.price}</Text>
              {isMortgaged && (
                <Text
                  variant="xSmall"
                  styles={!canUnmortgage ? { root: { color: "#aa0000" } } : {}}
                >
                  Unmortgage cost: ${0.5 * property.price}
                </Text>
              )}
              {!isMortgaged && (
                <Text variant="xSmall">
                  Mortgage reward: ${0.5 * property.price}
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  sellProperty = (ev: any) => {
    const { onSellProperty } = this.props;
    const { viewingProperty } = this.state;

    onSellProperty(viewingProperty);
    this.setState({ viewingProperty: "" });
  };

  mortgageProperty = (ev: any) => {
    const { onMortgageProperty } = this.props;
    const { viewingProperty } = this.state;

    const mortgaged = [...this.state.mortgaged];
    mortgaged.push(viewingProperty);

    onMortgageProperty(viewingProperty);
    this.setState({ mortgaged });
  };

  unmortgageProperty = (ev: any) => {
    const { onUnmortgageProperty } = this.props;
    const { viewingProperty } = this.state;

    const mortgaged = this.state.mortgaged.filter((p) => p !== viewingProperty);

    onUnmortgageProperty(viewingProperty);
    this.setState({ mortgaged });
  };
}
