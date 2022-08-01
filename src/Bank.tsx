import {
  Dropdown,
  IDropdownOption,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import * as React from "react";
import { ITeam, ITransaction, PROPERTIES } from "./constants";
import { Team } from "./Team";
import { BuyProperties } from "./BuyProperties";

interface IBankProps {
  startMoney: number;
  teams: ITeam[];
}

interface IBankState {
  money: number[];
  properties: string[][];
  freeParking: number;
  payFreeParkingTeam: string;
  bankAmountToPay: number;
  payBankTeam: string;
  propertyBuyingTeam: number;
}

const DUMMY_PROPERTIES = [
  ["Nym's Hut", "Jynx's Room", "Castle Gates", "Key's Tree", "The Crypt"],
  [
    "Waterfall",
    "Incantus Outpost",
    "Helotown",
    "Westell",
    "Aldentown",
    "Novelis",
  ],
  ["Library", "Wrelic's Room", "Novelis", "Shadolan Tree", "Loredom"],
  [
    "Northell",
    "Pine Forest",
    "Training Site",
    "Initiation Tower",
    "Pellinglow",
    "Ironisle",
  ],
];

export class Bank extends React.Component<IBankProps, IBankState> {
  constructor(props: IBankProps) {
    super(props);

    const money = [];
    const properties = [];
    for (let i = 0; i < props.teams.length; ++i) {
      money.push(props.startMoney);
      // properties.push(DUMMY_PROPERTIES[i]);
      properties.push([]);
    }

    this.state = {
      money,
      properties,
      freeParking: 100,
      payFreeParkingTeam: "default",
      bankAmountToPay: 0,
      payBankTeam: "default",
      propertyBuyingTeam: -1,
    };
  }

  render() {
    const { teams } = this.props;
    const {
      money,
      properties,
      freeParking,
      payFreeParkingTeam,
      bankAmountToPay,
      payBankTeam,
      propertyBuyingTeam,
    } = this.state;

    const options = [
      { key: "default", text: "Select team" },
      ...teams.map((team) => ({
        key: team.number.toString(),
        text: `Team ${team.number}`,
      })),
    ];

    return (
      <>
        <Stack
          id="bank-root"
          verticalAlign="space-between"
          styles={{ root: { height: "100vh", overflow: "hidden" } }}
        >
          <Stack
            id="bank-header"
            horizontal
            verticalAlign="end"
            horizontalAlign="space-around"
            styles={{ root: { width: "100vw", height: 45 } }}
          >
            <Stack
              id="bank-freeparking"
              horizontal
              horizontalAlign="end"
              verticalAlign="end"
              tokens={{ childrenGap: 12 }}
              styles={{ root: { width: "48vw" } }}
            >
              <Text variant="xLarge">Free parking:</Text>
              <TextField
                prefix="$"
                value={freeParking.toString()}
                onChange={this.changeFreeParking}
                type="number"
                styles={{ root: { width: 105 } }}
              />
              <Text>Pay to:</Text>
              <Dropdown
                selectedKey={payFreeParkingTeam}
                onChange={this.payFromFreeParking}
                options={options}
              />
            </Stack>
            <Stack
              id="bank-bank"
              horizontal
              horizontalAlign="start"
              verticalAlign="end"
              tokens={{ childrenGap: 12 }}
              styles={{ root: { width: "48vw" } }}
            >
              <Text variant="xLarge">Bank:</Text>
              <TextField
                prefix="Pay $"
                value={bankAmountToPay.toString()}
                onChange={this.changeBankAmount}
                type="number"
                styles={{ root: { width: 130 } }}
              />
              <Text>to</Text>
              <Dropdown
                selectedKey={payBankTeam}
                onChange={this.payFromBank}
                options={options}
              />
            </Stack>
          </Stack>
          <Stack
            id="bank-teams"
            grow
            tokens={{ childrenGap: 20 }}
            styles={{
              root: { flex: 1, padding: "20px 0px" },
            }}
          >
            {this.teamRow(1, 2)}
            {this.teamRow(3, 4)}
          </Stack>
        </Stack>
        {propertyBuyingTeam > -1 && (
          <BuyProperties
            availMoney={money[propertyBuyingTeam - 1]}
            availProperties={Object.keys(PROPERTIES).filter((p) => {
              for (const i in properties) {
                if (properties[i].indexOf(p) !== -1) {
                  return false;
                }
              }
              return true;
            })}
            onBuy={this.buyProperties}
            onCancel={this.cancelPropertyBuyer}
          />
        )}
      </>
    );
  }

  teamRow = (n1: number, n2: number) => {
    const { teams } = this.props;
    const { money, properties, freeParking } = this.state;

    if (teams.length < n1) {
      return null;
    }

    const renderTeam = (n: number) => (
      <Team
        n={n}
        players={teams[n - 1].players}
        money={money[n - 1]}
        properties={properties[n - 1]}
        numTeams={teams.length}
        freeParking={freeParking}
        onTransaction={this.transact(n)}
        onSellProperty={this.sellProperty(n)}
        onMortgageProperty={this.mortgageProperty(n)}
        onUnmortgageProperty={this.unmortgageProperty(n)}
        onOpenPropertyBuyer={this.openPropertyBuyer(n)}
      />
    );

    return (
      <Stack
        horizontal
        horizontalAlign="space-around"
        styles={{ root: { width: "100vw", flex: 1 } }}
      >
        {renderTeam(n1)}
        {renderTeam(n2)}
      </Stack>
    );
  };

  transact = (n: number) => (transaction: ITransaction) => {
    console.log("team", n, "is transacting", transaction);
    const { direction, amount, entity } = transaction;

    const teamIdx = n - 1;
    const money = [...this.state.money];

    if (direction === "receive") {
      money[teamIdx] += amount;

      let freeParking = this.state.freeParking;
      if (entity === "freeParking") {
        freeParking -= amount;
        freeParking = Math.max(freeParking, 0);
      }

      this.setState({ money, freeParking });
      return;
    }

    // Subtract paid amount from team's money
    money[teamIdx] -= amount;

    // Pay the bank
    if (entity === "bank") {
      this.setState({ money });
      return;
    }

    // Pay free parking
    if (entity === "freeParking") {
      const freeParking = this.state.freeParking + amount;
      this.setState({ money, freeParking });
      return;
    }

    // Pay a team
    const otherTeam = Number(entity);
    if (isNaN(otherTeam)) {
      return;
    }
    money[otherTeam - 1] += amount;
    this.setState({ money });
  };

  changeFreeParking = (ev: any, val?: string) => {
    const freeParking = Number(val);
    this.setState({ freeParking });
  };

  payFromFreeParking = (ev: any, option?: IDropdownOption) => {
    if (!option) return;
    if (option.key === "default") return;

    const team = Number(option.key);
    if (isNaN(team)) return;

    const money = [...this.state.money];
    money[team - 1] += this.state.freeParking;
    this.setState({
      money,
      freeParking: 0,
      payFreeParkingTeam: option.key.toString(),
    });

    setTimeout(() => {
      this.setState({ payFreeParkingTeam: "default" });
    }, 1000);
  };

  changeBankAmount = (ev: any, val?: string) => {
    const bankAmountToPay = Number(val);
    this.setState({ bankAmountToPay });
  };

  payFromBank = (ev: any, option?: IDropdownOption) => {
    if (!option) return;
    if (option.key === "default") return;

    const team = Number(option.key);
    if (isNaN(team)) return;

    const money = [...this.state.money];
    money[team - 1] += this.state.bankAmountToPay;
    this.setState({
      money,
      bankAmountToPay: 0,
      payBankTeam: option.key.toString(),
    });

    setTimeout(() => {
      this.setState({ payBankTeam: "default" });
    }, 1000);
  };

  sellProperty = (n: number) => (property: string) => {
    const idx = n - 1;

    const properties = [...this.state.properties];
    properties[idx] = properties[idx].filter((p) => p !== property);

    const money = [...this.state.money];
    money[idx] += PROPERTIES[property].price;

    this.setState({ properties, money });
  };

  mortgageProperty = (n: number) => (property: string) => {
    const idx = n - 1;

    const money = [...this.state.money];
    money[idx] += 0.5 * PROPERTIES[property].price;

    this.setState({ money });
  };

  unmortgageProperty = (n: number) => (property: string) => {
    const idx = n - 1;

    const money = [...this.state.money];
    money[idx] -= 0.5 * PROPERTIES[property].price;

    this.setState({ money });
  };

  openPropertyBuyer = (n: number) => () => {
    this.setState({ propertyBuyingTeam: n });
  };

  buyProperties = (propertyNames: string[]) => {
    let cost = 0;
    for (let i = 0; i < propertyNames.length; ++i) {
      cost += PROPERTIES[propertyNames[i]].price;
    }

    const idx = this.state.propertyBuyingTeam - 1;
    const money = [...this.state.money];
    money[idx] -= cost;

    const properties = [...this.state.properties];
    properties[idx] = [...properties[idx], ...propertyNames];

    this.setState({ money, properties, propertyBuyingTeam: -1 });
  };

  cancelPropertyBuyer = () => {
    this.setState({ propertyBuyingTeam: -1 });
  };
}
