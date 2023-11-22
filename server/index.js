const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());
app.use(cors());

let authenticado = '';

let qrSent = false;


app.post('/create-session', (req, res) => {
    const userId = req.body.userId;

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: `client-${userId}` })
    });

    client.on('qr', async qr => {
        // Evita o envio repetido do código QR
        if (!qrSent) {
            qrSent = true;

            // Gera o código QR e envia como uma imagem
            const qrImage = await qrcode.toDataURL(qr, { scale: 5 });
            res.send(`
                <html>
                    <head>
                        <title>WhatsApp Web QR Code</title>
                    </head>
                    <body>
                        <h1>Scan the QR code to authenticate</h1>
                        <p>User: ${userId}</p>
                        <img src="${qrImage}" alt="QR Code">
                    </body>
                </html>
            `);
        }
    });

    client.on('authenticated', (session) => {
        console.log(`User ${userId} authenticated`);
        authenticado = 'Authenticated';
    });



    client.on('ready', async () => {
        console.log(`User ${userId} is ready!`);

        client.on('message', res => {
            if (res.body == 'Boa') {
                console.log(res.id);
            }
        })
    });

    client.initialize();
    res.json({client: "ryan"});
});



app.post('/send-message', (req, res) => {
    const { userId, message, client } = req.body;


    client.on('ready', async() => {

        await client.sendMessage(`553194424980@c.us`, 'message')
            .then(response => {
                console.log({ status: 'success', message: 'Message sent successfully' });
            })
            .catch(error => {
                console.log({ status: 'error', message: 'Failed to send message' });
            });

    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
