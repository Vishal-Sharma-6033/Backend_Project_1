import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { deleteVideo, getAllVideos, getVideoById, PublishVideo, toggleVideoStatus, updateVideo } from "../controllers/video.controllers.js";

const router = Router();
router.use(verifyJWT)

router.route("/").get(getAllVideos).post(
    upload.fields([
        {name:"videoFile",maxCount:1},
        {name:"thumbnail",maxCount:1}
    ]),
    PublishVideo
)

router.route("/:id").get(getVideoById)
router.route("/:id").patch(updateVideo)
router.route("/:id").delete(deleteVideo)

router.route("/:id/toggle-status").patch(toggleVideoStatus)

export default router;