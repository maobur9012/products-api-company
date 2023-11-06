import {Router} from 'express'
const router = Router()

import * as productsCtrl from '../controllers/products.controller'
import {authJwt} from '../middlewares'


//crear producto
router.post("/", [authJwt.verifyToken, authJwt.isModeator], productsCtrl.createProduct)
//obtener todos los productos
router.get("/", productsCtrl.getProducts)

router.get("/:productId", productsCtrl.getProductById)

router.put("/:productId", [authJwt.verifyToken, authJwt.isAdmin], productsCtrl.updateProductById)
router.delete("/:productId", [authJwt.verifyToken, authJwt.isAdmin], productsCtrl.deleteProductById)
export default router;
