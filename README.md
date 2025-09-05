# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Features

### Event Management

#### Event Creation

##### Purpose

Allows users to add new events to the calendar.

##### Components

- `CalendarScreen.tsx`: The main screen that orchestrates the feature.
- `InteractiveCalendar.tsx`: The component that displays the calendar grid and the events.
- `AddEventModal.tsx`: The modal form for adding new events.

##### State Management

- `calendarStore.tsx`: The Zustand store that manages the events data. It now includes a `createEvent` function that handles the optimistic UI flow.

##### Custom Hooks

- `useOptimisticEventCreation.ts`: A custom hook that encapsulates the logic for optimistic event creation.

##### User Interaction Flow

1.  User clicks on a day in the `InteractiveCalendar`.
2.  The `AddEventModal` opens.
3.  User fills in the event details and clicks "Save".
4.  The `useOptimisticEventCreation` hook is called.
5.  A temporary UUID is generated for the new event, and it is immediately added to the local `calendarStore`.
6.  The `InteractiveCalendar` re-renders to display the new event (optimistic UI).
7.  In the background, a `POST` request is sent to the server to save the event to the database.
8.  Once the server responds with the permanent event data (including the database-generated `id`), the local `calendarStore` is updated with the permanent data.
9.  If the server request fails, the temporary event is removed from the `calendarStore` and an error is displayed.

##### Flow Diagram

```mermaid
graph TD
    A[User clicks on a day] --> B{AddEventModal opens};
    B --> C{User fills form};
    C --> D[User clicks 'Save'];
    D --> E{useOptimisticEventCreation hook called};
    E --> F{Generate temporary UUID};
    F --> G{Add event to local store};
    G --> H[InteractiveCalendar re-renders];
    G --> I{Send POST request to server};
    I --> J{Server saves event};
    J --> K{Server responds with permanent event};
    K --> L{Update local store with permanent event};
    I --> M{Handle server error};
    M --> N{Remove temporary event from local store};
```

#### Event Update

##### Purpose

Allows users to edit existing events on the calendar.

##### Components

- `InteractiveCalendar.tsx`: The component that displays the calendar grid and the events.
- `UpdateEventModal.tsx`: The modal form for editing existing events.

##### Custom Hooks

- `useOptimisticEventUpdate.ts`: A custom hook that encapsulates the logic for optimistic event updates.

##### User Interaction Flow

1.  User clicks on a day with existing events in the `InteractiveCalendar`.
2.  The `UpdateEventModal` opens, displaying the details of the events for that day.
3.  User edits the event details and clicks "Update".
4.  The `useOptimisticEventUpdate` hook is called for each modified event.
5.  The local `calendarStore` is immediately updated with the new event data (optimistic UI).
6.  The `InteractiveCalendar` re-renders to display the updated event information.
7.  In the background, a `PATCH` request is sent to the server to save the changes to the database.
8.  If the server request fails, the original event data is restored in the `calendarStore`.

##### Flow Diagram

```mermaid
graph TD
    A[User clicks on a day with events] --> B{UpdateEventModal opens};
    B --> C{User edits form};
    C --> D[User clicks 'Update'];
    D --> E{useOptimisticEventUpdate hook called for each modified event};
    E --> F{Update event in local store};
    F --> G[InteractiveCalendar re-renders];
    F --> H{Send PATCH request to server};
    H --> I{Server updates event};
    I --> J{Handle server success};
    H --> K{Handle server error};
    K --> L{Restore original event in local store};
```

#### Event Deletion

##### Purpose

Allows users to delete existing events from the calendar.

##### Components

- `UpdateEventModal.tsx`: The modal form where the delete option is present.

##### Custom Hooks

- `useOptimisticEventDeletion.ts`: A custom hook that encapsulates the logic for optimistic event deletion.

##### User Interaction Flow

1.  User clicks on the delete icon next to an event in the `UpdateEventModal`.
2.  The `useOptimisticEventDeletion` hook is called.
3.  The event is immediately removed from the local `calendarStore` (optimistic UI).
4.  The `UpdateEventModal` re-renders to remove the deleted event from the list.
5.  In the background, a `DELETE` request is sent to the server to delete the event from the database.
6.  If the server request fails, the deleted event is restored in the `calendarStore`.

##### Flow Diagram

```mermaid
graph TD
    A[User clicks delete icon] --> B{useOptimisticEventDeletion hook called};
    B --> C{Remove event from local store};
    C --> D[UpdateEventModal re-renders];
    C --> E{Send DELETE request to server};
    E --> F{Server deletes event};
    F --> G{Handle server success};
    E --> H{Handle server error};
    H --> I{Restore deleted event in local store};
```

### Calendar Navigation

#### Purpose

Allows users to navigate between different months in the calendar.

#### Components

- `CalendarScreen.tsx`: The main screen that orchestrates the feature.
- `Dropdown.tsx`: The component that displays the month selection dropdown.

#### State Management

- `calendarStore.tsx`: The Zustand store that manages the selected month.

#### User Interaction Flow

1.  User clicks on the month selection dropdown.
2.  A list of months is displayed.
3.  User selects a new month.
4.  The `setSelectedMonth` action is called in the `calendarStore`.
5.  The `InteractiveCalendar` re-renders to display the events for the selected month.

#### Flow Diagram

```mermaid
graph TD
    A[User clicks on month dropdown] --> B{List of months displayed};
    B --> C{User selects a new month};
    C --> D{setSelectedMonth action called};
    D --> E[InteractiveCalendar re-renders];
```

## Supporting Modules

### Data Models

```mermaid
erDiagram
    Event {
        string id
        string title
        string description
        string startTime
        string endTime
        string emoji
        date date
    }

    NewEvent {
        string title
        string description
        string startTime
        string endTime
        string emoji
    }

    NewEventRequest {
        string title
        string description
        string start_time
        string end_time
        string emoji
    }

    InteractiveDay {
        string date
        Event[] events
    }

    InteractiveDay ||--o{ Event : contains
```

- `Event`: Represents an event on the calendar.
- `NewEvent`: Represents a new event that has not yet been saved to the database.
- `NewEventRequest`: Represents the payload for creating a new event, with snake_case properties.
- `InteractiveDay`: Represents a day in the calendar, containing a date and a list of events.
- `DropdownOption`: Represents an option in a dropdown menu.
- `FormErrors`: Represents the errors in a form.
- `TextAndIcon`: Represents a text and an icon.
- `TMonths`: Represents the months of the year.

### Services

- `eventService.ts`: A service that handles all API calls related to events.
- `utils.ts`: A utility file containing helper functions for services, such as `camelToSnakeCase`.

### Helpers and Utilities

- `cn`: A utility function for conditionally joining class names.
- `getDaysInMonth`: Returns an array of dates for a given month and year.
- `checkForValidDate`: Checks if a given date string is a valid date.
- `immutableStateUpdateFactory`: A factory function that returns a function that updates the state of a component in an immutable way.
- `getCleanCalendarDays`: Returns an array of `InteractiveDay` objects for a given month.
- `customResolver`: A custom resolver for `react-hook-form` that validates that all fields are filled.
- `monthsDropdownOptions`: An array of `DropdownOption` objects for the months of the year.
- `emojisDropdownOptions`: An array of `DropdownOption` objects for the available emojis.
- `currentMonth`: The current month as a string.

### Enums

- `APP_ROUTES`: An object containing the routes of the application.
- `MONTHS`: An object containing the months of the year.

### Higher-Order Components (HOCs)

- `withDropdownController`: A HOC that connects a `Dropdown` component to a `react-hook-form` controller.