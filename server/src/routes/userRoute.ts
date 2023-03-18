import asyncHandler from 'express-async-handler';
import { Router } from 'express'
import { createUserHandler, listUsersHandler } from '../handlers/userHandler';
const router = Router()
router.get('/', asyncHandler(listUsersHandler))
router.post('/', asyncHandler(createUserHandler))
router.delete('/', asyncHandler(createUserHandler))
module.exports = router

