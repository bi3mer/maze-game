import { Component } from "../Engine/Component";

export class Position extends Component {
  public oldX: number;
  public oldY: number;

  constructor(public x: number, public y: number) { 
    super(); 

    this.oldX = x;
    this.oldY = y;
  }

  public equals(other: Position): boolean {
    return this.x == other.x && this.y == other.y;
  }
}