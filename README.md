graph TD
    %% Usuário e Internet
    User((Usuário / Navegador)):::user

    subgraph Internet [Internet Pública - HTTPS]
        CloudFront{Amazon CloudFront<br/>CDN & HTTPS}:::network
    end

    %% Região AWS
    subgraph AWSRegion [AWS Region: us-east-1]
        
        subgraph Frontend [Armazenamento Frontend]
            S3Bucket[(Amazon S3 Bucket<br/>Site Estático)]:::storage
        end
        
        subgraph Backend [Backend Serverless]
            APIGateway[Amazon API Gateway<br/>HTTP API]:::appint
            LambdaFunction[[AWS Lambda<br/>Handler do Cadastro]]:::compute
        end
        
        subgraph Messaging [Mensajeria]
            SQSQueue[/Amazon SQS<br/>Fila de Cadastro/]:::appint
        end
    end

    %% Automação
    subgraph CICD [Pipeline Automation]
        GitHubActions(GitHub Actions):::cicd
        Terraform(Terraform IaC):::cicd
    end

    %% Fluxos
    User --> CloudFront
    CloudFront -.-> S3Bucket
    User -- POST /cadastro --> APIGateway
    APIGateway --> LambdaFunction
    LambdaFunction --> SQSQueue

    %% Fluxos de Deploy
    GitHubActions --> Terraform
    Terraform --> AWSRegion

    %% Estilos
    classDef user fill:#fff,stroke:#333,stroke-width:2px
    classDef network fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef storage fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef compute fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef appint fill:#e3f2fd,stroke:#0d47a1,stroke-width:2px
    classDef cicd fill:#f5f5f5,stroke:#212121,stroke-width:2px
