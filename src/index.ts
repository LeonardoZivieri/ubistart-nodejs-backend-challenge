import server from "./server";

server.listen(process.env.PORT || 8080, () => {
  console.log("Server Ready");
});
