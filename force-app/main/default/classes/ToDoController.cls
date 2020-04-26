public with sharing class ToDoController {
    
    @AuraEnabled
    public static string addTodo(string payload){
        Todo payloadObject=(Todo)JSON.deserialize(payload,ToDo.class);
        Sobject tsk=(Sobject)Type.forName('ToDo__c').newInstance();
        tsk.put('Name',payloadObject.todoName);
        tsk.put('Done__c',payloadObject.done);
        insert tsk;
        return String.valueOf(tsk.Id);
    }
    @AuraEnabled
    public static void updateTodo(String payload){
        Todo payloadObject=(Todo)JSON.deserialize(payload,ToDo.class);
        Sobject tsk=(Sobject)Type.forName('ToDo__c').newInstance();
        tsk.put('Name',payloadObject.todoName);
        tsk.put('Done__c',payloadObject.done);
        tsk.put('Id',payloadObject.id);
        update tsk;
    }
    @AuraEnabled
    public static void deleteTodo(String todoId) {
      SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
      todo.put('Id', todoId);
  
      delete todo;
    }
    @AuraEnabled
    public static List<ToDo> getAllTodos() {
      List<SObject> todos = Database.query(
        'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC'
      );
  
      return getToDos(todos);
    }
    @AuraEnabled
  public static List<ToDo> getCurrentTodos() {
    List<SObject> todos = Database.query(
      'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC'
    );
    return getToDos(todos);
  }

  //Wrap ToDo__c SObject into ToDo object
  public static List<ToDo> getToDos(List<SObject> objs) {
    List<ToDo> todos = new List<ToDo>();
    for (SObject obj : objs) {
      ToDo todo = new ToDo();
      todo.id = obj.Id;
      todo.todoName = String.valueOf(obj.get('Name'));
      todo.todoDate = Date.valueOf(obj.get('CreatedDate'));
      todo.done = Boolean.valueOf(obj.get('Done__c'));
      todos.add(todo);
    }

    return todos;
  }
    class ToDo{
        @AuraEnabled
        public string id;
        @AuraEnabled
        public string todoName;
        @AuraEnabled
        public Date todoDate;
        @AuraEnabled
        public Boolean done;

            
        }
    }

