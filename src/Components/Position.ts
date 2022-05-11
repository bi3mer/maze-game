import { Component } from "../Engine/Component";

export class Position extends Component {
    constructor(public x: number, public y: number) { 
        super(); 
    }
}