%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#FF9900', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff'}}}%%
graph TD
    %% Usuário e Internet %%
    User[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Generals/User.png' width='40' height='40'/> <br>Usuário / Navegador]:::user
    
    subgraph Internet ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Generals/Internet.png' width='30' height='30'/> <br>Internet Pública (HTTPS)"]
        direction TB
        subgraph DNS_CDN ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Generals/Compute.png' width='30' height='30'/> <br>Camada de Borda (Edge)"]
            Route53[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/NetworkingContentDelivery/AmazonRoute53.png' width='40' height='40'/> <br>Amazon Route 53<br>(Opcional: DNS Elegante)]:::network
            CloudFront[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/NetworkingContentDelivery/AmazonCloudFront.png' width='50' height='50'/> <br>Amazon CloudFront<br>(CDN & HTTPS)]:::network
        end
    end

    %% Região AWS (Lógica) %%
    subgraph AWSRegion ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Generals/AWSCloud.png' width='30' height='30'/> <br>AWS Region (ex: us-east-1)"]
        direction TB
        
        %% Armazenamento Estático (Frontend) %%
        subgraph Frontend_Storage ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Storage/AmazonS3.png' width='30' height='30'/> <br>Armazenamento de Arquivos"]
            S3Bucket[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Storage/AmazonS3Bucket.png' width='40' height='40'/> <br>S3 Bucket (Privado)<br>Hospedagem de Site Estático]:::storage
        end
        
        %% Backend Serverless %%
        subgraph Backend_Serverless ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Serverless/AWSLambda.png' width='30' height='30'/> <br>Lógica de Negócio Assíncrona"]
            APIGateway[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/ApplicationIntegration/AmazonAPIGateway.png' width='50' height='50'/> <br>Amazon API Gateway<br>(HTTP API)]:::appint
            LambdaFunction[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/Compute/AWSLambdaLambdaFunction.png' width='50' height='50'/> <br>AWS Lambda<br>(Handler do Cadastro)]:::compute
        end
        
        %% Mensageria (Assíncrona) %%
        subgraph Messaging ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/ApplicationIntegration/AmazonSQS.png' width='30' height='30'/> <br>Filas de Mensagens"]
            SQSQueue[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/ApplicationIntegration/AmazonSQSQueue.png' width='50' height='50'/> <br>Amazon SQS<br>(Fila de Cadastro)]:::appint
        end
        
        %% Segurança e Monitoramento %%
        subgraph Security_Mgmt ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/SecurityIdentityCompliance/IdentityAndAccessManagement.png' width='30' height='30'/> <br>Segurança & Governança"]
            IAM[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/SecurityIdentityCompliance/IdentityAndAccessManagementIAM.png' width='40' height='40'/> <br>AWS IAM<br>(Permissões de Função)]:::security
            CloudWatch[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/ManagementGovernance/AmazonCloudWatch.png' width='40' height='40'/> <br>Amazon CloudWatch<br>(Logs do Lambda)]:::management
        end
    end

    %% Automação (CI/CD) %%
    subgraph CICD ["<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/DeveloperTools/AWSCloud9.png' width='30' height='30'/> <br>Pipeline de Automação"]
        GitHubActions[<img src='https://avatars.githubusercontent.com/u/10810283?s=200&v=4' width='40' height='40'/> <br>GitHub Actions]:::cicd
        TerraformIcon[<img src='https://raw.githubusercontent.com/hashicorp/terraform-website/master/content/source/assets/images/logo-hashicorp-terraform-vertical-color.svg' width='40' height='40'/> <br>Terraform (IaC)]:::cicd
    end

    %% Fluxos de Conexão - Frontend %%
    User -- "1. Acessa Site (HTTPS)" --> CloudFront
    CloudFront -- "2. Busca Conteúdo (OAC)" --> S3Bucket
    Route53 -.->| "Opcional: DNS A/AAAA" | CloudFront
    ACM -.->| "Certificado SSL" | CloudFront
    
    %% Fluxos de Conexão - Backend %%
    User -- "3. Envia Cadastro (REST POST)" --> APIGateway
    APIGateway -- "4. Aciona Função" --> LambdaFunction
    LambdaFunction -- "5. Envia Mensagem (IAM)" --> SQSQueue
    
    %% Fluxos Internos de Suporte %%
    LambdaFunction -.->| "Gera Logs" | CloudWatch
    IAM -.->| "Valida Permissão" | LambdaFunction

    %% Fluxos de Automação %%
    GitHubActions -- "A. Executa Terraform Apply" --> AWSRegion
    GitHubActions -- "B. Sincroniza S3 & Invalida CF" --> Frontend_Storage
    TerraformIcon -.->| "Gere Infraestrutura" | AWSRegion
    GitHubActions -.->| "Gere Imagem" | TerraformIcon

    %% Definição de Estilos dos Ícones %%
    classDef user fill:#fff,stroke:#333,stroke-width:1px,rx:5,ry:5;
    classDef network fill:#f7fbfc,stroke:#00a1c1,stroke-width:2px,rx:10,ry:10,color:#333;
    classDef storage fill:#fff9f0,stroke:#e05c2c,stroke-width:2px,rx:10,ry:10,color:#333;
    classDef compute fill:#f4f9f4,stroke:#3a7f3a,stroke-width:2px,rx:10,ry:10,color:#333;
    classDef appint fill:#f0f8ff,stroke:#007bff,stroke-width:2px,rx:10,ry:10,color:#333;
    classDef security fill:#fff5f5,stroke:#dc3545,stroke-width:2px,rx:10,ry:10,color:#333;
    classDef management fill:#fcfcfc,stroke:#a0a0a0,stroke-width:2px,rx:10,ry:10,color:#333;
    classDef cicd fill:#fff,stroke:#333,stroke-width:1px,rx:5,ry:5,color:#333;

    %% Ícones Adicionais (ACM) %%
    ACM[<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v18.0/dist/Resource-Icons_10182023/SecurityIdentityCompliance/AWSCertificateManager.png' width='40' height='40'/> <br>AWS Certificate Manager]:::security
    CICD --- ACM
