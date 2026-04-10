
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient({});

exports.handler = async (event) => {
    console.log("Evento recebido:", event);
    
    try {
        const body = JSON.parse(event.body);
        
        const params = {
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify({
                nome: body.nome,
                cpf: body.cpf,
                origem: "Landing Page Itaú Clone",
                data_criacao: new Date().toISOString()
            })
        };

        await sqs.send(new SendMessageCommand(params));

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify({ message: "Dados enviados para a fila SQS com sucesso!" })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Erro interno ao processar cadastro." })
        };
    }
};
