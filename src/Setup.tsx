import {
  Checkbox,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import * as React from "react";
import { ITeam, EMPTY_TEAM, PASSWORD, TEAM_COLORS } from "./constants";
import { TagSelector } from "./TagSelector";

interface ISetupProps {
  onStart: (startMoney: number, teams: ITeam[]) => void;
}

interface ISetupState {
  password: string;
  startMoney: number;
  teams: { [key: string]: ITeam };
}

export class Setup extends React.Component<ISetupProps, ISetupState> {
  constructor(props: ISetupProps) {
    super(props);

    this.state = {
      // password: PASSWORD, // for debugging only - should be initialized to empty
      password: "",
      startMoney: 2150,
      teams: {
        "1": { ...EMPTY_TEAM, number: 1, players: ["Jynx", "Key"] },
        "2": { ...EMPTY_TEAM, number: 2, players: ["Bryll", "Perth"] },
        "3": { ...EMPTY_TEAM, number: 3, players: ["Cyr", "Viine"] },
        "4": { ...EMPTY_TEAM, number: 4, players: ["Tor", "Gwyn"] },
      },
    };
  }

  render() {
    const { password } = this.state;

    return (
      <Stack
        horizontalAlign="center"
        tokens={{ childrenGap: 20 }}
        styles={{ root: { width: "100vw", height: "100vh", padding: 50 } }}
      >
        <Text variant="xLarge">Cryptkeeper Monopoly</Text>
        {!password && this.enterPassword()}
        {password && this.enterTeams()}
      </Stack>
    );
  }

  enterPassword = () => {
    return (
      <Stack horizontal verticalAlign="center">
        <TextField label="Enter password:" onChange={this.onPasswordChange} />
      </Stack>
    );
  };

  onPasswordChange = (ev: any, val?: string) => {
    if (val === PASSWORD) {
      this.setState({ password: val });
    }
  };

  enterTeams = () => {
    const { startMoney } = this.state;
    return (
      <>
        <PrimaryButton onClick={this.startGame}>Start Game</PrimaryButton>
        <TextField
          label="Starting money"
          prefix="$"
          value={startMoney.toString()}
          type="number"
          onChange={this.changeStartMoney}
        />
        <Text variant="large">Enter teams:</Text>
        <Stack horizontal tokens={{ childrenGap: 30 }}>
          {this.team(1)}
          {this.team(2)}
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 30 }}>
          {this.team(3)}
          {this.team(4)}
        </Stack>
      </>
    );
  };

  startGame = () => {
    const { onStart } = this.props;
    const { startMoney, teams } = this.state;
    const enabledTeams: ITeam[] = [];
    for (const key in teams) {
      if (!teams[key].disabled) {
        enabledTeams.push(teams[key]);
      }
    }
    onStart(startMoney, enabledTeams);
  };

  changeStartMoney = (ev: any, val?: string) => {
    const money = Number(val);
    this.setState({ startMoney: isNaN(money) ? 1000 : money });
  };

  team = (n: number) => {
    const { players, disabled } = this.state.teams[String(n)];
    return (
      <Stack
        tokens={{ childrenGap: 20 }}
        styles={{
          root: {
            width: "30vw",
            background: "#e7e7e7",
            borderRadius: 10,
            padding: 10,
          },
        }}
      >
        <Stack
          horizontal
          verticalAlign="center"
          // horizontalAlign="center"
          tokens={{ childrenGap: 20 }}
          styles={{
            root: {
              width: "100%",
              backgroundColor: TEAM_COLORS[n - 1],
              borderRadius: 8,
              padding: 4,
            },
          }}
        >
          <Text variant="large">Team {n}</Text>
          <Checkbox
            checked={!disabled}
            label={"Play with this team"}
            onChange={this.toggleTeam(n)}
            disabled={players.length < 1}
          />
        </Stack>
        {/* <Text>{players.join(", ")}</Text> */}
        <TagSelector
          placeholder="Add players"
          items={players}
          onChange={this.updatePlayers(n)}
        />
      </Stack>
    );
  };

  toggleTeam = (n: number) => (ev: any) => {
    const currTeam = this.state.teams[String(n)];
    const team = {
      ...currTeam,
      disabled: !currTeam.disabled,
    };
    const teams = {
      ...this.state.teams,
      [String(n)]: team,
    };
    this.setState({ teams });
  };

  updatePlayers = (n: number) => (items: string[]) => {
    const currTeam = this.state.teams[String(n)];
    const team = {
      ...currTeam,
      players: items,
    };
    if (items.length < 1) {
      team.disabled = true;
    }
    const teams = {
      ...this.state.teams,
      [String(n)]: team,
    };
    this.setState({ teams });
  };
}
