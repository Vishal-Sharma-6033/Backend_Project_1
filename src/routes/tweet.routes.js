import Router from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTweet, deleteTweet, getUserTweet, updateTweet } from "../controllers/tweet.controllers.js";

const router=Router()
router.use(verifyJWT)

router.route("/").post(createTweet)
router.route("/:id").delete(deleteTweet)
router.route("/:id").patch(updateTweet)
router.route("/:id").get(getUserTweet)

export default router;