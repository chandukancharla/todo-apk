// const express = require("express");
// const path = require("path");
// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");
// const dbPath = path.join(__dirname, "todoApplication.db");

// const app = express();
// app.use(express.json());

// let db = null;

// const initDbAndServer = async () => {
//   try {
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3000, () => {
//       console.log("Server Running at http://localhost:3000");
//     });
//   } catch (error) {
//     console.log(`DB Error: ${error.message}`);
//   }
// };

// initDbAndServer();

// const hasPriorityCategoryAndStatus = (request) => {
//   return (
//     request.category !== undefined &&
//     request.priority !== undefined &&
//     request.status !== undefined
//   );
// };
// const hasCategoryAndPriority = (request) => {
//   return request.category !== undefined && request.priority !== undefined;
// };
// const hasCategoryAndStatus = (request) => {
//   return request.category !== undefined && request.status !== undefined;
// };

// const hasPriorityAndStatus = (request) => {
//   return request.priority !== undefined && request.status !== undefined;
// };
// const hasPriority = (request) => {
//   return request.priority !== undefined;
// };
// const hasStatus = (request) => {
//   return request.status !== undefined;
// };
// const hasCategory = (request) => {
//   return request.category !== undefined;
// };

// const statusPattern = (status) => {
//   return status.replace("%20", " ");
// };

// app.get("/todos/", async (request, response) => {
//   let data = null;
//   let getTodosQuery = "";
//   const { search_q = "", priority, status, category } = request.query;

//   switch (true) {
//     case hasPriorityCategoryAndStatus(request.query):
//       status = statusPattern(status);
//       getTodosQuery = `
//       SELECT
//         *
//       FROM
//         todo
//       WHERE
//         todo LIKE '%${search_q}%'
//         AND status = '${status}'
//         AND category = '${category}'
//         AND priority = '${priority}';`;
//       break;
//     case hasCategoryAndPriority(request.query):
//       getTodosQuery = `
//         SELECT
//             *
//         FROM
//             todo
//         WHERE
//             todo LIKE '%${search_q}%'
//             AND category = '${status}'
//             AND priority = '${priority}';`;
//       break;
//     case hasCategoryAndStatus(request.query):
//       status = statusPattern(status);
//       getTodosQuery = `
//         SELECT
//             *
//         FROM
//             todo
//         WHERE
//             todo LIKE '%${search_q}%'
//             AND category = '${status}'
//             AND status = '${status}';`;
//       break;
//     case hasPriorityAndStatus(request.query):
//       status = statusPattern(status);
//       getTodosQuery = `
//       SELECT
//         *
//       FROM
//         todo
//       WHERE
//         todo LIKE '%${search_q}%'
//         AND status = '${status}'
//         AND priority = '${priority}';`;
//       break;
//     case hasPriority(request.query):
//       getTodosQuery = `
//       SELECT
//         *
//       FROM
//         todo
//       WHERE
//         todo LIKE '%${search_q}%'
//         AND priority = '${priority}';`;
//       break;
//     case hasStatus(request.query):
//       status = statusPattern(status);
//       getTodosQuery = `
//       SELECT
//         *
//       FROM
//         todo
//       WHERE
//         todo LIKE '%${search_q}%'
//         AND status = '${status}';`;
//       break;
//     case hasCategory(request.query):
//       getTodosQuery = `
//       SELECT
//         *
//       FROM
//         todo
//       WHERE
//         todo LIKE '%${search_q}%'
//         AND category = '${status}';`;
//       break;
//     default:
//       getTodosQuery = `
//       SELECT
//         *
//       FROM
//         todo
//       WHERE
//         todo LIKE '%${search_q}%';`;
//   }

//   data = await db.all(getTodosQuery);
//   response.send(data);
// });

// // 2nd API

// app.get("/todos/:todoId/", async (request, response) => {
//   const { todoId } = request.params;

//   const getTodoQuery = `
//     SELECT
//       *
//     FROM
//       todo
//     WHERE
//       id = ${todoId};`;
//   const todo = await db.get(getTodoQuery);
//   response.send(todo);
// });

// // 3rd API

// app.get("/agenda/", async (request, response) => {
//   const { date } = request.query;
//   const getTodoQuery = `
//     SELECT
//         *
//     FROM
//         todo
//     WHERE
//         due_date = '${date}';`;
//   const todoResponse = await db.all(getTodoQuery);
//   response.send(todoResponse);
// });

// // 4th API

// app.post("/todos/", async (request, response) => {
//   const { id, todo, priority, status, category, dueDate } = request.body;
//   const postTodoQuery = `
//   INSERT INTO
//     todo (id, todo, priority, status, category, due_date)
//   VALUES
//     (${id}, '${todo}', '${priority}', '${status}'), '${category}', '${dueDate}';`;
//   await db.run(postTodoQuery);
//   response.send("Todo Successfully Added");
// });

// // 5th API

// app.put("/todos/:todoId/", async (request, response) => {
//   const { todoId } = request.params;
//   let updateColumn = "";
//   const requestBody = request.body;
//   switch (true) {
//     case requestBody.status !== undefined:
//       updateColumn = "Status";
//       break;
//     case requestBody.priority !== undefined:
//       updateColumn = "Priority";
//       break;
//     case requestBody.category !== undefined:
//       updateColumn = "Category";
//       break;
//     case requestBody.dueDate !== undefined:
//       updateColumn = "DueDate";
//       break;
//     case requestBody.todo !== undefined:
//       updateColumn = "Todo";
//       break;
//   }
//   const previousTodoQuery = `
//     SELECT
//       *
//     FROM
//       todo
//     WHERE
//       id = ${todoId};`;
//   const previousTodo = await db.get(previousTodoQuery);

//   const {
//     todo = previousTodo.todo,
//     priority = previousTodo.priority,
//     status = previousTodo.status,
//     category = previousTodo.category,
//     dueDate = previousTodo.dueDate,
//   } = request.body;

//   const updateTodoQuery = `
//     UPDATE
//       todo
//     SET
//       todo='${todo}',
//       priority='${priority}',
//       status='${status}',
//       category = '${category}',
//       due_date = '${dueDate}'
//     WHERE
//       id = ${todoId};`;

//   await db.run(updateTodoQuery);
//   response.send(`${updateColumn} Updated`);
// });

// // 6th API

// app.delete("/todos/:todoId/", async (request, response) => {
//   const { todoId } = request.params;
//   const deleteTodoQuery = `
//   DELETE FROM
//     todo
//   WHERE
//     id = ${todoId};`;

//   await db.run(deleteTodoQuery);
//   response.send("Todo Deleted");
// });

// module.exports = app;

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");
const isMatch = require("date-fns/isMatch");
var isValid = require("date-fns/isValid");
const app = express();
app.use(express.json());

let database;
const initializeDBandServer = async () => {
  try {
    database = await open({
      filename: path.join(__dirname, "todoApplication.db"),
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DataBase error is ${error.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

//api 1

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryAndStatus = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndPriority = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

const hasSearchProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const outPutResult = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    priority: dbObject.priority,
    category: dbObject.category,
    status: dbObject.status,
    dueDate: dbObject.due_date,
  };
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status, category } = request.query;

  /** switch case  */
  switch (true) {
    //scenario 3
    /**----------- has priority and status -------- */
    case hasPriorityAndStatusProperties(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `
      SELECT * FROM todo  WHERE status = '${status}' AND priority = '${priority}';`;
          data = await database.all(getTodosQuery);
          response.send(data.map((eachItem) => outPutResult(eachItem)));
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;

    //scenario 5
    /** has  category and status  */
    case hasCategoryAndStatus(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `select * from todo where category='${category}' and status='${status}';`;
          data = await database.all(getTodosQuery);
          response.send(data.map((eachItem) => outPutResult(eachItem)));
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    //scenario 7
    /** has both category and priority */
    case hasCategoryAndPriority(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (
          priority === "HIGH" ||
          priority === "MEDIUM" ||
          priority === "LOW"
        ) {
          getTodosQuery = `select * from todo where category='${category}' and priority='${priority}';`;
          data = await database.all(getTodosQuery);
          response.send(data.map((eachItem) => outPutResult(eachItem)));
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    //scenario 2
    /**-------------- has only priority---------- */
    case hasPriorityProperty(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        getTodosQuery = `
      SELECT * FROM todo WHERE priority = '${priority}';`;
        data = await database.all(getTodosQuery);
        response.send(data.map((eachItem) => outPutResult(eachItem)));
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    //scenario 1
    /**-------------has only status ------------ */
    case hasStatusProperty(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        getTodosQuery = `SELECT * FROM todo WHERE status = '${status}';`;
        data = await database.all(getTodosQuery);
        response.send(data.map((eachItem) => outPutResult(eachItem)));
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    //has only search property
    //scenario 4
    case hasSearchProperty(request.query):
      getTodosQuery = `select * from todo where todo like '%${search_q}%';`;
      data = await database.all(getTodosQuery);
      response.send(data.map((eachItem) => outPutResult(eachItem)));
      break;
    //scenario 6
    //has only category
    case hasCategoryProperty(request.query):
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        getTodosQuery = `select * from todo where category='${category}';`;
        data = await database.all(getTodosQuery);
        response.send(data.map((eachItem) => outPutResult(eachItem)));
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    //default get all todos
    default:
      getTodosQuery = `select * from todo;`;
      data = await database.all(getTodosQuery);
      response.send(data.map((eachItem) => outPutResult(eachItem)));
  }
});

//api2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getToDoQuery = `select * from todo where id=${todoId};`;
  const responseResult = await database.get(getToDoQuery);
  response.send(outPutResult(responseResult));
});

//api3
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  console.log(isMatch(date, "yyyy-MM-dd"));
  if (isMatch(date, "yyyy-MM-dd")) {
    const newDate = format(new Date(date), "yyyy-MM-dd");
    console.log(newDate);
    const requestQuery = `select * from todo where due_date='${newDate}';`;
    const responseResult = await database.all(requestQuery);
    //console.log(responseResult);
    response.send(responseResult.map((eachItem) => outPutResult(eachItem)));
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//api4
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        if (isMatch(dueDate, "yyyy-MM-dd")) {
          const postNewDueDate = format(new Date(dueDate), "yyyy-MM-dd");
          const postTodoQuery = `
  INSERT INTO
    todo (id, todo, category,priority, status, due_date)
  VALUES
    (${id}, '${todo}', '${category}','${priority}', '${status}', '${postNewDueDate}');`;
          await database.run(postTodoQuery);
          //console.log(responseResult);
          response.send("Todo Successfully Added");
        } else {
          response.status(400);
          response.send("Invalid Due Date");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    response.status(400);
    response.send("Invalid Todo Priority");
  }
});

//api5
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  console.log(requestBody);
  const previousTodoQuery = `SELECT * FROM todo WHERE id = ${todoId};`;
  const previousTodo = await database.get(previousTodoQuery);
  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
    category = previousTodo.category,
    dueDate = previousTodo.dueDate,
  } = request.body;

  let updateTodoQuery;
  switch (true) {
    // update status
    case requestBody.status !== undefined:
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        updateTodoQuery = `
    UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
     due_date='${dueDate}' WHERE id = ${todoId};`;

        await database.run(updateTodoQuery);
        response.send(`Status Updated`);
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    //update priority
    case requestBody.priority !== undefined:
      if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
        updateTodoQuery = `
    UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
     due_date='${dueDate}' WHERE id = ${todoId};`;

        await database.run(updateTodoQuery);
        response.send(`Priority Updated`);
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    //update todo
    case requestBody.todo !== undefined:
      updateTodoQuery = `
    UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
     due_date='${dueDate}' WHERE id = ${todoId};`;

      await database.run(updateTodoQuery);
      response.send(`Todo Updated`);
      break;

    //update category
    case requestBody.category !== undefined:
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        updateTodoQuery = `
    UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
     due_date='${dueDate}' WHERE id = ${todoId};`;

        await database.run(updateTodoQuery);
        response.send(`Category Updated`);
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    //update due date
    case requestBody.dueDate !== undefined:
      if (isMatch(dueDate, "yyyy-MM-dd")) {
        const newDueDate = format(new Date(dueDate), "yyyy-MM-dd");
        updateTodoQuery = `
    UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
     due_date='${newDueDate}' WHERE id = ${todoId};`;

        await database.run(updateTodoQuery);
        response.send(`Due Date Updated`);
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
      break;
  }

  /*updateTodoQuery = `
      UPDATE todo SET todo='${todo}', priority='${priority}', status='${status}', category='${category}',
       due_date='${dueDate}' WHERE id = ${todoId};`;
    const responseData = await database.run(updateTodoQuery);
    response.send(`${updateColumn} Updated`);*/
});

//api6

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;

  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
