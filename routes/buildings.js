const express = require('express')
const middleware = require('../middlewares')
const validator = require('../validators/building')
const BuildingsController = require('../controllers/BuildingsController')
const DevicesController = require('../controllers/DevicesController')

const router = express.Router()

/**
 * Normal user
 *
 */
router.get('/:id/apartments', middleware.normalUser, BuildingsController.getApartments)
router.put('/:id/apartments/:apartmentCode/check-in', middleware.normalUser,  BuildingsController.checkIn);
router.put('/:id/apartments/:apartmentCode/check-out', middleware.normalUser,  BuildingsController.checkOut);
router.get('/:id/apartments/:apartmentCode', middleware.normalUser,  BuildingsController.getApartment)


/**
 * Admin user operations
 */
router.use(middleware.adminUser)
router.use(middleware.buildingModelRoute); //Pass Building Model Object
router.post('', validator.createBuilding, BuildingsController.create);
router.get('', BuildingsController.findAll);
router.get('/:id', BuildingsController.findById)
router.put('/:id', validator.updatingBuilding, BuildingsController.updateById)
router.delete('/:id', BuildingsController.deleteById)

/**
 * CRUD for devices
 */
router.get('/:id/apartments/:apartmentCode/devices', DevicesController.getDevices)
router.get('/:id/apartments/:apartmentCode/devices/:deviceCode', DevicesController.getDevice)
router.put('/:id/apartments/:apartmentCode/devices', validator.isUniqueDeviceCode, DevicesController.addDevice)
router.put('/:id/apartments/:apartmentCode/devices/:deviceCode', DevicesController.updateDevice);
router.delete('/:id/apartments/:apartmentCode/devices/:deviceCode', DevicesController.deleteDevice);

/**
 * CRUD for apartments
 */
router.put('/:id/apartments', validator.isUniqueApartmentCode, BuildingsController.addApartment)
router.delete('/:id/apartments/:apartmentCode', BuildingsController.deleteApartment);
router.put('/:id/apartments/:apartmentCode', BuildingsController.updateApartment);

module.exports = router;