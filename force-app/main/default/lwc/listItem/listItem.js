import { LightningElement ,api} from 'lwc';

export default class ListItem extends LightningElement {
      
  @api todoId;
  @api todoName;
  @api done = false;

  
  get containerClass() {
    return this.done ? "todo completed" : "todo upcoming";
  }
}