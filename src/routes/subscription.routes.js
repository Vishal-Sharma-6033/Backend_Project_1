import Router from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getSubscribedChannel, getUserchannelSubscription, toggleSubscription } from "../controllers/subscriber.controllers.js";

const router=Router();
router.use(verifyJWT)

router
  .route("/channel/:channelId")
  .get(getUserchannelSubscription)
  .post(toggleSubscription);

router
  .route("/user/:subscriberId")
  .get(getSubscribedChannel);

export default router;