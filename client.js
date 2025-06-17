const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the proto file
const packageDefinition = protoLoader.loadSync('todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const todosProto = grpc.loadPackageDefinition(packageDefinition);

// Create client stub
const client = new todosProto.TodoService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

// Helper function to handle responses
function handleResponse(err, response) {
    if (err) {
        console.error('Error:', err.message);
        return;
    }
    console.log('Response:', response);
}

// Client methods
function listTodos() {
    console.log('Listing all todos...');
    client.ListTodos({}, handleResponse);
}

function createTodo(id, title, content = '') {
    console.log('Creating new todo...');
    const todo = {
        id,
        title,
        content
    };
    client.CreateTodo(todo, handleResponse);
}

function getTodo(id) {
    console.log(`Getting todo with id ${id}...`);
    client.GetTodo({ id }, handleResponse);
}

// Example usage
function runExamples() {
    // List existing todos
    listTodos();

    // Create a new todo
    createTodo('3', 'Todo3', 'Content for todo 3');

    // Get a specific todo
    setTimeout(() => {
        getTodo('1'); // Existing todo
        getTodo('99'); // Non-existent todo
    }, 1000); // Small delay to ensure create completes
}

runExamples();