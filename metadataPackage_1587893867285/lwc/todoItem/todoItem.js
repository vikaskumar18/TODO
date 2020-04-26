import { LightningElement, api,wire } from 'lwc';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
export default class TodoItem extends LightningElement {
    @api todoname;
    @api todoId;
    @api done;
    @api key;
    @wire(CurrentPageReference) pageRef;
    get containerClass()
    {
        return this.done?"todo completed":"todo upcoming";
    }
    updateHandler()
    {
        let todo={
            id:this.todoId,
            done:!this.done,
            todoName:this.todoname
        }
        updateTodo({payload:JSON.stringify(todo)}).then(data=>
            {
                console.log('Successfully update '+data)
                fireEvent(this.pageRef, 'childevent', 'updating from child');
               /* const updateEvent = new CustomEvent("update", { detail: todo });
                this.dispatchEvent(updateEvent);*/
            }).catch(error=>
                {
                    console.log('Error has accoured While Updating'+error)
                })
               
    }
    deleteHandler()
    {
        deleteTodo({todoId:this.todoId}).then(data=>
            {
                console.log('Success ful in deleting')
                fireEvent(this.pageRef, 'childevent', 'deleting from child');
               // this.dispatchEvent(new CustomEvent("delete", { detail: this.todoId }));
            }).catch(error=>
                {
                    Console.log('Error in deleting'+error)
                });
    }
}