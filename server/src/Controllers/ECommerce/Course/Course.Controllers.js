import Joi from "joi"
import { title } from "../../../Validations/Course/Course.Validations.js"


const courseValidationSchema = Joi.object({
    title : title.required(),
    

})