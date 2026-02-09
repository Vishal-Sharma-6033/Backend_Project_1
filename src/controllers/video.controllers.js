import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
// import {User} from "../models/user.model.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiErrors.js"


const getAllVideos=asyncHandler(async(req,res)=>{
    const videos=await Video.find().populate("owner","username avatar")
    res
    .status(200)
    .json(new ApiResponse(true,"All videos",videos))
})

const PublishVideo = asyncHandler(async (req, res) => {

    const { title, description, duration } = req.body;

    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailFile) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoUrl = await uploadOnCloudinary(videoFile.path, "videos");
    const thumbnailUrl = await uploadOnCloudinary(thumbnailFile.path, "thumbnails");

    const video = new Video({
    title,
    description,
    duration: videoUrl.duration, // optional auto duration
    videoFile: videoUrl.secure_url,
    thumbnail: thumbnailUrl.secure_url,
    owner: req.user._id
})


    await video.save();

    res.status(201).json(
        new ApiResponse(true, "Video published successfully", video)
    );
});


const getVideoById=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(id).populate("owner","username avatar")
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    res
    .status(200)
    .json(new ApiResponse(true,"Video details",video))
})

const updateVideo=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const { title, description } = req.body || {};

    console.log("BODY:", req.body);

    if(!title){
        throw new ApiError(400,"Title is required")
    }
    if(!description){
        throw new ApiError(400,"Description is required")
    }


    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(id)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(video.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to update this video")
    }
    video.title=title||video.title
    video.description=description||video.description
    await video.save()
    res
    .status(200)
    .json(new ApiResponse(true,"Video updated successfully",video))
})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(id)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(video.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to delete this video")
    }
    await video.deleteOne();

    res
    .status(200)
    .json(new ApiResponse(true,"Video deleted successfully"))
})

const toggleVideoStatus=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Invalid video id")
    }
    const video=await Video.findById(id)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(video.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"You are not authorized to update this video")
    }
    video.isPublic=!video.isPublic
    await video.save()
    res
    .status(200)
    .json(new ApiResponse(true,`Video is now ${video.isPublic?"public":"private"}`,video))
})


export {getAllVideos,PublishVideo,getVideoById,updateVideo,deleteVideo,toggleVideoStatus}

