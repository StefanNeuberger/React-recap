package de.neuefische.backend.todo;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        name = "Todo",
        description = "Todo entity exposed through the API",
        requiredProperties = {"id", "description", "status"}
)
public record Todo(
        @Schema(description = "Unique identifier of the todo")
        String id,
        @Schema(description = "Human readable description")
        String description,
        @Schema(description = "Current status flag")
        TodoStatus status
) {

    Todo(
            String description,
            TodoStatus status
    ) {
        this(null, description, status);
    }


    public Todo withId(String id) {
        return new Todo(id, description, status);
    }
}
