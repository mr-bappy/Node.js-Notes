import { eq } from "drizzle-orm";
import { db } from "./config/db.js";
import { usersTable } from "./schema/schema.js";

const main = async () => {

    // insert 
    // single data
    // const insertUser = await db.insert(usersTable).values({
    //     name: "vishal",
    //     age: 20,
    //     email: "vishal@gmail.com"
    // });

    // multiple data
    // const insertUser = await db.insert(usersTable).values([
    //     {
    //         name: "lalit",
    //         age: 20,
    //         email: "lalit@gmail.com"
    //     },
    //     {
    //         name: "akash",
    //         age: 20,
    //         email: "akash@gmail.com"
    //     },
    //     {
    //         name: "harshal",
    //         age: 20,
    //         email: "harshal@gmail.com"
    //     },
    // ]);
    // console.log(insertUser);

    // read 
    // all data
    // const users = await db.select().from(usersTable);
    // const users = await db.select().from(usersTable).where({
    //     email: "vishal@gmail.com"
    // });
    // console.log(users);

    // update
    // const updateData = await db.update(usersTable).set({
    //     email: "vishal@admin.com"
    // }).where({
    //     name: "vishal"
    // });
    // console.log(updateData);

    // const updateData = await db.update(usersTable).set({
    //     email: "vishal@boss.com"
    // }).where(eq(usersTable.name, "vishal"));
    // console.log(updateData);

    // delete
    // const deleteData = await db.delete(usersTable).where({
    //     email: "harshal@gmail.com"
    // });
    const deleteData = await db.delete(usersTable).where(eq(usersTable.email, "akash@gmail.com"));
    console.log(deleteData);

}

main()
    .catch((error) => 
        (console.error(error))
    );