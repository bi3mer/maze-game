import { Component } from "../Engine/Component";

export class Render extends Component {
    constructor(
        public color: string, 
        public offset: number, 
        public size: number) { 
        super(); 
    }
}