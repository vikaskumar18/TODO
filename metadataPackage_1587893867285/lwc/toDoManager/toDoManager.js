import { LightningElement, track,wire } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';

import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';
export default class ToDoManager extends LightningElement {
    @track pageRef;
    @wire(CurrentPageReference)
    wiredPageRef(pageRef) {
    //console.log(pageRef);
    this.pageRef = pageRef;
    
        registerListener('childevent', this.handleChildEvent, this);
      
  }
  handleChildEvent(event)
  {
    console.log(event);
    this.fetchTodos();
  }

@track CurrentTime;
@track greeting;   
@track taskname;
@track todos=[];
    populateTodos()
    {
        const todo=[
            {
                id:0,
                todoName:"Wash The Car",
                done:false,
                todoDate:new Date()
            },
            {
                id:1,
                todoName:"Eat the Dinner",
                done:false,
                todoDate:new Date()
            },
            {
                id:2,
                todoName:"Sleep after this",
                done:true,
                todoDate:new Date()
            },
            {
                id:3,
                todoName:"Solve Bugs",
                done:true,
                todoDate:new Date()
            }
        ];
        this.todos=todo;
    }
    setTime()
    {
        let da= new Date();
        
        let hour=da.getHours();
        this.greeting=hour<12?'Good Morning!':hour>=12&&hour<15?'Good After Noon':hour>=15&&hour<19?'Good Evening':'Good Night';
        let ampm=hour>12?'PM':'AM';
        let minute=da.getMinutes();
        let seconds=da.getSeconds();
         hour= hour>12?hour-12:hour<10?'0'+hour:hour;
        this.CurrentTime=`${hour}:${minute}:${seconds}:${ampm}`
       // this.CurrentTime= hour+':'+minute+':'+seconds+'  '+ampm;
    }
    sutUpDetails(dogDtl){
        this.fetchTodos();
        this.details = dogDtl;
    }
    connectedCallback()
    {
        //Calling the TImeset Function for every 1 sec
        setInterval(()=>{
            this.setTime();
        },1000

        )
        this.fetchTodos();
      
         //    registerListener("TaskUpdate", this.sutUpDetails, this);
  
        //this.populateTodos();

    }
    refetchTodos(event)
    {
        this.fetchTodos();
    }
    addTodohandler()
    {
        let x=this.template.querySelector('lightning-input');
       // console.log(x.value);
        let todo={
            
            todoName:x.value,
            done:false,
            

        }
        addTodo({payload:JSON.stringify(todo)}).then(data=>{
            console.log("inserted"+data);
            this.fetchTodos();
            this.upcomingTasks;
            console.log('firing the event to notify')
            fireEvent(this.pageRef, 'notify', 'Alerting the todolist');

        }

        ).catch(error=>{

            console.log(error)
        })
       // this.todos.push(todo);
       x.value=""
    }
    get upcomingTasks()
    {
        return this.todos&& this.todos.length?this.todos.filter(todo => !todo.done):[]
    }
    get completedTasks()
    {
        return this.todos&& this.todos.length?this.todos.filter(todo => todo.done):[]
    }
    fetchTodos()
    {
        getCurrentTodos().then(data=>{
            this.todos=data?data:[];
        }

        ).catch(error=>{
            console.log("error has occured error "+error)

        })
    }

}