const Router = require("express").Router()
const { accessChat, createGroupChat, fetchChats, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatController")
const { protectRoute } = require("../middlewares/authmiddleware")


Router.post("/",protectRoute, accessChat)
Router.get("/",protectRoute, fetchChats)
Router.post("/group",protectRoute, createGroupChat)
Router.put("/rename",protectRoute, renameGroup)
Router.put("/groupadd",protectRoute, addToGroup)
Router.put("/groupremove",protectRoute, removeFromGroup)


module.exports = Router