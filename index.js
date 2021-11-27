
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('tiny'));
app.use(cors());

app.use(express.json({limit: '50mb'}));

function sendEmail(emails, email, res) {

    console.log(email);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.SENHA,
        }
    });

    let image = email.img;

    return transporter.sendMail({
        from: `Unip Resort ${process.env.EMAIL}`,
        to: emails,
        subject: email.subject,
        html: 
            `<div 
            style="
            width: 90%;
            border: 1px solid #ccc;
            padding: 20px;
            min-width: 300px;
            max-width: 600px;">
                <div
                style="
                    width: 90%;
                    border: 1px solid #ccc;
                    padding: 20px;
                    min-width: 300px;
                    max-width: 600px;
                ">
                <h3
                    style="
                    text-align: center;
                    padding: 10px;
                    border-radius: 5px;
                    background-color: rgb(0, 140, 255);
                    color: #fff;
                    word-wrap: break-word;
                    font-family: 'Zen Maru Gothic', sans-serif, Arial, Helvetica;
                    "
                >
                    ${email.titulo}
                </h3>
                <div
                    style="width: 100%"
                    class="conteudo"
                >
                    <img
                    style="
                        max-width: 600px;
                        width: 100%;
                        height: 35vw;
                        min-height: 160px;
                        max-height: 330px;
                        background-color: rgb(241, 241, 241);
                        color: #1c1c1c;
                        font-weight: bold;
                        margin: 20px auto;
                        border: none;
                        outline: none;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Zen Maru Gothic', sans-serif, Arial, Helvetica;
                    "
                    class="img-container"
                    src="cid:image"
                    alt="Imagem de exemplo."
                    />
                    <pre
                    style="
                        word-wrap: break-word;
                        word-break: keep-all;
                        white-space: pre-line;
                        width: 100%;
                        font-family: 'Zen Maru Gothic', sans-serif, Arial, Helvetica;
                    "
                    class="text-container">
                    ${email.conteudo}
                    </pre>
                </div>
                </div>
            </div>
            </div>`,

            attachments: [
                {
                    filename: 'img.jpg',
                    path: image,
                    cid: 'image'
                }
            ]


    }).then(info => {
        res.status(200).send({ message: 'Emails enviados com sucesso!' });
    }).catch(er => {
        res.status(500).send({ message: 'Houve um erro no servidor, contate o administrador do sistema ou tente novamente mais tarde.' });
    });

} 

app.post('/', (req, res) => {
    const obj = req.body;

    sendEmail(obj.emails, obj.email, res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running at: http://localhost:' + 3000);
})
