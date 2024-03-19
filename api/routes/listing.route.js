import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteUserListing, getListing, getListings, updateUserListing } from '../controllers/listing.controller.js';

const router = express.Router()

router.post('/create', verifyToken, createListing)

router.delete('/delete/:id', verifyToken, deleteUserListing)

router.post('/update/:id', verifyToken, updateUserListing)

router.get('/get/:id', getListing)

router.get('/get', getListings)

export default router;