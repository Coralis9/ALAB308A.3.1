// Importing database functions. DO NOT MODIFY THIS LINE.
// import { central, db1, db2, db3, vault } from "./databases.js";

// function getUserData(id) {
//   const dbs = {
//     db1: db1,
//     db2: db2,
//     db3: db3
//   };
// }
import { central, db1, db2, db3, vault } from "./databases.js";

async function getUserData(id) {
  try {
    if (typeof id !== "number" || id < 1 || id > 10) {
      throw new Error("Invalid Input -- Out of Range or Not a Number");
    }
    
    // Determine which database to use
    const dbName = await central(id);
    const dbs = { db1, db2, db3 };
    const selectedDb = dbs[dbName];

    if (!selectedDb) {
      throw new Error(`Database ${dbName} not found`);
    }
    
    // Fetch data concurrently
    const [userBasic, userPersonal] = await Promise.all([
      selectedDb(id),
      vault(id)
    ]);
    
    return {
      id,
      name: userPersonal.name,
      username: userBasic.username,
      email: userPersonal.email,
      address: userPersonal.address,
      phone: userPersonal.phone,
      website: userBasic.website,
      company: userBasic.company
    };
  } catch (error) {
    return Promise.reject(error.message);
  }
}

export default getUserData;