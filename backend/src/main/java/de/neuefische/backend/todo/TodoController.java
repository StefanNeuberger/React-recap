package de.neuefische.backend.todo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
@Tag(name = "Todos", description = "CRUD operations for todo items")
class TodoController {

    private final TodoService todoService;

    TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    @Operation(summary = "Fetch all todos", description = "Returns every todo entry.")
    @ApiResponse(responseCode = "200", description = "Todos retrieved",
            content = @Content(mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Todo.class))))
    List<Todo> getAll() {
        return todoService.getAll();
    }

    @PostMapping
    @Operation(summary = "Create a new todo", description = "Persists a new todo entry.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Todo created",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Todo.class))),
            @ApiResponse(responseCode = "400", description = "Invalid todo payload",
                    content = @Content)
    })
    Todo postTodo(@RequestBody Todo todo) {
        return todoService.save(todo);
    }

    @GetMapping("{id}")
    @Operation(summary = "Fetch a todo by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Todo found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Todo.class))),
            @ApiResponse(responseCode = "404", description = "Todo not found",
                    content = @Content)
    })
    Todo getTodoById(
            @Parameter(description = "Identifier of the todo to fetch", required = true)
            @PathVariable String id) {
        return todoService.getById(id);
    }

    @PutMapping(path = {"{id}/update", "{id}"})
    @Operation(summary = "Update an existing todo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Todo updated",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Todo.class))),
            @ApiResponse(responseCode = "400", description = "Mismatched ids between path and payload",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Todo not found",
                    content = @Content)
    })
    Todo update(
            @Parameter(description = "Identifier of the todo to update", required = true)
            @PathVariable String id,
            @RequestBody Todo todo) {
        if (!todo.id().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The id in the url does not match the request body's id");
        }
        return todoService.update(todo);
    }

    @DeleteMapping("{id}")
    @Operation(summary = "Delete a todo by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Todo deleted", content = @Content),
            @ApiResponse(responseCode = "404", description = "Todo not found", content = @Content)
    })
    void delete(
            @Parameter(description = "Identifier of the todo to delete", required = true)
            @PathVariable String id) {
        todoService.delete(id);
    }
}
