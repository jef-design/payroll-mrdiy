import express,{Request,Response} from 'express'
import employeeRoutes from './routes/employeeRoutes'
const app = express()
const PORT = 5000


app.get('/', (req,res) => {
    res.status(200).send('HELLO EXPRESS')
})

app.use('/employee', employeeRoutes)

app.listen(PORT, () => {
    console.log(`listening to PORT ${PORT}`)
})