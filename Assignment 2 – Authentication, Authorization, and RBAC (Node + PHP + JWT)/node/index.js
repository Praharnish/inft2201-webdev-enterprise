import http from "http";
import fs from "fs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "HarnishPrajapati1234@";

http
  .createServer((req, res) => {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello Apache!\n");

      return;
    }

    if (req.method === "POST") {
      if (req.url === "/login") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          try {
            body = JSON.parse(body);

            const { username, password } = body;

            // read users.txt
            const users = fs.readFileSync("./users.txt", "utf-8").split("\n");

            let userFound = null;

            for (let line of users) {
              if (!line.trim()) continue;

              // IMPORTANT: correct order
              const [userId, fileUsername, filePassword, role] = line.split(",");

              if (username === fileUsername) {
                userFound = { userId, filePassword, role };
                break;
              }
            }

            // user not found
            if (!userFound) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              return res.end(`${username} not found\n`);
            }

            // wrong password
            if (password !== userFound.filePassword) {
              res.writeHead(401, { "Content-Type": "text/plain" });
              return res.end("Invalid password\n");
            }

            // success → create JWT
            const token = jwt.sign(
              {
                userId: parseInt(userFound.userId),
                role: userFound.role,
              },
              JWT_SECRET,
              { expiresIn: "1h" }
            );

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ token }));

          } catch (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Server error\n");
          }
        });
      }

      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found\n");
  })
  .listen(8000);

console.log("listening on port 8000");
