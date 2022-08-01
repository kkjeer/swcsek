import abandonedhall from "./images/Abandoned Hall.jpg";
import aldentown from "./images/Aldentown.jpg";
import campfire from "./images/Campfire.jpg";
import castlegates from "./images/Castle Gates.jpg";
import castle from "./images/castle.jpg";
import citadal from "./images/Citadal.jpg";
import dragonflywings from "./images/dragonfly-wings.jpg";
import eastell from "./images/Eastell.jpg";
import frostbittenmountains from "./images/Frostbitten Mountains.jpg";
import graysenshouse from "./images/Graysen's House.jpg";
import helotown from "./images/Helotown.jpg";
import incantusoutpost from "./images/Incantus Outpost.jpg";
import initiationtower from "./images/Initiation Tower.jpg";
import ironisle from "./images/Ironisle.jpg";
import jynxsroom from "./images/Jynx's Room.jpg";
import keystree from "./images/Key's Tree.jpg";
import library from "./images/Library.jpg";
import loredom from "./images/Loredom.jpg";
import morrowsterritory from "./images/Morrow's Territory.jpg";
import northell from "./images/Northell.jpg";
import novelis from "./images/Novelis.jpg";
import nymshut from "./images/Nym's Hut.jpg";
import pellinglow from "./images/Pellinglow.jpg";
import pineforest from "./images/Pine Forest.jpg";
import rowandom from "./images/Rowandom.jpg";
import royalstables from "./images/Royal Stables.jpg";
import shadolantree from "./images/Shadolan Tree.jpg";
import silverfell from "./images/Silverfell.jpg";
import southell from "./images/Southell.jpg";
import thecrypt from "./images/The Crypt.jpg";
import trainingsite from "./images/Training Site.jpg";
import undergroundhold from "./images/Underground Hold.jpg";
import waterfall from "./images/Waterfall.jpg";
import westell from "./images/Westell.jpg";
import wildlands from "./images/Wildlands.jpg";
import wrelicsroom from "./images/Wrelic's Room.jpg";

export function getImage(name: string) {
  switch (name) {
    case "Abandoned Hall":
      return abandonedhall;
    case "Aldentown":
      return aldentown;
    case "Campfire":
      return campfire;
    case "Castle Gates":
      return castlegates;
    case "castle":
      return castle;
    case "Citadal":
      return citadal;
    case "dragonfly-wings":
      return dragonflywings;
    case "Eastell":
      return eastell;
    case "Frostbitten Mountains":
      return frostbittenmountains;
    case "Graysen's House":
      return graysenshouse;
    case "Helotown":
      return helotown;
    case "Incantus Outpost":
      return incantusoutpost;
    case "Initiation Tower":
      return initiationtower;
    case "Ironisle":
      return ironisle;
    case "Jynx's Room":
      return jynxsroom;
    case "Key's Tree":
      return keystree;
    case "Library":
      return library;
    case "Loredom":
      return loredom;
    case "Morrow's Territory":
      return morrowsterritory;
    case "Northell":
      return northell;
    case "Novelis":
      return novelis;
    case "Nym's Hut":
      return nymshut;
    case "Pellinglow":
      return pellinglow;
    case "Pine Forest":
      return pineforest;
    case "Rowandom":
      return rowandom;
    case "Royal Stables":
      return royalstables;
    case "Shadolan Tree":
      return shadolantree;
    case "Silverfell":
      return silverfell;
    case "Southell":
      return southell;
    case "The Crypt":
      return thecrypt;
    case "Training Site":
      return trainingsite;
    case "Underground Hold":
      return undergroundhold;
    case "Waterfall":
      return waterfall;
    case "Westell":
      return westell;
    case "Wildlands":
      return wildlands;
    case "Wrelic's Room":
      return wrelicsroom;
  }
}
