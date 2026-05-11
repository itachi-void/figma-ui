
import { userService } from "./src/app/services/userService";

async function check() {
  try {
    const users = await userService.getAllUsers();
    console.log("USERS:", JSON.stringify(users[0], null, 2));
  } catch (e) {
    console.error("ERROR:", e);
  }
}

// This is just a scratch script, I can't run it directly easily without a setup.
// I'll just use the information I have.
