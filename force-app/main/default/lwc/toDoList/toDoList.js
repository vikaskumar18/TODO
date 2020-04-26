import { LightningElement,wire,api } from 'lwc';
import getAllTodos from "@salesforce/apex/ToDoController.getAllTodos";
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

export default class ToDoList extends LightningElement {
@api todos;
@wire(CurrentPageReference)
wiredPageRef(pageRef) {
//console.log(pageRef);
this.pageRef = pageRef;

    registerListener('childevent', this.handleAllEvents, this);
    registerListener('notify', this.handleAllEvents, this);
    
  
}
handleAllEvents(event)
{

  console.log('Called by the Todo manager invoking the todo lIst update');
  this.fetchAllTodos();

}
connectedCallback()
{
this.fetchAllTodos();
}
fetchAllTodos()
{
  getAllTodos().then(data=>{
    this.groupTodos(data);

  }).catch(error=>{
    console.error("error in loding the data"+error);
  })

}
   /* @wire(getAllTodos)
  parseTodos({ data, error }) {
    console.log(data);
      if (data) {
        console.log("data is comign");
      this.groupTodos(data);
    } else if (error) {
      console.error("error in loding the data"+error);
    }
  }*/
  groupTodos(todos) {
console.log("data is grouped")
  if (todos) {
    console.log("inside group if")
    const todoWrap = new Map();
    todos.forEach(todo => {
      if (!todoWrap.has(todo.todoDate)) {
        todoWrap.set(todo.todoDate, []);
      }
      todoWrap.get(todo.todoDate).push(todo);
    });

    const todoList = [];
    for (let key of todoWrap.keys()) {
      const todoItem = { date: key, items: todoWrap.get(key) };
      todoList.push(todoItem);
    }
    this.todos = todoList;
  }
}
}
