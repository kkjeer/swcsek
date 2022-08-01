import * as React from "react";
import { Bank } from "./Bank";
import { ITeam } from "./constants";
import { Setup } from "./Setup";

export type Page = "setup" | "bank";

interface IMonopolyProps {}

interface IMonopolyState {
  page: Page;
  startMoney: number;
  teams: ITeam[];
}

export class Monopoly extends React.Component<IMonopolyProps, IMonopolyState> {
  constructor(props: IMonopolyProps) {
    super(props);

    this.state = {
      page: "setup",
      startMoney: 0,
      teams: [],
    };
  }

  render() {
    const { page, startMoney, teams } = this.state;

    return (
      <>
        {page === "setup" && <Setup onStart={this.startGame} />}
        {page === "bank" && <Bank startMoney={startMoney} teams={teams} />}
      </>
    );
  }

  startGame = (startMoney: number, teams: ITeam[]) => {
    this.setState({ page: "bank", startMoney, teams });
  };
}
