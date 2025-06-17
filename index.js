const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto file
const packageDefinition = protoLoader.loadSync('todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const todosProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// Sample data with string IDs
const todos = [
    {
        id: '1', title: 'Todo1', content: 'Content of t1'
    },
    {
        id: '2', title: 'Todo2', content: 'Content of t2'
    }
];

server.addService(todosProto.TodoService.service, {
    ListTodos: (call, callback) => {
        callback(null, { todos: todos });
    },
    CreateTodo: (call, callback) => {
        let incomingNewTodo = call.request;
        todos.push(incomingNewTodo);
        callback(null, incomingNewTodo);
    },
    GetTodo: (call, callback) => {
        let todoId = call.request.id;
        const todo = todos.find(todo => todo.id === todoId);
        
        if (todo) {
            callback(null, todo);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Todo not found'
            });
        }
    }
});

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    server.start();
    console.log("Server started on port 50051");
});